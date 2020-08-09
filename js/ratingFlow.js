var lessonsMap = new Map();
var allTeachers = [];
var allRegisterLessons = [];
let preventDoubleClick = true;
$(document).ready(function () {
    initFireBase();
});

function initFireBase() {
    //init fireBase
    firebase_init = new FirebaseInit();
    //if it not login come back to index
    firebase_init.is_login(null, "index.html");
    //after recognize the user get data from fire base
    firebase.auth().onAuthStateChanged(user => {
        getDataFromDB();
    });
}

function getDataFromDB() {
    firebase.database().ref("/user/teacher").once('value').then(function (snapshot) {
        allTeachers = snapshot.val();
    }).then(() => { //get all my lesson list from DB
        firebase_init.getCurrentClientVariable(getAllLessonsFromDB, "my_lessons_list");
    });
}

function getAllLessonsFromDB(lessonList) {
    for (key in lessonList) {//extract all lesson data
        let registerTeacher = allTeachers[lessonList[key].teacherId];
        let lesson = registerTeacher.lessons[lessonList[key].lessonId];
        if (isPassLesson(lesson.date, lesson.time) && lessonList[key].rated != "true")//check if we want to display the lesson
            allRegisterLessons.push(lesson);
    }
    addLessonsToDataTableInHtml(allRegisterLessons);//write lessons to html
    $('#dataTable_lesson').DataTable();
    disaplayContent();
}

function isPassLesson(selectedDate, selectedTime) {
    let year = selectedDate.split("/")[2];
    let month = selectedDate.split("/")[0];
    let day = selectedDate.split("/")[1];
    let hour = selectedTime.split(":")[0];
    let minute = selectedTime.split(":")[1];
    let actualDate = new Date();
    if (year > actualDate.getFullYear()) return false;
    else if (year < actualDate.getFullYear()) return true;
    else if (month > actualDate.getMonth() + 1) return false;
    else if (month < actualDate.getMonth() + 1) return true;
    else if (day > actualDate.getDate()) return false;
    else if (day < actualDate.getDate()) return true;
    else if (hour > actualDate.getHours()) return false;
    else if (hour < actualDate.getHours()) return true;
    else if (minute > actualDate.getMinutes()) return false;
    else if (minute < actualDate.getMinutes()) return true;

    return false;
}

function addLessonsToDataTableInHtml(allLessons) {
    checkIfNoLessonsToRate(allLessons);
    $("#lesson_data_table").empty();
    let_today = new Date;
    let counter = 0;
    preventDoubleClick = true;
    allLessons.forEach(element => {//write lessons to html
        let photo_url_pic = (element.pic_url ? element.pic_url : "images/blank-profile.png");
        $("#lesson_data_table").append(
            '<tr>' +
            '<td>' + element.date + " " + element.time + '</td>' +
            '<td>' + element.subject + '</td>' +
            '<td>' + element.teacher_name + '</td>' +
            '<td><img src=' + photo_url_pic + ' style="max-height: 80px; max-width: 80px;"></td>' +
            getRateContent(counter) +
            '<td><button id="" type="button" class="btn  saveClicked btn-primary" id_in_array="' + counter++ + '" data_t_uid="' + element.teacher_uid + '" data_l_uid="' + element.lesson_id + '">Save</button></td>' +
            '</tr>'
        );
    });
    initEvents();
}

function checkIfNoLessonsToRate(allLessons) {
    if (allLessons.length == 0) {
        alert("There is no lesson to rate.");
        location.href = "index.html";
    }
}

function getRateContent(idTeacherInTable) {
    return '<td><div class="rate">' +
        '<input type="radio" id="' + idTeacherInTable + '_star5" name="rate_' + idTeacherInTable + '" value="5"  />' +
        '<label for="' + idTeacherInTable + '_star5" title="text">5 stars</label>' +
        '<input type="radio" id="' + idTeacherInTable + '_star4" name="rate_' + idTeacherInTable + '" value="4" />' +
        '<label for="' + idTeacherInTable + '_star4" title="text">4 stars</label>' +
        '<input type="radio" id="' + idTeacherInTable + '_star3" name="rate_' + idTeacherInTable + '" value="3" />' +
        '<label for="' + idTeacherInTable + '_star3" title="text">3 stars</label>' +
        '<input type="radio" id="' + idTeacherInTable + '_star2" name="rate_' + idTeacherInTable + '" value="2" />' +
        '<label for="' + idTeacherInTable + '_star2" title="text">2 stars</label>' +
        '<input type="radio" id="' + idTeacherInTable + '_star1" name="rate_' + idTeacherInTable + '" value="1" />' +
        '<label for="' + idTeacherInTable + '_star1" title="text">1 star</label>' +
        '</div></td>';
}

function initEvents() {
    $(".saveClicked").on("click", function () {
        if (!preventDoubleClick) return; // prevent double entrance
        let lesson_id = $(this).attr("data_l_uid");
        let teacher_id = $(this).attr("data_t_uid");
        let idInDom = $(this).attr("id_in_array");
        updates_class_list = { "rated": "true" };
        firebase.database().ref("/user/client/" + firebase_init.get_user().uid + "/my_lessons_list/" + lesson_id).update(updates_class_list);
        let rate = getRateByStar(idInDom);
        if (rate == -1) {
            alert("You need to rate before you save");
            return;
        }
        var rootRef = firebase.database().ref();
        var storesRef = rootRef.child("/user/teacher/" + teacher_id + "/rateList");
        storesRef.push({
            rateNum: rate,
            from: firebase_init.get_user().uid
        })
        allTeachers = [];
        allRegisterLessons.splice(idInDom, 1);
        preventDoubleClick = false;
        addLessonsToDataTableInHtml(allRegisterLessons);
    });
}

function getRateByStar(idTeacherInTable) {
    if (document.getElementById(idTeacherInTable + '_star5').checked)
        return 5;
    else if (document.getElementById(idTeacherInTable + '_star4').checked)
        return 4;
    else if (document.getElementById('' + idTeacherInTable + '_star3').checked)
        return 3;
    else if (document.getElementById('' + idTeacherInTable + '_star2').checked)
        return 2;
    else if (document.getElementById('' + idTeacherInTable + '_star1').checked)
        return 1;
    return -1;;
}

function disaplayContent() {
    document.getElementById("allContent").style.display = "block";
    document.getElementById("loader").style.display = "none";
}
