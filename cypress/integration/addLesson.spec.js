/// <reference types="cypress" />

context('Actions', () => {
    const TEST_UID = Cypress.env("TEST_UID");
    beforeEach(() => {
        cy.login()
    })

    afterEach(() => {
        cy.logout();
        cy.removeLesson();
    })
  
    it('add lesson to teach, should succeed', () => {
        cy.visit('/index.html')
        cy.get(':nth-child(7) > .nav-link').click();

        cy.get('#selectSubject').select('Mathematics');
        cy.get('#selectTitle').type('Calc 1').should('have.value', 'Calc 1');
        cy.get(':nth-child(4) > .next').click();
        cy.get('#selctedDate').clear().type('08/19/2021').should('have.value', '08/19/2021');
        cy.get('#submit').click();
        cy.get('.col-7 > .purple-text').scrollIntoView().contains('You Have Successfully Signed Up Your Lesson')
        
    })
  })
  