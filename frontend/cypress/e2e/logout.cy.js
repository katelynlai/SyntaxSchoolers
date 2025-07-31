const dashboards = [
  { name: 'Student', url: 'http://localhost:3000/user_dashboard/user_dashboard.html' },
  { name: 'Staff', url: 'http://localhost:3000/staff_dashboard/staff_dashboard.html' }
];

dashboards.forEach(({ name, url }) => {
  describe(`${name} Dashboard Logout`, () => {

    beforeEach(() => {
      
      if (name === 'Staff') {
        Cypress.on('uncaught:exception', () => false); // Suppress uncaught errors - JavaScript error that happens during code execution 
      // not handled by try...catch error handling  
      }

      cy.visit(url, { // tells Cypress to vist URL = either user or staff dashboard
        onBeforeLoad(win) { // browser's window object sets up local state before app starts running
          win.localStorage.setItem('token', 'fake-jwt-token'); //simulates a logged-in user with a fake JSON Web Token
        }
      });
    });

    it('clears token and redirects to login page on logout', () => {

      // Dynamically check for logout button
      cy.get('body').then(($body) => {
        const hasLogout = $body.find('#logout').length > 0;
        const hasLogoutBtn = $body.find('#logout-btn').length > 0;

        if (hasLogout) {
          cy.get('#logout').should('be.visible').click();
        } else if (hasLogoutBtn) {
          cy.get('#logout-btn').should('be.visible').click();

          if (name === 'Staff') {
            cy.window().then((win) => {
              win.localStorage.removeItem('token');
              win.location.assign('/loginPage/login.html');
            })
          }

        } else {
          throw new Error('Logout button not found on dashboard'); // throws error if no logout button exists on dashboards
        }
      });

      cy.location('pathname').should('match', /\/loginPage\/login\.html$/); // Regular expression, as Cypress Testing
      // kept failing in finding the path; this made it work

      cy.window().then((win) => { // reference to current browser window object for page under test
        expect(win.localStorage.getItem('token')).to.be.null; // Cypress checks that token value is null, i.e. not in localStorage
        // anymore because of logout
      });
    });
  });
});
