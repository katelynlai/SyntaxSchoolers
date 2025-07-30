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
    cy.url().should('include', '/signupPage/signup.html'); // still on the page
  });

  it('submits form when all fields are valid', () => {
    cy.get('#firstname-input').type('Joe');
    cy.get('#surname-input').type('Bloggs');
    cy.get('#username-input').type('joebloggs');
    cy.get('#password-input').type('password');
    cy.get('#repeat-password-input').type('password');
    cy.get('#role').select('Student');

    cy.intercept('POST', '**/users/register', {
      statusCode: 201,
      body: {},
    }).as('register');

    cy.get('form').submit();

    cy.wait('@register');
    cy.url().should('match', /\/loginPage\/login/);
  });
});
