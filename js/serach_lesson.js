var subjectMapByGroup = new Map();
var subjectMapById = new Map();
var counterLesson = 0;
var teachers_data_form_DB;
var fillter_and_sort ;
$(document).ready(function () {
  var firebase_init = new FirebaseInit();
  firebase_init.is_login(null,"index.html"); 
  firebase.database().ref("/user/teacher/").once('value', function (snapshot) {
    console.log("get form db");
    console.log(snapshot);
    teachers_data_form_DB = snapshot.val()
  }).then(function () {
    getLessonsFromDB(teachers_data_form_DB);
    
  });
  
});
function getLessonsFromDB(teachers_data) {
  
    $("#teachersPictures").html("")
    $.each(teachers_data, function( index, user ) {
      let lessons = user.lessons;
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

  function addEvent() {

  }


}


