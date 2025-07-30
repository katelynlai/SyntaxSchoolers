document.addEventListener("DOMContentLoaded", () => {
    const sentenceContainer = document.getElementById('sentence-container');
    const buttons = document.querySelectorAll('.option');
    const nextRoundButton = document.getElementById('next-round');

    fetch('http://localhost:3000/api/levels/2/question')
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error("Backend error");

            const { 
                frenchwithMissing,
                english,
                correctWord,
                options,
             } = data.data;

            sentenceContainer.innerHTML = `
                <p class="french-sentence">${frenchwithMissing}</p>
                <p class="english-translation"><em>${english}</em></p>
            `;

            buttons.forEach((button, i) => {
                button.style.backgroundColor = 'var(--accent-color)';
                button.disabled = false;
                button.textContent = options[i];

                button.onclick = () => {
                    if (button.textContent === correctWord) {
                        button.style.backgroundColor = 'green';
                        fillMissing(correctWord)
                        disableAllButtons();
                    } else {
                        button.style.backgroundColor = 'red';
                        button.disabled = true;
                    }
                };
            });
        })
        .catch(err => {
            sentenceContainer.textContent = "Error loading question.";
            console.error("Fetch error:", err);
        });

    nextRoundButton.addEventListener('click', () => {
        window.location.href = '../transitionpage/transition.html?score=100';
    });

    function disableAllButtons() {
        buttons.forEach(btn => btn.disabled = true);
    }

    function fillMissing(word) {
        const sentence = document.querySelector('.french-sentence');
        sentence.innerHTML = sentence.innerHTML.replace('___', `<span class="missing-word">${word}</span>`);
    }
});

document.getElementById('next-round').addEventListener('click', () => {
    window.location.reload();
});