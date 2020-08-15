var database;
var user_uid;

$(document).ready(function () {
  firebase_init = new FirebaseInit();
  firebase_init.is_login(null,"login.html");
  download_db();
});

function download_db(){

  firebase.database().ref("/user").once('value', function (snapshot) {
    database = snapshot.val();
	  }).then(function () {
    user_uid = firebase.auth().currentUser.uid;
	  }).then(function () {
    update_profile(database.client,database.teacher,user_uid)
    displayContent();
	  });

}
function calculateAge(birthday) { // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch

  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function add_click_to_edit__profile_btn(class_user_uid) {
  $("#edit_profile_btn").on("click",function () {
    $("#myModal").modal("show");

  });
  $("#save_changes_btn").on("click",function () {
    let new_name = $("#change_name_input").val();

    $("#myModal").modal('toggle');
    if (new_name.length == 0) {
      alert("name is empty");
      return false;
    }
    firebase.database().ref("/user/client/"+class_user_uid).update({name:new_name})
    firebase.database().ref("/user/teacher/"+class_user_uid).update({name:new_name})
    download_db();
  });
}
function add_click_to_reset_resest_password_send_email_btn(emailAddress) {
  $("#reset_password_btn").on("click",function () {
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
      alert("send email to reset password");
		  }).catch(function(error) {
      alert(error);
		  });
  });
}
function update_profile(client_db,teacher_db, class_user_uid) {
  add_click_to_reset_resest_password_send_email_btn(client_db[class_user_uid].email);
  add_click_to_edit__profile_btn(class_user_uid);
  if (client_db[class_user_uid].pic_url.length!=0) {
    $("#profile_url").attr("src",client_db[class_user_uid].pic_url);
  }
  $("#profile_bday").html(client_db[class_user_uid].bday);
  $("#profile_age").html(calculateAge(new Date(Date.parse(client_db[class_user_uid].bday))));
  $("#profile_name").html(client_db[class_user_uid].name);
  $("#profile_sign_up_date").html(client_db[class_user_uid].create_date_user);
  $("#profile_email").html(client_db[class_user_uid].email);

  if("lessons" in teacher_db[class_user_uid]){
    $("#lessons_opened").html(Object.keys(teacher_db[class_user_uid].lessons).length)
  }
  if("my_lessons_list" in client_db[class_user_uid]){
    $("#lessons_signed_up").html(Object.keys(client_db[class_user_uid].my_lessons_list).length)
  }
  const date1 = new Date();
  const date2 = new Date(Date.parse(client_db[class_user_uid].create_date_user));
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  $("#user_life").html(diffDays);
}


function displayContent(){
  document.getElementById("allContent").style.display = "block";
  document.getElementById("loader").style.display = "none";
}
