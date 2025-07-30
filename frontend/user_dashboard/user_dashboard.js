// Redirect to Level 1 when the button is clicked

document.addEventListener('DOMContentLoaded', function() {
    const continueBtn = document.querySelector('.student-btn-click-start');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            window.location.href = '../level1/level1.html';
        });
    }
});
