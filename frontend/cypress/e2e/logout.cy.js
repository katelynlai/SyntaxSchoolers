const { beforeEach } = require("node:test")

describe('Logout functionality', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/landing_page.html', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'fake-jwt-token');
            }
        });
    });

    it('clears token and redirects to login page on logout', () => {
        cy.window().then((win) => {
            cy.stub(win.location, 'assign').as('redirect');
        });

        cy.get('#logout').should('exist').click();

        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null;
        });

        cy.get('@redirect').should('have.been.calledWith', '..loginPage/login.html');

    });

});