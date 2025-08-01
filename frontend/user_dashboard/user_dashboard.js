document.addEventListener('DOMContentLoaded', async function () {
    const continueBtn = document.querySelector('.student-btn-click-start');
    const levels = document.querySelectorAll('.level-card');
    const userId = 1; // or retrieve from localStorage/session

    // Fetch progress from backend
    let progress;
    try {
        const response = await fetch(`http://localhost:3000/api/progress/${userId}`);
        progress = await response.json();
    } catch (err) {
        console.error('Failed to load progress:', err);
        return;
    }

    // Visual feedback for each level (completed or incomplete)
    const levelStatus = [
        progress.level_1_complete,
        progress.level_2_complete,
        progress.level_3_complete,
    ];

    levelStatus.forEach((isComplete, index) => {
        if (isComplete) {
            levels[index].classList.add('completed');
        } else {
            levels[index].classList.add('incomplete');
        }
    });

    // Determine redirect logic
    let nextLevelUrl = '../level1/level1.html'; // default

    if (progress.level_1_complete && !progress.level_2_complete) {
        nextLevelUrl = '../level2/level2.html';
    } else if (progress.level_2_complete && !progress.level_3_complete) {
        nextLevelUrl = '../level3/level3.html';
    } else if (progress.level_3_complete || progress.all_levels_complete) {
        nextLevelUrl = '#';
        continueBtn.textContent = 'All Levels Completed!';
        continueBtn.disabled = true;
    }

    continueBtn.addEventListener('click', () => {
        if (nextLevelUrl !== '#') {
            window.location.href = nextLevelUrl;
        }
    });
});
