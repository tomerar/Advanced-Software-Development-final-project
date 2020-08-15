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
    }).then(function () {
      createCalendar();
    });
  });
}

function fetch_lessons(userID, as_teacher) {
  switch (as_teacher) {
  case true:

    if ("lessons" in as_teacher_data[userID]) {
      let lessons_user = as_teacher_data[userID].lessons

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
        let lesson_teacher = lessons_user[lesson_details].teacherId;

        let lesson_ID = lessons_user[lesson_details].lessonId;

        if ("lessons" in as_teacher_data[lesson_teacher]) {
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
    }
    break;
  }
  disaplayContent();
  // createCalendar();
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
  $('.modal-date').html(info.event.extendedProps.date);
  $('.modal-time').html("Time: " + info.event.extendedProps.time);
  $('.modal-link').html("Link: " + info.event.extendedProps.link);
  $('.modal-about').html("<h5>Lesson info:</h5> " + info.event.extendedProps.about);
  if (teacher_of_selected_lesson) {
    $("#remove_btn").html("Cancel this lesson");
  } else {
    $("#remove_btn").html("Cancel my participate");
    $("#edit_btn").hide();
  }
}

function delete_from_DB_click(event) {
  let teacher_of_selected_lesson = (user_uid.localeCompare(event.teacher_uid) == 0);

  switch (teacher_of_selected_lesson) {
  case true:
    let lesson_path = "user/teacher/" + user_uid + "/lessons/" + event.lessonId;

    searchAndDeleteLessonPatrticipate(lesson_path, user_uid, event.lessonId);
    break;

  case false:
    let teacher_path = "user/teacher/" + event.teacher_uid
        + "/lessons/" + event.lessonId + "/class_list";

    let student_path = "user/client/" + user_uid + "/my_lessons_list/" + event.lessonId;

    let ref = firebase.database().ref(student_path);

    ref.remove();
    searchAndDeleteFromList(teacher_path, user_uid);
    let teacherId = event.teacher_uid;

    let message = `Student just cancel his participate in '${event.subject}'`;

    firebase_init.update_message_to_list(teacherId, message);
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
      update_in_student_path = "user/client/" + lesson.class_list[key] + "/my_lessons_list/" + lesson_id;
      let ref = firebase.database().ref(update_in_student_path);

      ref.remove();
    }
    let ref = firebase.database().ref(path);

    ref.remove();

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
    $("#cancel_btn").off("click");
    $("#edit_btn").off("click");
  });
  $("#cancel_btn").click(function () {
    $("#remove_btn").off("click");
    $("#cancel_btn").off("click");
    $("#edit_btn").off("click");
  });
  $("#edit_btn").click(function () {
    edit_lesson_click(event);
    $("#remove_btn").off("click");
    $("#edit_btn").off("click");
    $("#cancel_btn").off("click");
  });

}

function edit_lesson_click(event) {
  let day = event.date.split("/")[1];

  let month = event.date.split("/")[0];

  let year = event.date.split("/")[2];

  let dateControl = document.querySelector('input[type="date"]');

  dateControl.value = year + '-' + month + '-' + day;
  let timeControl = document.querySelector('input[type="time"]');

  timeControl.value = event.time + ":00.00";
  let linkControl = document.querySelector('input[type="url"]');

  linkControl.value = event.link;
  let nosControl = document.querySelector('input[type="number"]');

  nosControl.value = event.nos;

  addEditButtonsFunctions(event);
  $("#editModal").modal("show");
  $('.edit-modal-title').html(event.lesson_title);
  $('.edit-modal-subject').html(event.subject);
  $('.edit-modal-teacher').html("Teacher: " + event.teacher_name);
  $('.edit-modal-about').html("<h5>Lesson info:</h5>");
  $('#editAboutMe').val(event.about)

}

function addEditButtonsFunctions(event) {
  $("#edit_cancel_btn").click(function () {
    $("#apply_btn").off("click");
    $("#edit_cancel_btn").off("click");
  });
  $("#apply_btn").click(function () {
    update_edit_lesson(event);
    $("#apply_btn").off("click");
    $("#edit_cancel_btn").off("click");
  });
}

function update_edit_lesson(event) {

  if (verify_date_edit() && verify_nos_edit(event)) {
    updateEvent(event);
  } else {
    setTimeout(function () { edit_lesson_click(event); }, 200);
  }
}

function verify_date_edit() {
  let currentDate = new Date();

  let dateAlert = "Invalid date&time, must be schedule for future time.\n Please change";

  let dateControl = document.querySelector('input[type="date"]');

  let pickedDate = dateControl.value;

  let year = pickedDate.split('-')[0];

  let month = pickedDate.split('-')[1];

  let day = pickedDate.split('-')[2];

  let timeControl = document.querySelector('input[type="time"]');

  let pockedtime = timeControl.value;

  let hour = pockedtime.split(":")[0];

  let minute = pockedtime.split(":")[1];

  if (year < currentDate.getFullYear()) {
    alert(dateAlert);
    return false;
  }
  else if (year > currentDate.getFullYear()) return true;
  else if (month < currentDate.getMonth() + 1) {
    alert(dateAlert);
    return false;
  }
  else if (month > currentDate.getMonth() + 1) return true;
  else if (day < currentDate.getDate()) {
    alert(dateAlert);
    return false;
  }
  else if (day > currentDate.getDate()) return true;
  else if (hour < currentDate.getHours()) {
    alert(dateAlert);
    return false;
  }
  else if (hour > currentDate.getHours()) return true;
  else if (minute < currentDate.getMinutes()) {
    alert(dateAlert);
    return false;
  }
  else if (minute > actualDate.getMinutes()) return true;

}

function verify_nos_edit(prevEvent) {
  let nosAlert = "Number of students in class can't decrease.\nPlease change"

  let nosControl = document.querySelector('input[type="number"]');

  let nos = nosControl.value;

  if (nos < prevEvent.nos) {
    alert(nosAlert);
    return false;
  }
  return true;
}

function updateEvent(prevEvent) {
  let pathToUpdate = "user/teacher/" + user_uid + "/lessons/" + prevEvent.lessonId;

  let updateDate = document.querySelector('input[type="date"]').value;

  let formatDate = updateDate.split("-")[1] + "/" + updateDate.split("-")[2] + "/" + updateDate.split("-")[0];

  let updateTime = document.querySelector('input[type="time"]').value;

  updateTime = updateTime.substring(0, 5);
  let updateURL = document.querySelector('input[type="url"]').value;

  let updateNOS = document.querySelector('input[type="number"]').value;

  let updateAbout = $('#editAboutMe').val();

  firebase.database().ref(pathToUpdate).update({
    date: formatDate,
    time: updateTime,
    link: updateURL,
    number_of_student: updateNOS,
    about_me: updateAbout
  }).then(function () {
    updateCalendar();
    updateMessagesForStudents(pathToUpdate)
  });
}

function updateMessagesForStudents(path) {
  firebase.database().ref(path).once('value').then(function (snapshot) {
    lesson = snapshot.val();
  }).then(function () {
    if ("class_list" in lesson) {
      for (var key in lesson.class_list) {
        let studentId = lesson.class_list[key];

        let message = `'${lesson.subject}' lesson was updated by ${lesson.teacher_name}, please check`;

        firebase_init.update_message_to_list(studentId, message);
      }
    }
  });
}