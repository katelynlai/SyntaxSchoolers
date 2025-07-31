const dashboards = [
  { name: 'Student', url: 'http://localhost:3000/user_dashboard/user_dashboard.html' }, // student dashboard
  { name: 'Staff', url: 'http://localhost:3000/staff_dashboard/staff_dashboard.html' } // staff dashboard
];    
    
dashboards.forEach(({ name, url }) => {
  describe(`${name} Dashboard Logout`, () => { // will display either student or staff in name
    beforeEach(() => {
      cy.visit(url, {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', 'fake-jwt-token');
        }
      });
    });

    it('clears token and redirects to login page on logout', () => {
        cy.get('#logout').click();
        
        cy.location('pathname').should('include', '/loginPage/login.html');

        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null;
            });
        });
    });
});