var subjectList = [];
var firebase_init
$(document).ready(function () {
  firebase_init = new FirebaseInit();
  firebase_init.is_login(null,"index.html");
  setSelectOptions();
  initEvent();
  $('.datepicker').datepicker("setDate", new Date());
  initProgressBar();

});
function initProgressBar(){
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  var current = 1;
  var steps = $("fieldset").length;
  setProgressBar(current);
  let l = new LoginTools();
  $(".next").click(function () {
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
      step: function (now) {
        // for making fielset appear animation
        opacity = 1 - now;
        current_fs.css({
          'display': 'none',
          'position': 'relative'
        });
        next_fs.css({ 'opacity': opacity });
      },
      duration: 500
    });
    setProgressBar(++current);
  });
  $(".previous").click(function () {

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
      step: function (now) {
        // for making fielset appear animation
        opacity = 1 - now;
        current_fs.css({
          'display': 'none',
          'position': 'relative'
        });
        previous_fs.css({ 'opacity': opacity });
      },
      duration: 500
    });
    setProgressBar(--current);
  });

  function setProgressBar(curStep) {
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
      .css("width", percent + "%")
  }

  $(".submit").click(function () {
    return false;
  })
}
async function setSelectOptions() {
  await firebase.database().ref("/lessons/").on('value', function (snapshot) {
    snapshot.forEach(function (item) {
      subjectList.push(item.key);
    });
    let optionsElements = document.getElementById("selectSubject");
    for (var i = 0; i < subjectList.length; i++) {
      var opt = document.createElement('option');
      opt.value = subjectList[i];
      opt.innerHTML = subjectList[i];
      optionsElements.appendChild(opt);
    }
  });;
}
function initEvent() {
  $('#submit').click(function () {
    var userID = firebase.auth().currentUser.uid;
    var teacher_data;
    firebase.database().ref("/user/teacher/" + userID ).once('value').then(function (snapshot) {
      teacher_data = snapshot.val();
    }).then(function () {
      let selectedDate = document.getElementById("selctedDate").value;
      let selectedSubject = document.getElementById("selectSubject").value;
      let numberOfStudent = document.getElementById("numberOfStudent").value;
      let urlLink = document.getElementById("urlLink").value;
      let aboutMe = document.getElementById("aboutMe").value;
      let selectedTime = document.getElementById("mettingTime").value;
      var rootRef = firebase.database().ref();
      var storesRef = rootRef.child('/user/teacher/' + userID + '/lessons');
      var newStoreRef = storesRef.push();

      newStoreRef.set({
        date: selectedDate,
        subject: selectedSubject,
        number_of_student: numberOfStudent,
        link: urlLink,
        about_me: aboutMe,
        time: selectedTime,
        teacher_uid: userID,
        teacher_name: teacher_data.name,
        pic_url:teacher_data.pic_url
      });

    });
  });
}

