describe('Register Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/signupPage/signup.html');
  });

  it('renders all input fields', () => {
    cy.get('#firstname-input').should('exist');
    cy.get('#surname-input').should('exist');
    cy.get('#username-input').should('exist');
    cy.get('#password-input').should('exist');
    cy.get('#repeat-password-input').should('exist');
    cy.get('#role').should('exist');
  });

  it('prevents form submission with empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/signupPage/signup.html');
  });

  ['Student', 'Staff'].forEach((role) => {

      it(`registers a user with role: ${role}`, () => {
        cy.get('#firstname-input').type('Joe');
        cy.get('#surname-input').type('Bloggs');
        cy.get('#username-input').type('joebloggs');
        cy.get('#password-input').type('password');
        cy.get('#repeat-password-input').type('password');
        cy.get('#role').select(role);

        cy.intercept('POST', '**/users/register', (req) => {
        expect(req.body.role).to.eq(role); // Confirm role sent (student or teacher)
        req.reply({ 
          statusCode: 201,
          body: {} 
        });
    }).as('register');

    cy.get('form').submit();
    cy.wait('@register');
    cy.url().should('match', /\/loginPage\/login/);
    });
  });
});
