// Global var
var my_lessons_as_teacher = [];
var my_lessons_as_student = [];
var calendar;
var calendarEl;
var as_teacher_data;
var as_student_data;
var today_date;
var user_uid;

//build page
$(document).ready(function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today_date = yyyy + '-' + mm + '-' + dd;
  var firebase_init = new FirebaseInit();
  firebase_init.is_login(null, "login.html");
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
});
function disaplayContent() {
  document.getElementById("allContent").style.display = "block";
  document.getElementById("loader").style.display = "none";
}


function fetch_lessons(userID, as_teacher) {
  switch (as_teacher) {
    case true:
      if ("lessons" in as_teacher_data[userID]) {
        let lessons_user = as_teacher_data[userID].lessons
        for (var key in lessons_user) {
          let time = lessons_user[key].time;
          let subjectName = "Teaching " + lessons_user[key].subject;
          let date = lessons_user[key].date;
          let splitDate = date.split("/");
          var currentLesson = ({
            title: subjectName,
            start: `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}T${time}:00` //parse date for FullCalendar format
          });
          my_lessons_as_teacher.push(currentLesson);
        }
      }
      break;

    case false:
      if ("my_lessons_list" in as_student_data) {
        let lessons_user = as_student_data.my_lessons_list
        for (var lesson_details in lessons_user) {
          let lesson_teacher = lessons_user[lesson_details].teacherId;
          let lesson_ID = lessons_user[lesson_details].lessonId;
          lesson = as_teacher_data[lesson_teacher].lessons[lesson_ID];
          let time = lesson.time;
          let subjectName = "Studie " + lesson.subject;
          let date = lesson.date;
          let splitDate = date.split("/");
          var currentLesson = ({
            title: subjectName,
            start: `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}T${time}:00`
          });
          my_lessons_as_student.push(currentLesson);
        }
      }
      break;
  }
  disaplayContent();
  updateEvents();
}

function updateEvents() {

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
      listDay: { buttonText: 'list day' },
      listWeek: { buttonText: 'list week' }
    },

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
    ]

  });
  calendar.render();
}


