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
    
    it('add lesson to teach as teacher, should succeed', () => {
        cy.visit('/index.html')
        cy.wait(4000)
        cy.get('#hello-user', { timeout: 10000 }).should('be.visible').then(($val) => {
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
        cy.get('#selctedDate').clear().type('08/19/2021').should('have.value', '08/19/2021');
        cy.get('#submit').click();
        cy.get('.col-7 > .purple-text').scrollIntoView().contains('You Have Successfully Signed Up Your Lesson')
        
    })

    it('try to add lesson as student, should fail', () => {
        cy.get('#hello-user', { timeout: 10000 }).then(($val) => {
            const text = $val.text();
            if(text.toLowerCase().includes('teacher')) {
                cy.get('#switch-btn').click()
                cy.get('#hello-user', {timeout: 30000}).should('be.visible')
                cy.wait(5000)
            }
        })
        cy.get(':nth-child(7) > .nav-link').should('not.be.visible');
        
    })
  })
  