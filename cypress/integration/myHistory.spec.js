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
        cy.get('#hello-user', { timeout: 10000 }).then(($val) => {
            const text = $val.text();
            if(text.toLowerCase().includes('student')) {
                cy.get('#switch-btn').click()
                cy.get('#hello-user', {timeout: 30000}).should('be.visible')
                cy.wait(5000)
            }
        })
        cy.get(':nth-child(7) > .nav-link').click();

        cy.get('#selectSubject').select('Mathematics');
        cy.get('#selectTitle').type('Calc 1').should('have.value', 'Calc 1');
        cy.get(':nth-child(4) > .next').click();
        var m = new Date();
        var dateString = (m.getUTCMonth()+1) +"/"+ (m.getUTCDate()+1) +"/"+ m.getUTCFullYear()
        cy.get('#selctedDate').clear().type(dateString).should('have.value', dateString);
        cy.get('#submit').click();
        cy.get('.col-7 > .purple-text').scrollIntoView().contains('You Have Successfully Signed Up Your Lesson')
        cy.get(':nth-child(10) > .nav-link').click();
        cy.get('.fc-listDay-button').click()
        cy.get('.fc-next-button').click()
        cy.get('.fc-list-item-title > a', {timeout: 15000}).should('be.visible') 
    })

    it('should not show as having a lesson as student, should succeed', () => {
        cy.visit('/index.html')
        cy.get('#hello-user', { timeout: 10000 }).then(($val) => {
            const text = $val.text();
            if(text.toLowerCase().includes('teacher')) {
                cy.get('#switch-btn').click()
                cy.get('#hello-user', {timeout: 30000}).should('be.visible')
                cy.wait(5000)
            }
        })
        cy.get(':nth-child(10) > .nav-link').click();

        cy.get('.fc-list-empty', {timeout: 15000}).should('be.visible') 
    })
  })