var subjectMap = new Map();
$(document).ready(function () {
  firebase_init = new FirebaseInit();
  getLessonsFromDB();
  initEvent();

});
function getLessonsFromDB() {
  firebase.database().ref("/user/").on('value', function (snapshot) {
    snapshot.forEach(function (user) {
      let lessons = user.val().lessons;
      if (lessons != null) {
        for (var key in lessons) {
          let subjectName = lessons[key].subject;
          if (!subjectMap.has(subjectName)) {
            let newSubject = new Subject();
            subjectMap.set(subjectMap, newSubject);
            newSubject.addLesson(new Lesson(lessons[key]));
            console.log(lessons[key]);
          }
        }
      }
    });
  });;
}


