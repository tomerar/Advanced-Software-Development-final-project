/// <reference types="cypress" />

context('Actions', () => {
    const TEST_UID = Cypress.env("TEST_UID");
    beforeEach(() => {
        cy.login()
        cy.addLesson()
        //cy.addLessonasStudent()
    })

    afterEach(() => {
        cy.logout();
        cy.removeLesson();
        //cy.removeLessonasStudent()
    })
    
    it('should show as having a lesson as teacher, should succeed', () => {
        cy.visit('/index.html')
        cy.wait(4000)
        cy.get('#hello-user').then(($val) => {
            const text = $val.text();
            if(text.toLowerCase().includes('student')) {
                cy.get('#switch-btn').click()
            }
        })
        cy.get(':nth-child(9) > .nav-link').click();

        cy.get('.fc-list-item-title > a', {timeout: 10000}).should('be.visible') 
    })

    it('should not show as having a lesson as student, should succeed', () => {
        cy.visit('/index.html')
        cy.get('#hello-user').then(($val) => {
            const text = $val.text();
            if(text.toLowerCase().includes('teacher')) {
                cy.get('#switch-btn').click()
            }
        })
        cy.get(':nth-child(9) > .nav-link').click();

        cy.get('.fc-list-empty', {timeout: 10000}).should('be.visible') 
    })
  })