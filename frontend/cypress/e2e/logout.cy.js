const dashboards = [
  { name: 'Student', url: 'http://localhost:3000/user_dashboard/user_dashboard.html' },
  { name: 'Staff', url: 'http://localhost:3000/staff_dashboard/staff_dashboard.html' }
];

dashboards.forEach(({ name, url }) => {
  describe(`${name} Dashboard Logout`, () => {
    beforeEach(() => {
      cy.visit(url, {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', 'fake-jwt-token');
        }
      });
    });

    it('clears token and redirects to login page on logout', () => {
      // Dynamically check for logout button
      cy.get('body').then(($body) => {
        if ($body.find('#logout').length > 0) {
          cy.get('#logout').click();
        } else if ($body.find('#logout-btn').length > 0) {
          cy.get('#logout-btn').click();
        } else {
          throw new Error('Logout button not found on dashboard');
        }
      });

      cy.location('pathname').should('include', '/loginPage/login.html');

      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });
  });
});
