/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      //cy.visit('/login.html')
      cy.login('akYmJTGxg0Pg5PRMGwlVmV47kB92')
      cy.visit('/search_lesson.html')
      //cy.logout()
    })
  
    it('get the elements we will need', () => {
      cy.addLesson();
      cy.removeLesson();
    })
  })
  