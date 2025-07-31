// Simple frontend state
let gameState = {
    questions: [],
    answers: []
};

async function startGame() {
    // Hide the Start Game button
    document.getElementById('startBtn').style.display = 'none';
    
    try {
        const response = await fetch('http://localhost:3000/api/levels/1/start', {
            method: 'POST'
        });
            const data = await response.json();
            
            if (data.success) {
                gameState.questions = data.data.questions;
                setupGame();
            } else {
                showMessage('Failed to start game: ' + data.message, 'error');
                // Show Start Game button again if there's an error
                document.getElementById('startBtn').style.display = 'inline-block';
            }
        } catch (error) {
            showMessage('Error connecting to server. Please try again.', 'error');
            // Show Start Game button again if there's an error
            document.getElementById('startBtn').style.display = 'inline-block';
        }
    }

    function setupGame() {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('gameArea').classList.remove('hidden');
        
        // Show all questions at once (simplified)
        displayAllWords();
        updateUI();
    }

    function displayAllWords() {
        const englishColumn = document.getElementById('englishColumn');
        const frenchColumn = document.getElementById('frenchColumn');
        
        englishColumn.innerHTML = '<h3 style="text-align: center; margin-bottom: 10px;">English</h3>';
        frenchColumn.innerHTML = '<h3 style="text-align: center; margin-bottom: 10px;">Français</h3>';
        
        // Show all English words
        gameState.questions.forEach(q => {
            const card = createWordCard(q.englishWord, 'english', q.vocabId);
            englishColumn.appendChild(card);
        });
        
        // Show all French words (shuffled)
        const shuffled = [...gameState.questions].sort(() => Math.random() - 0.5);
        shuffled.forEach(q => {
            const card = createWordCard(q.frenchWord, 'french', q.vocabId);
            frenchColumn.appendChild(card);
        });
    }

    function createWordCard(text, type, wordId) {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.textContent = text;
        card.dataset.type = type;
        card.dataset.wordId = wordId; // This creates data-word-id attribute
        card.addEventListener('click', () => selectCard(card, type, wordId));
        return card;
    }

    let selectedEnglish = null;
    let selectedFrench = null;

    function selectCard(card, type, wordId) {
        // Remove previous selections of this type
        document.querySelectorAll(`.word-card[data-type="${type}"]`).forEach(c => {
            c.classList.remove('selected');
        });
        
        card.classList.add('selected');
        
        if (type === 'english') {
            selectedEnglish = wordId;
        } else {
            selectedFrench = wordId;
        }
        
        // Check if both selected
        if (selectedEnglish && selectedFrench) {
            checkMatch();
        }
    }

    function checkMatch() {
        const englishCard = document.querySelector(`[data-type="english"][data-word-id="${selectedEnglish}"]`);
        const frenchCard = document.querySelector(`[data-type="french"][data-word-id="${selectedFrench}"]`);
        
        if (selectedEnglish === selectedFrench) {
            // Correct!
            englishCard.classList.add('correct');
            frenchCard.classList.add('correct');
            englishCard.style.pointerEvents = 'none';
            frenchCard.style.pointerEvents = 'none';
            
            gameState.answers.push({
                englishId: selectedEnglish,
                frenchId: selectedFrench
            });
            
            showMessage('Correct!', 'success');
            
            // Check if all done
            if (gameState.answers.length === gameState.questions.length) {
                setTimeout(async () => {
                    document.getElementById('submitBtn').style.display = 'none';
                    document.getElementById('nextBtn').style.display = 'inline-block';
                    await submitLevel(); // This will show the score message
                }, 1000);
            }
        } else {
            // Wrong
            englishCard.classList.add('incorrect');
            frenchCard.classList.add('incorrect');
            showMessage('Try again!', 'error');
            
            setTimeout(() => {
                englishCard.classList.remove('incorrect', 'selected');
                frenchCard.classList.remove('incorrect', 'selected');
            }, 1000);
        }
        
        // Reset selections
        selectedEnglish = null;
        selectedFrench = null;
        updateUI();
    }

    async function submitLevel() {
        const userId = 1;
        console.log("userId:", userId);
        try {
            const response = await fetch('http://localhost:3000/api/levels/1/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: gameState.answers,
                    userId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage(`Level 1 Complete! ${data.data.percentage}% correct`, 'success');
                document.getElementById('submitBtn').style.display = 'none';
                document.getElementById('nextBtn').style.display = 'inline-block';
            }
        } catch (error) {
            showMessage('Error submitting level.', 'error');
        }
    }

    function updateUI() {
        const current = gameState.answers.length;
        const total = gameState.questions.length;
        const percent = Math.round((current / total) * 100);
    
        //document.getElementById('currentProgress').textContent = current;
        //document.getElementById('totalQuestions').textContent = total;
    
        document.getElementById('progress-fill').style.width = percent + '%';
        document.getElementById('progress-text').textContent = percent + '%';
    }
    

    function showMessage(text, type) {
        const messageArea = document.getElementById('messageArea');
        const messageText = document.getElementById('messageText');
        
        messageText.textContent = text;
        messageArea.classList.remove('hidden');
        
        // Show all messages for 8 seconds
        const duration = 8000;
        
        setTimeout(() => {
            messageArea.classList.add('hidden');
        }, duration);
    }

    async function nextLevel() {
        await submitLevel();
        window.location.href = 'http://127.0.0.1:5501/frontend/transitionPage/transition.html?from=level1';
    }
      

    // Auto-start when page loads
    window.addEventListener('load', startGame);