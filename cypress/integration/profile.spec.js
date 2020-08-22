/// <reference types="cypress" />

context('Actions', () => {
    const TEST_UID = Cypress.env("TEST_UID");
    beforeEach(() => {
        cy.login()
    })

    afterEach(() => {
        cy.logout();
        cy.callRtdb("set", "/user/teacher/9i8FBG8qhpdRoCrVUa0EtkqN4ei1/name", 'test');
    })
  
    it('edit profile name, should succeed', () => {
        cy.visit('/index.html')
        cy.get(':nth-child(6) > .nav-link').click();

        cy.get('#edit_profile_btn').click();
        cy.get('#change_name_input').type('tester').should('have.value', 'tester');
        cy.get('#save_changes_btn').click();
        cy.get('#profile_name').scrollIntoView().contains('tester')
        
    })
  })