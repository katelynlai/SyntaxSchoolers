describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/loginPage/login.html');
  });

  it('renders all required input fields', () => {
    cy.get('#username-input').should('exist');
    cy.get('#password-input').should('exist');
  });

  it('prevents submission with empty fields', () => {
    cy.get('form').submit();
    cy.url().should('match', /\/loginPage\/login$/); // still on page
  });

  it('submits form when all fields are valid', () => {
    cy.get('#username-input').type('joebloggs');
    cy.get('#password-input').type('password');

    cy.intercept('POST', '**/users/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('login');

    cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
    });

    cy.wait('@login');
    cy.url().should('include', '/landing_page');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token');
    });
  });

  it('shows alert on login failure', () => {

const alertStub = cy.stub();
  cy.on('window:alert', alertStub);
    cy.intercept('POST', '**/users/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('login-fail');
    
    cy.get('#username-input').type('invaliduser');
    cy.get('#password-input').type('wrongpassword');

    cy.get('button[type="submit"]').click();

    cy.wait('@login-fail').then(() => {
    expect(alertStub).to.have.been.calledWith('Invalid credentials');
    })
  });
});
