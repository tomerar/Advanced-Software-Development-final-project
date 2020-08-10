/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      cy.logout();
    })

    afterEach(() => {
        cy.logout();
    })
  
    it('login with test user: should succeed', () => {
        cy.visit('/login.html', {timeout: 30000});

        cy.get('#first-name').type('test@test.com').should('have.value', 'test@test.com');
        cy.get('#pass').type('12345678');
        cy.get('#login').click();

        cy.url().should('include', '/index.html');
    })

    it('login with user not in db: should fail', () => {
        cy.visit('/login.html', {timeout: 30000});

        cy.get('#first-name').type('fake@test.com').should('have.value', 'fake@test.com');
        cy.get('#pass').type('fake');
        cy.get('#login').click();

        cy.get('#login-err').should('be.visible');
    })
  })
  