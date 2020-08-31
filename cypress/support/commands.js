import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { attachCustomCommands } from "cypress-firebase";

const fbConfig = {
    apiKey: "AIzaSyBYa_jrORmAMavHQMAmKAYqNWLz4Ez7Zaw",
    authDomain: "privatelessons-telhai.firebaseapp.com",
    databaseURL: "https://privatelessons-telhai.firebaseio.com",
    projectId: "privatelessons-telhai",
    storageBucket: "privatelessons-telhai.appspot.com",
    messagingSenderId: "173953946690",
    appId: "1:173953946690:web:a57637bfd0b12cf89409db",
    measurementId: "G-9T7YLMS7X7"
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });

Cypress.Commands.add('addLesson', () => {
  var m = new Date();
  var dateString = (m.getUTCMonth()+1) +"/"+ (m.getUTCDate()) +"/"+ m.getUTCFullYear()
    const fake = {
        "-MA1vZIf7K7P-62tIDzS" : {
          "about_me" : "",
          "class_list" : [ "NX0ILP24WxXSfAjxlLhFDI8EJZd2" ],
          "date" : dateString,
          "lesson_id" : "-MA1vZIf7K7P-62tIDzS",
          "lesson_title" : "test lesson",
          "link" : "",
          "number_of_student" : "10",
          "pic_url" : "https://firebasestorage.googleapis.com/v0/b/privatelessons-telhai.appspot.com/o/users%2Fprofile_img%2F913291download%20(1).jpg?alt=media&token=d2515bde-d895-42c0-83dc-c50f211e8dd3",
          "subject" : "Art",
          "teacher_name" : "test",
          "teacher_uid" : "9i8FBG8qhpdRoCrVUa0EtkqN4ei1",
          "time" : "23:59"
        }
      }
      cy.callRtdb("set", "/user/teacher/9i8FBG8qhpdRoCrVUa0EtkqN4ei1/lessons", fake);
  })


  Cypress.Commands.add('removeLesson', () => {
    cy.callRtdb("remove", "/user/teacher/9i8FBG8qhpdRoCrVUa0EtkqN4ei1/lessons");
  })

  Cypress.Commands.add('addLessonasStudent', () => {
      const fake = {
          "-MA1vZIf7K7P-62tIDzS" : {
            "lessonId" : "-MA1vZIf7K7P-62tIDzS",
            "teacherId" : "9i8FBG8qhpdRoCrVUa0EtkqN4ei1"
          }
        }
        cy.callRtdb("set", "/user/client/9i8FBG8qhpdRoCrVUa0EtkqN4ei1/my_lessons_list", fake);
    })

    Cypress.Commands.add('removeLessonasStudent', () => {
      cy.callRtdb("remove", "/user/client/9i8FBG8qhpdRoCrVUa0EtkqN4ei1/my_lessons_list");
    })