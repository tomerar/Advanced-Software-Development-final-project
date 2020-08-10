/// <reference types="cypress" />

context('Actions', () => {
    const TEST_UID = Cypress.env("TEST_UID");
    beforeEach(() => {
        cy.login()
        cy.addLesson()
        cy.addLessonasStudent()
    })

    afterEach(() => {
        cy.logout();
        cy.removeLesson();
        cy.removeLessonasStudent()
    })
  
    it('should not show as signed up for lesson, should succeed', () => {
        cy.visit('/index.html')
        cy.get(':nth-child(9) > .nav-link').click();

        cy.get('.fc-list-empty', {timeout: 30000}).should('be.visible') 
    })
  })