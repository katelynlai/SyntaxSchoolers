let round = 1;
const totalRounds = 5;

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

  if (!draggedElem) {
    console.warn('Dragged element not found for id:', data);
    return;  // Exit early if element doesn't exist
  }

  // Append dragged option to drop zone if not already inside
  if (ev.target.classList.contains('drop-zone')) {
    ev.target.appendChild(draggedElem);
  }
}

async function loadSentence() {
    try {
      const res = await fetch('http://localhost:3000/app/sentence');
      const data = await res.json();
      console.log('Data received from backend:', data);
      const { english, shuffled, sentence_id } = data;
  
      // Set reference sentence
      document.getElementById('sentence-reference').textContent = english;
  
      // Clear previous buttons
      const options = document.getElementById('options');
      options.innerHTML = '';
  
      // Render draggable buttons
      shuffled.trim().split(/\s+/).forEach((word, index) => {
        const btn = document.createElement('button');
        btn.textContent = word;
        btn.className = 'option';
        btn.id = `word-${index}`;
        btn.draggable = true;
        btn.addEventListener('dragstart', dragstartHandler);
        options.appendChild(btn);
      });
  
      // Store sentence ID for POST
      document.getElementById('drop-zone').dataset.sentenceId = sentence_id;
      console.log("Set mmsentenceId to", sentence_id);
  
    } catch (err) {
      console.error('Failed to load sentence:', err);
    }
  }

  
  
  // Load sentence when page loads
  window.addEventListener('DOMContentLoaded', loadSentence);
  
  function updateProgressBar() {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
  
    const percent = Math.round((round - 1) / totalRounds * 100); // round - 1 because it updates *after* correct answer
    fill.style.width = percent + "%";
    text.textContent = percent + "%";
  }



document.getElementById('Submit').addEventListener('click', () => {
    const dropZone = document.getElementById('drop-zone');
    const selectedWords = Array.from(dropZone.children).map(el => el.textContent.trim());
    const sentenceId = dropZone.dataset.sentenceId;
    const userId = 1;
    const levelId = 3

    console.log("sentenceId:", sentenceId);
    console.log("Submitted sentence:", selectedWords);
  
    fetch('http://localhost:3000/app/sentence/submit-sentence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        sentenceId,
        sentence: selectedWords, 
        userId,
        levelId
    })
    })
    .then(res => res.json())
    .then(data => {
        const feedbackEl = document.getElementById('feedback');
      
        if (data.correct) {
          feedbackEl.textContent = "✅ Correct!";
          feedbackEl.style.color = "green";
      
          round++;                  // Only increment round on correct
          updateProgressBar();      // Update progress bar only on correct
      
          if (round <= totalRounds) {
            setTimeout(() => {
              // Clear UI for next round
              feedbackEl.textContent = "";
              document.getElementById('drop-zone').innerHTML = "";
              document.getElementById('options').innerHTML = "";
      
              loadSentence();       // Load next sentence
            }, 1500);               // Delay allows user to see feedback
          } else {
            setTimeout(() => {
              feedbackEl.textContent = "🎉 You completed all rounds!";
              document.getElementById('Submit').disabled = true;
          
              // ✅ Redirect to transition page after short delay
              setTimeout(() => {
                window.location.href = 'http://127.0.0.1:5501/frontend/transitionPage/transition.html?from=level3';
              }, 1500);
            }, 1500);
          }
      
        } else {
          feedbackEl.textContent = "❌ Incorrect, try again.";
          feedbackEl.style.color = "red";
        }
      })
    .catch(err => {
      console.error('Error sending to backend:', err);
    });
  });