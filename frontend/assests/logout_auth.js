document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.assign('./login.html')
})