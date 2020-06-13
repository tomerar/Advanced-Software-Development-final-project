// Global var
var my_lessons_as_teacher = [];
var my_lessons_as_student = [];
var calendar;
var calendarEl;
var as_teacher_data;
var as_student_data;
var today_date;
var user_uid;
var firebase_init;

//build page
$(document).ready(function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today_date = yyyy + '-' + mm + '-' + dd;
  firebase_init = new FirebaseInit();
  firebase_init.is_login(null, "login.html");
  updateCalendar();
});

function disaplayContent() {
  document.getElementById("allContent").style.display = "block";
  document.getElementById("loader").style.display = "none";
}

function updateCalendar() {
  my_lessons_as_teacher = [];
  my_lessons_as_student = [];
  firebase.database().ref("/user/teacher/").once('value').then(function (snapshot) {
    as_teacher_data = snapshot.val();
  }).then(function () {
    user_uid = firebase_init.get_user().uid;
    fetch_lessons(user_uid, true);
  }).then(function () {
    let path = "/user/client/" + user_uid + "/"
    firebase.database().ref(path).once('value').then(function (snapshot) {
      as_student_data = snapshot.val();
    }).then(function () {
      fetch_lessons(user_uid, false);
    });
  });
}

function fetch_lessons(userID, as_teacher) {
  switch (as_teacher) {
    case true:
      if ("lessons" in as_teacher_data[userID]) {
        let lessons_user = as_teacher_data[userID].lessons
        console.log(lessons_user);
        for (var key in lessons_user) {
          let time = lessons_user[key].time;
          let subjectName = "Teacher - Subject: "
            + lessons_user[key].subject + ", Title: "
            + lessons_user[key].lesson_title;
          let date = lessons_user[key].date;
          let splitDate = date.split("/");
          var currentLesson = ({
            title: subjectName,
            start: `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}T${time}:00`, //parse date for FullCalendar format
            extendedProps: {
              date: date,
              time: time,
              lessonId: lessons_user[key].lesson_id,
              lesson_title: lessons_user[key].lesson_title,
              link: lessons_user[key].link,
              nos: lessons_user[key].number_of_student,
              subject: lessons_user[key].subject,
              teacher_name: lessons_user[key].teacher_name,
              teacher_uid: lessons_user[key].teacher_uid,
              about: lessons_user[key].about_me,
            },
          });
          my_lessons_as_teacher.push(currentLesson);
        }
      }
      break;

    case false:
      if ("my_lessons_list" in as_student_data) {
        let lessons_user = as_student_data.my_lessons_list
        for (var lesson_details in lessons_user) {
          console.log(user_uid);
          let lesson_teacher = lessons_user[lesson_details].teacherId;
          let lesson_ID = lessons_user[lesson_details].lessonId;
          console.log("lessons: ", as_teacher_data[lesson_teacher].lessons);

          lesson = as_teacher_data[lesson_teacher].lessons[lesson_ID];
          let time = lesson.time;
          let subjectName = "Student - Subject: "
            + lesson.subject
            + ", Title: " + lesson.lesson_title;
          let date = lesson.date;
          let splitDate = date.split("/");
          var currentLesson = ({
            title: subjectName,
            start: `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}T${time}:00`,
            extendedProps: {
              date: date,
              time: time,
              lessonId: lesson.lesson_id,
              lesson_title: lesson.lesson_title,
              link: lesson.link,
              nos: lesson.number_of_student,
              subject: lesson.subject,
              teacher_name: lesson.teacher_name,
              teacher_uid: lesson.teacher_uid,
              about: lesson.about_me,
            },
          });
          my_lessons_as_student.push(currentLesson);
        }
      }
      break;
  }
  disaplayContent();
  createCalendar();
}

function createCalendar() {

  if (calendar) calendar.destroy();
  calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['list'],
    height: 425,
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'listDay,listWeek,dayGridMonth'
    },
    views: {
      listDay: { buttonText: 'Day view' },
      listWeek: { buttonText: 'Week view' }
    },
    eventClick: event_click_handler,
    defaultView: 'listWeek',
    defaultDate: today_date, //open calendar in current day
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    eventSources: [
      {
        events: my_lessons_as_teacher,
        color: 'blue'
      },
      {
        events: my_lessons_as_student,
        color: 'green'
      }
    ],

  });
  calendar.render();
}

function event_click_handler(info) {
  let teacher_of_selected_lesson = info.event.title.includes("Teacher");

  addButtonsFunctions(info.event.extendedProps);
  $("#myModal").modal("show");
  $('.modal-title').html(info.event.extendedProps.lesson_title);
  $('.modal-subject').html(info.event.extendedProps.subject);
  $('.modal-teacher').html("Teacher: " + info.event.extendedProps.teacher_name);
  $('.modal-date').html("Date: " + info.event.extendedProps.date);
  $('.modal-time').html("Time: " + info.event.extendedProps.time);
  $('.modal-link').html("Link: " + info.event.extendedProps.link);
  $('.modal-about').html("<h5>Lesson info:</h5> " + info.event.extendedProps.about);
  if (teacher_of_selected_lesson) {
    $("#remove_btn").html("Cancel this lesson");
  } else {
    $("#remove_btn").html("Cancel my participate");
  }
}

function delete_from_DB_click(event) {
  console.log("start delete_from_DB_click");
  console.log(event.teacher_uid);
  console.log(user_uid);

  let teacher_of_selected_lesson = (user_uid.localeCompare(event.teacher_uid) == 0);
  switch (teacher_of_selected_lesson) {
    case true:
      console.log("delete as teacher");
      let lesson_path = "user/teacher/" + user_uid + "/lessons/" + event.lessonId;
      console.log(lesson_path);
      searchAndDeleteLessonPatrticipate(lesson_path, user_uid, event.lessonId);
      break;

    case false:
      console.log("delete as student");
      let teacher_path = "user/teacher/" + event.teacher_uid
        + "/lessons/" + event.lessonId + "/class_list";
      let student_path = "user/client/" + user_uid + "/my_lessons_list/" + event.lessonId;
      let ref = firebase.database().ref(student_path);
      ref.remove();
      searchAndDeleteFromList(teacher_path, user_uid)
      updateCalendar();
      break;
  }
}

function searchAndDeleteLessonPatrticipate(path, user_uid, lesson_id) {
  let participates;
  firebase.database().ref(path).once('value', function (snapshot) {
    lesson = snapshot.val();
  }).then(function () {
    for (var key in lesson.class_list) {
      console.log("key:", key);
      update_in_student_path = "user/client/" + lesson.class_list[key] + "/my_lessons_list/" + lesson_id;
      console.log("update_in_student_path: ", update_in_student_path);
      let ref = firebase.database().ref(update_in_student_path);
      ref.remove();
    }
    console.log("teacher remove path: ", path);
    let ref = firebase.database().ref(path);
    ref.remove();
    console.log("removed from all");
    updateCalendar();
  });
}

function searchAndDeleteFromList(path, user_uid) {
  let class_list_DB;
  firebase.database().ref(path).once('value', function (snapshot) {
    class_list_DB = snapshot.val();
  }).then(function () {
    let index = class_list_DB.indexOf(user_uid);
    class_list_DB.splice(index, 1);
    firebase.database().ref(path).set(class_list_DB);
  });
}

function addButtonsFunctions(event) {
  $("#remove_btn").click(function () {
    delete_from_DB_click(event);
    $("#remove_btn").off("click");
  });
  $("#cancel_btn").click(function () {
    $("#remove_btn").off("click");
    $("#cancel_btn").off("click");
  });
}

