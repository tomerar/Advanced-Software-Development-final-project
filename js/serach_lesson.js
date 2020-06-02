var subjectList = [];
var firebase_init;
$(document).ready(function () {
  firebase_init = new FirebaseInit();
  getTeacherFromDB();
  initEvent();

});

async function setSelectOptions() {
  await firebase.database().ref("/user/").on('value', function (snapshot) {
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
function initEvent(){
  // $('#submit').click(function () {
  //   let userID = firebase.auth().currentUser.uid;
  //   let selectedTime = document.getElementById("selctedDate").value;
  //   let selectedSubject = document.getElementById("selectSubject").value;
  //   let numberOfStudent = document.getElementById("numberOfStudent").value;
  //   let urlLink = document.getElementById("urlLink").value;
  //   let aboutMe = document.getElementById("aboutMe").value;
  //   var rootRef = firebase.database().ref();
  //   var storesRef = rootRef.child('/user/' + userID + '/lessons');
  //   var newStoreRef = storesRef.push();

  //   newStoreRef.set({
  //     date: selectedTime,
  //     subject: selectedSubject,
  //     number_of_student: numberOfStudent,
  //     link:urlLink,
  //     about_me : aboutMe
  //   });
  // });
}

