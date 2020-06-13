var subjectMapByGroup = new Map();
var subjectMapById = new Map();
var counterLesson = 0;
var teachers_data_form_DB;
var subject_data;

$(document).ready(function () {
  var fillter_and_sort = new FillterAndSort();
  var firebase_init = new FirebaseInit();
  firebase_init.is_login(null, "login.html");

  firebase.database().ref("/lessons/").once('value', function (snapshot) {

    subject_data = snapshot.val();
  }).then(function () {
    fillter_and_sort.filter_by_subject(subject_data);
  });

  firebase.database().ref("/user/teacher/").once('value', function (snapshot) {
    teachers_data_form_DB = fillter_and_sort.remove_old_lessons(snapshot.val());
    fillter_and_sort.set_data(teachers_data_form_DB);
  }).then(function () {
    getLessonsFromDB(teachers_data_form_DB);
    disaplayContent();
  });
  fillter_and_sort.active_all_lesson();
  fillter_and_sort.filter_by_key();
  fillter_and_sort.filter_by_date_and_time();
  fillter_and_sort.sort_by_time_big_to_small();
  fillter_and_sort.sort_by_time_small_to_big();

});
function getLessonsFromDB(teachers_data) {
  counterLesson = 0;
  $("#teachersPictures").html("")
  $.each(teachers_data, function (index, user) {
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
      addLessonBtn(lessonId);
      var e = $(this);
      var title = e.data('title');
      var body = e.data('value');
      let lesson = subjectMapById.get(this.id);
      $("#myModal").modal("show");
      $('.modal-title').html(lesson.getLessonTitle());
      $('.modal-subject').html(lesson.getLessonSubject());
      $('.modal-teacher').html("Teacher: " + lesson.getLessonTeacher());
      $('.modal-about').html("<h5>Lesson info:</h5> " + lesson.getAboutMe());
      $('.modal-available').html(lesson.getAvailablePlaces());
      $('.modal-date').html("Date: " + lesson.getLessonDate());
      $('.modal-time').html("Time: " + lesson.getLessonTime());
      $('.modal-lessonid').html("Lesson ID: " + lesson.getLessonID());


    });
  }

}
async function add_to_calender(lesson, userID) {
  let ref_lesson_addres = "/user/teacher/" + lesson.getLessonTeacherUid() + "/lessons/" + lesson.getLessonID();
  let ref_student_addres = "/user/client/" + userID;
  var lesson_in_db;
  var user_in_db;
  var updates_class_list;
  var updates_my_lessons_list;
  await firebase.database().ref(ref_lesson_addres).once('value', function (snapshot) {
    lesson_in_db = snapshot.val();
  });
  await firebase.database().ref(ref_student_addres).once('value', function (snapshot) {
    user_in_db = snapshot.val();
  })

  //check if in the lesson
  if ("class_list" in lesson_in_db) {
    if ((parseInt(lesson_in_db.number_of_student) - lesson_in_db.class_list.length) <= 0) {
      $(".modal-eror").html("lesson is full!!")

      setTimeout(() => {
        $(".modal-eror").html("");
      }, 3000);
      $("#add-lesson-btn").unbind('click');
      return false;
    }
  }
  //check if in the lesson
  if ("class_list" in lesson_in_db) {
    if (lesson_in_db.class_list.indexOf(userID) >= 0) {
      $(".modal-eror").html("you all ready in the lesson")

      setTimeout(() => {
        $(".modal-eror").html("");
      }, 3000);
      $("#add-lesson-btn").unbind('click');
      return false;
    }
  }
  //update db
  if ("class_list" in lesson_in_db) {

    lesson_in_db.class_list.push(userID)
    await firebase.database().ref(ref_lesson_addres + "/class_list").set(lesson_in_db.class_list);
  } else {
    updates_class_list = { "class_list": [userID] };
    await firebase.database().ref(ref_lesson_addres).update(updates_class_list);
  }

  var rootRef = firebase.database().ref();
  var storesRef = rootRef.child(ref_student_addres + "/my_lessons_list/" + lesson.getLessonID());
  // var newStoreRef = storesRef;
  // newStoreRef.set({
  storesRef.set({
    lessonId: lesson.getLessonID(),
    teacherId: lesson.getLessonTeacherUid()
  })
  //update need to loacl lesson
  lesson.class_list.push(userID)
  $('.modal-available').html(lesson.getAvailablePlaces());
  $('#myModal').modal('hide');

}
function addLessonBtn(lessonId) {
  let lesson = subjectMapById.get($(lessonId).attr('id'));
  var userID = firebase.auth().currentUser.uid;

  $("#add-lesson-btn").on("click", function () {
    add_to_calender(lesson, userID);
    $("#add-lesson-btn").unbind('click');
  });
}
function disaplayContent() {
  document.getElementById("allContent").style.display = "block";
  document.getElementById("loader").style.display = "none";
}
