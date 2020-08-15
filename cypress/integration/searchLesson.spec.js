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
  
    it('search for existing lesson as student, should succeed', () => {
        cy.visit('/index.html')
        cy.wait(4000);
        cy.get('#hello-user', {timeout: 30000}).then(($val) => {
            const text = $val.text();
            if(text.toLowerCase().includes('teacher')) {
                cy.get('#switch-btn').click()
                cy.get('#hello-user', {timeout: 30000}).should('be.visible')
                cy.wait(5000)
            }
        })

        cy.get(':nth-child(8) > .nav-link', {timeout: 30000}).click();
        cy.wait(4000);
        cy.get('#search-lesson', {timeout: 30000}).type('test lesson').should('have.value', 'test lesson');
        cy.get('#daterange').clear().type('8/09 09:00 PM 2020 - 8/11 05:00 AM 2021').should('have.value', '8/09 09:00 PM 2020 - 8/11 05:00 AM 2021');
        cy.get('.card-title > :nth-child(2)').scrollIntoView().contains('test lesson')
        
    })

    // it('try to add own lesson as student, should fail', () => {
    //     cy.visit('/index.html')
    //     cy.wait(4000);
    //     cy.get('#hello-user', {timeout: 30000}).then(($val) => {
    //         const text = $val.text();
    //         if(text.toLowerCase().includes('teacher')) {
    //             cy.get('#switch-btn').click()
    //             cy.get('#hello-user', {timeout: 30000}).should('be.visible')
    //             cy.wait(5000)
    //         }
    //     })

    //     cy.get(':nth-child(8) > .nav-link', {timeout: 30000}).click();
    //     cy.wait(4000);
    //     cy.get('#search-lesson', {timeout: 30000}).type('test lesson').should('have.value', 'test lesson');
    //     cy.get('#daterange').clear().type('8/09 09:00 PM 2020 - 8/11 05:00 AM 2021').should('have.value', '8/09 09:00 PM 2020 - 8/11 05:00 AM 2021');
    //     cy.wait(5000)
    //     cy.get('.applyBtn').click()
    //     cy.get('.card-img-top').click()
    //     cy.get('#add-lesson-btn').click()
    //     cy.get('.modal-eror').should('be.visible')
        
    // })

    it('search for existing lesson as teacher, should fail', () => {
        cy.get('#hello-user', { timeout: 10000 }).then(($val) => {
            const text = $val.text();
            if(text.toLowerCase().includes('student')) {
                cy.get('#switch-btn').click()
                cy.get('#hello-user', {timeout: 30000}).should('be.visible')
                cy.wait(5000)
            }
        })
        cy.get(':nth-child(8) > .nav-link').should('not.be.visible');
        
    })
  })