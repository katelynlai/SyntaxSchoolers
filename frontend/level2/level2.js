const sentenceContainer = document.getElementById('sentence-container');
const optionsContainer = document.getElementById('options-container');
const englishDiv = document.getElementById('english-translation');
const submitBtn = document.getElementById('Submit');


let currentRound = 1;
const maxRounds = 5;
let currentSentenceId = null;  // store sentence ID for answer checking

async function init() {
    if (currentRound > maxRounds) {
      showFinalMessage();
      return;
    }
  
    clearContainers();
    clearFeedback();
    updateProgress(currentRound, maxRounds);
  
    try {
      const data = await fetchSentence();
      if (!data) throw new Error('No sentence data received');
  
      currentSentenceId = data.sentence_id; // IMPORTANT: capture sentence_id for submit
  
      renderSentenceWithDropZone(data.french_with_gap);
      renderEnglishTranslation(data.english_translation);
  
      const options = shuffleArray([data.missing_word, ...data.distractors]);
      renderOptions(options);
  
      setupDragAndDrop();
      submitBtn.disabled = false; // enable submit button for new round
    } catch (err) {
      console.error('Error initializing sentence:', err);
    }
  }

function clearContainers() {
  sentenceContainer.innerHTML = '';
  optionsContainer.innerHTML = '';
  englishDiv.textContent = '';
}

function renderSentenceWithDropZone(sentence) {
  const parts = sentence.split('___');

  sentenceContainer.appendChild(document.createTextNode(parts[0]));

  const dropZone = createDropZone();
  sentenceContainer.appendChild(dropZone);

  sentenceContainer.appendChild(document.createTextNode(parts[1]));
}

function createDropZone() {
  const dropZone = document.createElement('div');
  dropZone.className = 'drop-zone';
  dropZone.id = 'drop-zone';
  dropZone.style.display = 'inline-block';
  dropZone.style.minWidth = '80px';
  dropZone.style.borderBottom = '2px solid black';
  dropZone.style.margin = '0 5px';
  dropZone.style.padding = '2px 5px';
  dropZone.style.verticalAlign = 'bottom';

  dropZone.addEventListener('dragover', dragoverHandler);
  dropZone.addEventListener('drop', dropHandler);

  return dropZone;
}

function renderEnglishTranslation(text) {
  englishDiv.textContent = text;
}

function renderOptions(words) {
  words.forEach((word, idx) => {
    const btn = createDraggableOption(word, idx);
    optionsContainer.appendChild(btn);
  });
}

function createDraggableOption(word, idx) {
  const btn = document.createElement('button');
  btn.textContent = word;
  btn.className = 'option';
  btn.id = `option-${idx}`;
  btn.draggable = true;
  btn.addEventListener('dragstart', dragstartHandler);
  return btn;
}

function setupDragAndDrop() {
  optionsContainer.addEventListener('dragover', dragoverHandler);
  optionsContainer.addEventListener('drop', returnDropHandler);
}

// --- DRAG & DROP HANDLERS ---

function dragstartHandler(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const draggedElem = document.getElementById(data);
  if (!draggedElem) return;

  // Clear previous contents and append dragged element to drop zone
  ev.target.innerHTML = '';
  ev.target.appendChild(draggedElem);
}

function returnDropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const draggedElem = document.getElementById(data);
  if (!draggedElem) return;

  // If dragged element not inside optionsContainer, append it back
  if (!optionsContainer.contains(draggedElem)) {
    optionsContainer.appendChild(draggedElem);
  }
}

// --- FETCH FROM BACKEND ---
const usedSentenceIds = new Set();

async function fetchSentence() {
    const maxRetries = 10; // avoid infinite loop
    let attempts = 0;
  
    while (attempts < maxRetries) {
      try {
        const res = await fetch('http://localhost:3000/app/level2/random');
        if (!res.ok) throw new Error('Failed to fetch sentence');
        const data = await res.json();
  
        if (!usedSentenceIds.has(data.sentence_id)) {
          usedSentenceIds.add(data.sentence_id);
          return data;
        }
  
        attempts++;
      } catch (err) {
        console.error('Fetch error:', err);
        return null;
      }
    }
  
    console.warn("Couldn't find a new unique sentence.");
    return null;
  }

// --- UTILITY ---

function shuffleArray(arr) {
  return arr
    .map(val => ({ val, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ val }) => val);
}


// Progress bar

function updateProgress(currentRound, maxRounds) {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
  
    // Calculate percentage of completed rounds (round - 1)
    const percent = Math.round(((currentRound - 1) / maxRounds) * 100);
  
    fill.style.width = percent + "%";
    text.textContent = percent + "%";
  }
  


  const feedbackDiv = document.getElementById('feedback');

  submitBtn.addEventListener('click', async () => {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone || dropZone.children.length === 0) {
      feedbackDiv.textContent = 'Please drag an option into the blank before submitting.';
      feedbackDiv.style.color = 'red';
      return;
    }
    const userId = 1; //hard-coded userId
    const levelId = 2 //hard-coded levelId
    const selectedWord = dropZone.children[0].textContent;
  
    try {
      const res = await fetch('http://localhost:3000/app/level2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            sentenceId: currentSentenceId, 
            answer: selectedWord,
            userId,
            levelId
         }),
      });
  
      if (!res.ok) throw new Error('Failed to submit answer');
  
      const result = await res.json();
  
      if (result.correct) {
        feedbackDiv.textContent = 'Correct! 🎉';
        feedbackDiv.style.color = 'green';
        submitBtn.disabled = true;
  
        currentRound++; // increment before checking
        updateProgress(currentRound, maxRounds);
  
        if (currentRound > maxRounds) {
          setTimeout(() => {
            window.location.href = '../transitionpage/transition.html';
          }, 3000); // delay to let user see feedback
        } else {
          setTimeout(() => {
            init(); // Load next question
          }, 1500);
        }
  
      } else {
        feedbackDiv.textContent = 'Incorrect. Try again!';
        feedbackDiv.style.color = 'red';
      }
  
    } catch (err) {
      console.error('Submit error:', err);
      feedbackDiv.textContent = 'Error submitting your answer.';
      feedbackDiv.style.color = 'red';
    }
  });
  
  
  function clearFeedback() {
    feedbackDiv.textContent = '';
  }  

// --- INITIALIZE ON PAGE LOAD ---
init();









