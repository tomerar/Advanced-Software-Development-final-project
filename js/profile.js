
$(document).ready(function() {
  var firebase_init = new FirebaseInit();
  firebase_init.is_login(null,"login.html")
  var user = firebase.auth().currentUser;
  firebase.database().ref("user/client/" + user.uid).once('value').then(function (snapshot) {
    data_client = snapshot.val();
  }).then(function () {})
});


