/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      //cy.visit('/login.html')
      cy.login('9i8FBG8qhpdRoCrVUa0EtkqN4ei1')
      cy.visit('/search_lesson.html')
      //cy.logout()
    })
  
    it('get the elements we will need', () => {
      cy.addLesson();
      cy.removeLesson();
    })
  })
  