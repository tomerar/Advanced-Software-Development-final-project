var subjectMapByGroup = new Map();
var subjectMapById = new Map();
var counterLesson = 0;
$(document).ready(function () {
  var firebase_init = new FirebaseInit();
  firebase_init.is_login(null,"index.html"); 
  getLessonsFromDB();
});
async function getLessonsFromDB() {
  firebase.database().ref("/user/teacher/").on('value', function (snapshot) {
    snapshot.forEach(function (user) {
      let lessons = user.val().lessons;
      if (lessons != null) {
        for (var key in lessons) {
          let subjectName = lessons[key].subject;
          let newLesson = new Lesson(lessons[key], key, counterLesson)
          if (!subjectMapByGroup.has(subjectName)) {
            let newSubject = new Subject();
            subjectMapByGroup.set(subjectMapByGroup, newSubject);
            newSubject.addLesson(newLesson);
          }
          else {
            subjectMapByGroup.get(subjectName).addLesson(newLesson);
          }
          let lessonId = 'lesson_' + counterLesson + '';
          subjectMapById.set(lessonId, newLesson);
          counterLesson++;
        }
      }
    });
    for (let index = 0; index < counterLesson; index++) {
      let lessonId = '#lesson_' + index + '';
      $(lessonId).click(function () {
        event.preventDefault();
        var e = $(this);
        var title = e.data('title');
        var body = e.data('value');
        let lesson = subjectMapById.get(this.id);
        $("#myModal").modal("show");
        $('.modal-title').html(lesson.getLessonName());
        $('.modal-body').html(this.id);
      });
    }
  });;

  function addEvent() {

  }


}


