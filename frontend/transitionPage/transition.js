function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
  
  function goToNextLevel() {
    const from = getQueryParam('from');
  
    switch (from) {
      case 'level1':
        window.location.href = '../level2/level2.html';
        break;
      case 'level2':
        window.location.href = '../level3/level3.html';
        break;
      case 'level3':
        window.location.href = '../user_dashboard/user_dashboard.html';
        break;
      default:
        window.location.href = '../homepage/homepage.html';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const from = getQueryParam('from');
    const btn = document.querySelector('.start-btn');
  
    if (from === 'level3') {
      btn.textContent = 'Return to Dashboard';
    }
  });
  