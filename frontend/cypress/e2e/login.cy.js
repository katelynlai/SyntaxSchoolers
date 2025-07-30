describe('Login Form', () => {
  beforeEach(() => {
cy.visit('http://localhost:3000/loginPage/login.html');
  });

  it('renders all required input fields', () => {
    cy.get('#username-input').should('exist');
    cy.get('#password-input').should('exist');
  });

  it('prevents submission with empty fields', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.get('form').within(() => {
    cy.get('button[type="submit"]').click();
  });

    
  cy.url().should('include', '/loginPage/login.html');
  });

  it('submits form when all fields are valid', () => {
      cy.intercept('POST', '**/users/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token', role: 'Student' }
    }).as('login');

    cy.get('#username-input').type('joebloggs');
    cy.get('#password-input').type('password');

    cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
    });

    cy.wait('@login');
    cy.url().should('include', '/dashboardPages/user_dashboard.html');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token');
      expect(win.localStorage.getItem('role')).to.eq('Student');
    });
  });

  it('shows alert on login failure', () => {

    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.intercept('POST', '**/users/login', {
      statusCode: 401,
      body: { 
        error: 'Invalid credentials'
      }
    }).as('login-fail');
    
    cy.get('#username-input').type('invaliduser');
    cy.get('#password-input').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@login-fail').then(() => {
    expect(alertStub).to.have.been.calledWith('Login failed: Invalid credentials');
    })
  });
});
