document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById('logout') || document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.assign('../loginPage/login.html');
    });
  }
});