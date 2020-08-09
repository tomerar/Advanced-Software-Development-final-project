/// <reference types="cypress" />

context('Actions', () => {
    const TEST_UID = Cypress.env("TEST_UID");
    beforeEach(() => {
        cy.login()
        cy.addLesson()
    })

    afterEach(() => {
        cy.logout();
        cy.removeLesson();
    })
  
    it('search for existing lesson, should succeed', () => {
        cy.visit('/index.html')
        cy.get(':nth-child(8) > .nav-link').click();

        cy.get('#search-lesson', {timeout: 30000}).type('test lesson').should('have.value', 'test lesson');
        cy.get('#daterange').clear().type('8/09 09:00 PM 2020 - 8/11 05:00 AM 2021').should('have.value', '8/09 09:00 PM 2020 - 8/11 05:00 AM 2021');
        cy.get('.card-title > :nth-child(2)').scrollIntoView().contains('test lesson')
        
    })
  })