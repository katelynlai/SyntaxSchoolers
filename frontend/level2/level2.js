document.addEventListener("DOMContentLoaded", () => {
    const sentenceContainer = document.getElementById('sentence-container');
    const buttons = document.querySelectorAll('.option');

    fetch('/api/levels/2/question')
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error("Backend error");

            const { sentence, options, correctWord } = data.data;

            sentenceContainer.innerHTML = sentence.replace(
                '___',
                `<span class="blank" id="blank-space">_____</span>`
            );

            buttons.forEach((button, i) => {
                button.style.backgroundColor = 'var(--accent-color)';
                button.disabled = false;
                button.textContent = options[i];

                button.onclick = () => {
                    if (button.textContent === correctWord) {
                        button.style.backgroundColor = 'green';
                        document.getElementById('blank-space').textContent = correctWord;
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

    function disableAllButtons() {
        buttons.forEach(btn => btn.disabled = true);
    }
});

document.getElementById('next-round').addEventListener('click', () => {
    window.location.reload();
});