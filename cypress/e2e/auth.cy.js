// Handle uncaught exceptions for this test file
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard')
    
  })

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('wrong@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()
    
    // Verify error message
    cy.get('[data-testid="login-error"]').should('be.visible')
    cy.get('[data-testid="login-error"]').should('contain', 'Invalid credentials')
    
    // Verify we're still on login page
    cy.url().should('include', '/login')
  })

  it('should redirect to login when accessing protected route', () => {
    // Try to access dashboard without logging in
    cy.visit('/dashboard')
    
    // Verify redirect to login
    cy.url().should('include', '/login')
  })
})
