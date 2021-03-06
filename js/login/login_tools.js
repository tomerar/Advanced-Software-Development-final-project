var firebase;
var FirebaseInit = function () {
  console.log("FirebaseInit create");
  /*
     * Variables accessible
     * in the class
     */
  var user_class = "none";

  var vars = {};

  /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
  var root = this;

  /*
     * Constructor
     */
  this.construct = function () {
    this.init_firebase();
    this.logout();


  };

  this.get_user =function () {
    return user_class
  }

  this.getCurrentClientVariable = async function (func,variableName="") {
    firebase.database().ref("/user/client/" + user_class.uid + "/" + variableName ).once('value').then(
      function (snapshot) {
        func(snapshot.val())
      });
  }

  this.getCurrentTeacherVariable =async function (func,variableName="") {
    return firebase.database().ref("/user/teacher/" + user_class.uid + "/" + variableName ).once('value').then(
      function (snapshot) {
        func( snapshot.val());
      });
  }

  this.getCurrentTeacherLessons = async function (myFunc) {
    firebase.database().ref("/user/teacher/" + user_class.uid + "/lessons" ).once('value').then(
      function (snapshot) {
        myFunc( snapshot.val());
      });
  }

  this.setTeacherVariable = async function (myFunc,map) {
    // for (var key in map) {
    //     firebase.database().ref("/user/teacher/" + user_class.uid).set({
    //         key:map.get(key)
    //       });
    // }
    map.forEach(writeToDB)
    myFunc();

  }

  function writeToDB (value,key,map) {
    switch (key) {
    case "bday":
      firebase.database().ref("/user/client/" + user_class.uid).update({
        bday:value
      });
      break;

    default:
      break;
    }


  }
  var what_tracher_see = function () {
    $("#search_a_lesson").css("display", "block");
    $("#add_a_lesson").css("display", "none");
    $("#rank_a_lesson").css("display", "block");
  }

  var what_client_see = function () {
    $("#search_a_lesson").css("display", "none");
    $("#add_a_lesson").css("display", "block");
    $("#rank_a_lesson").css("display", "none");
  }

  var add_user_name_on_nav = function (user) {
    let data_client;

    let data_teacher;

    firebase.database().ref("user/client/" + user.uid).once('value').then(function (snapshot) {
      data_client = snapshot.val();
    }).then(function () {
      firebase.database().ref("user/teacher/" + user.uid).once('value').then(function (snapshot) {
        data_teacher = snapshot.val();
      }).then(function () {
        if (data_teacher.name != null) {
          if (data_client.current_stage == false) {
            $("#hello-user").text("hi teacher " + data_teacher.name);
            $("#hello-user").css("display", "block");
            $("#hello-user").css("color", "yellow");
            what_client_see();
          } else {
            $("#hello-user").text("hi student " + data_client.name);
            $("#hello-user").css("display", "block");
            $("#hello-user").css("color", "#66ffff");
            what_tracher_see();
          }
        }

      });
    });
  }
  var swith_btn = function () {
    $("#switch-btn").on("click", function () {
      var data_teacher_swith_btn;
      var data_client_swith_btn;


      firebase.database().ref("user/teacher/" + user_class.uid).once('value').then(function (snapshot) {


        data_teacher_swith_btn = snapshot.val();
      }).then(function () {
        firebase.database().ref("user/client/" + user_class.uid).once('value').then(function (snapshot) {


          data_client_swith_btn = snapshot.val();
        }).then(function () {


          firebase.database().ref("user/teacher/" + user_class.uid).update({
            current_stage: data_client_swith_btn.current_stage
          }).then(function () {
            firebase.database().ref("user/client/" + user_class.uid).update({
              current_stage: data_teacher_swith_btn.current_stage
            }).then(function () {

              add_user_name_on_nav(user_class)
              window.location.href ="index.html"
            });
          });
        });
      });


    });
  }


  this.init_firebase = function () {
    var firebaseConfig = {
      apiKey: "AIzaSyBYa_jrORmAMavHQMAmKAYqNWLz4Ez7Zaw",
      authDomain: "privatelessons-telhai.firebaseapp.com",
      databaseURL: "https://privatelessons-telhai.firebaseio.com",
      projectId: "privatelessons-telhai",
      storageBucket: "privatelessons-telhai.appspot.com",
      messagingSenderId: "173953946690",
      appId: "1:173953946690:web:a57637bfd0b12cf89409db",
      measurementId: "G-9T7YLMS7X7"
    };
    //   Initialize Firebase

    firebase.initializeApp(firebaseConfig);
    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }

  };

  var update_status_db = function(user_uid,status){
    firebase.database().ref("/user/client/" + user_uid ).update({
      status:status
    });
  }
  var update_on_disconnect_status_db = function(user_uid,status){
    firebase.database().ref("/user/client/" + user_uid ).onDisconnect().update({
      status:status
    });
  }

  var add_html_message_list = function (message_list) {
    var message_list_size = Object.keys(message_list).length;

    console.log("add_html_message_list");
    $("#message_note").html(message_list_size);
    $("#message_note").css("visibility","visible");
    $("#dropdown_boostrap_notification").css("visibility","visible");
    create_message_list(message_list);
  }
  var add_event_delete_msg =function () {
    $(".delete_message").on("click",function () {
      message_id_to_remove = $(this).parent().parent().attr("id")
      firebase.database().ref("/user/client/"+user_class.uid+"/message_list/"+message_id_to_remove).remove();
      update_messages_nav(user_class.uid);
    })
  }
  var create_message_list = function (message_list) {
    $("#dropdown_messages").html("");
    for(key in message_list){
      $("#dropdown_messages").append(
        '<div id="'+key+'" class="row">'+
    '<span class="message_note_date">'+message_list[key].date_msg+'</span>'+
    ' <p class="message_note_text">'+message_list[key].data_msg+
    '<button class="close delete_message"><span>&times;</span></button></p>'+
    '</div>'
      );
    }
    add_event_delete_msg();
  }
  var hide_html_message_list = function () {
    $("#message_note").css("visibility","hidden");
    $("#dropdown_boostrap_notification").css("visibility","hidden");
  }

  this.update_message_to_list = async function (current_user_uid ,message_contect) {
    let currentdate_message = new Date();

    let currnet_date = (currentdate_message.getMonth() + 1) + "/"
                      + currentdate_message.getDate() + "/"
                      + currentdate_message.getFullYear() + "-"
                      + currentdate_message.getHours() + ":"
                      + currentdate_message.getMinutes() + ":"
                      + currentdate_message.getSeconds();

    let new_message = {
      date_msg : currnet_date,
      data_msg : message_contect
    }
    var rootRef = firebase.database().ref();
    var storesRef = rootRef.child('/user/client/'+current_user_uid+'/message_list');
    var newStoreRef = storesRef.push();

    newStoreRef.set(new_message);

  }

  var update_messages_nav = function (current_user_uid) {
    var client_user_db;

    firebase.database().ref("/user/client/"+current_user_uid).once('value', function(snapshot) {
      client_user_db = snapshot.val();
    }).then(function () {
      if ("message_list" in client_user_db) {
        add_html_message_list(client_user_db.message_list);
      }else{
        hide_html_message_list();
      }

    });
  }

  this.is_login = function name(login_page, logout_page) {
    /// is login check
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //update messages
        update_messages_nav(user.uid);
        user_class = user
        console.log(user);
        update_on_disconnect_status_db(user.uid,"offline");
        update_status_db(user.uid,"online");
        add_user_name_on_nav(user);
        $("#logout-btn").css("display", "block");
        $("#login-btn").css("display", "none");
        swith_btn();
        if (user.email.localeCompare("admin@admin.com") == 0) {
          $("#hello-user").attr("href", "admin.html")
        }
        if (login_page != null) {
          window.location.href = login_page;
        }

      } else {
        $("#hello-user").css("display", "none");
        $("#logout-btn").css("display", "none");
        $("#login-btn").css("display", "block");
        console.log("not loging");
        // window.location.href = "login.html";
        if (logout_page != null) {
          window.location.href = logout_page;
        }
      }
    });
  }
  this.logout = function () {
    $("#logout-btn").on("click", function () {
      update_status_db(user_class.uid,"offline")
      firebase.auth().signOut().then(function () {
        console.log("logout successful")
      }).catch(function (error) {
        console.log("logout error " + error);
      });
    });
  }


  /*
     * Pass options when class instantiated
     */
  this.construct();

};

var LoginTools = function () {
  console.log("LoginTools create");
  /*
     * Variables accessible
     * in the class
     */
  var vars = {};

  this.firstTime = false;
  /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
  var root = this;

  /*
     * Constructor
     */
  this.construct = function () {
    this.login_btn();
    this.google_btn();
    this.signup_btn();
    this.username_password_btn();
    this.send_email();
  };

  this.login_btn = function () {
    ///index page
    $("#login").click(function () {
      var emailUser = document.getElementById("first-name").value;
      var passwordUser = document.getElementById("pass").value;
      var errLogMessage = document.getElementById("login-err");

      const auth = firebase.auth();
      const flag = auth.signInWithEmailAndPassword(emailUser, passwordUser);

      flag.catch(function (e) {

        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    e.message + " </p>");
        setTimeout(function () { $("#login-err").empty(); }, 3000);
        console.log(e.message);
        $("#login-err").css("display", "block");

      });
      console.log(emailUser);
      console.log(passwordUser);

    });
  }
  this.google_btn = function () {
    ///login with google
    $("#google-btn").click(function () {
      console.log("click on google btn")

      var provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithRedirect(provider);
    });
  }
  this.signup_btn = function () {
    //sign up  bt on main page
    $("#signup").click(function () {
      window.location.href = "signup.html";
      this.firstTime = true;
    });
  }
  this.username_password_btn = function () {
    $("#username-password").click(function () {
      $("#login").css("display", "none");
      $("#pass").css("display", "none");
      $("#first-name").css("display", "none");
      $("#passdiv").css("display", "none");
      $("#first-namediv").css("display", "none");
      $("#signup").css("display", "none");
      $("#resetemail").css("display", "block");
      $("#resetemaildiv").css("display", "block");
      $("#send-email").css("display", "block");
      $("#login-err").css("display", "none");
      $("#login-err").empty();


    });
  }
  this.send_email = function () {
    $("#send-email").click(function () {
      $("#login").css("display", "block");
      $("#pass").css("display", "block");
      $("#first-name").css("display", "block");
      $("#passdiv").css("display", "block");
      $("#first-namediv").css("display", "block");
      $("#signup").css("display", "block");
      $("#resetemail").css("display", "none");
      $("#resetemaildiv").css("display", "none");
      $("#send-email").css("display", "none");
      $("#login-err").css("display", "none");
      $("#login-err").empty();
      var auth = firebase.auth();
      var emailAddress = document.getElementById("resetemail").value

      console.log(emailAddress);

      auth.sendPasswordResetEmail(emailAddress).then(function () {

        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    "email sent, check your email </p>");
        setTimeout(function () { $("#login-err").empty(); }, 3000);
        $("#login-err").css("display", "block");
      }).catch(function (error) {
        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    error.message + " </p>");
        setTimeout(function () { $("#login-err").empty(); }, 3000);
        $("#login-err").css("display", "block");
        console.log(error);
      });
    });
  }


  /*
     * Pass options when class instantiated
     */
  this.construct();

};

var SignUpTools = function () {
  console.log("SignUpTools create");
  /*
     * Variables accessible
     * in the class
     */
  var vars = {};
  var url_sign_up ="";
  /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
  var root = this;

  /*
     * Constructor
     */
  this.construct = function () {
    this.back_login_btn();
    this.signup_prosses_btn();
    upload_photo();
  };

  this.back_login_btn = function () {
    $("#login2").click(function () {
      window.location.href = "login.html";
    });
  }
  var upload_photo = function () {

    /**upload file */
    var urlNow;
    var fileButton = document.getElementById('photo-upload');
    var uploader = document.getElementById('uploader');

    fileButton.addEventListener('change', function (e) {
      var file = e.target.files[0];
      var path_pic = 'users/profile_img/'+ Math.floor(100000 + Math.random() * 900000) + file.name ;

      console.log(path_pic);

      var storageRef = firebase.storage().ref(path_pic);

      var task = storageRef.put(file);

      task.on('state_changed',
        function progress(snapshot) {
          var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          uploader.value = percentage;
        },
        function error(err) {
          console.log(err);
        },
        function complete() {
          console.log("complete");

          firebase.storage().ref(path_pic).getDownloadURL().then(function (url) {

            url_sign_up =url;
            urlNow = url;
            setTimeout(function () {
              uploader.value = 0;
            }, 3000);
          }).catch(function (error) {
            console.log("on change pic  " + error);
          });
        }
      );


    });


  }

  this.signup_prosses_btn = function () {
    $("#signup2").click(function () {
      $("#login-err").css("display", "none");

      var job;

      job = $('input[name=job]:checked', '#job_sign_up').val()

      var email = $("#first-nameup").val();
      var password = $("#passup").val();
      var password2 = $("#pass2up").val();
      var fullname = $("#fullnameup").val();
      var bday = $("#bdayup").val();
      var dateUser = new Date(bday);


      var pass = "";
      var repass = "";

      pass = $("#passup").val();
      repass = $("#pass2").val();
      console.log(pass);
      console.log(repass);

      if ((pass.length == 0) || (repass.length == 0)) {
        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    "the password is empty </p>");
        setTimeout(function () { $("#login-err").empty(); }, 10000);
        $("#login-err").css("display", "block");
        return;
      }
      else if (pass != repass) {
        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    "the password is not the same </p>");
        setTimeout(function () { $("#login-err").empty(); }, 10000);
        $("#login-err").css("display", "block");
        return;
      }
      else {
        console.log("pass the some");
      }
      if (fullname.length > 20) {
        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    "full name is too long only 20 Letters </p>");
        setTimeout(function () { $("#login-err").empty(); }, 10000);
        $("#login-err").css("display", "block");
        return;
      }
      if (fullname.length == 0) {
        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    "full name is empty</p>");
        setTimeout(function () { $("#login-err").empty(); }, 10000);
        $("#login-err").css("display", "block");
        return;
      }

      if (isDate18orMoreYearsOld(dateUser.getDay(), dateUser.getMonth(), dateUser.getFullYear()) == false) {
        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    "you Must be older than 18 </p>");
        setTimeout(function () { $("#login-err").empty(); }, 10000);
        $("#login-err").css("display", "block");
        return;
      }

      var okToMove = true;

      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        okToMove = false;
        var errorCode = error.code;
        var errorMessage = error.message;

        $("#login-err").append("<p  class='login100-form-err p-b-15' style='display: block;'>" +
                    error.message + " </p>");
        setTimeout(function () { $("#login-err").empty(); }, 3000);


        $("#login-err").css("display", "block");


      }).then(function () {
        console.log("createUserWithEmailAndPassword work sign up the user");
        var userId = firebase.auth().currentUser.uid;

        console.log("userId" + userId);
        let job_cilent = true;

        let job_teacher = false;

        if (job.localeCompare("client") == 0){
          job_cilent = true;
          job_teacher = false;
        }else{
          job_cilent = false;
          job_teacher = true;
        }
        var currentdate = new Date();

        let currnet_date = (currentdate.getMonth() + 1) + "/"
                    + currentdate.getDate() + "/"
                    + currentdate.getFullYear() + "-"
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();


        update_db_and_goto_2_data(
          "user/client/"+userId,
          {
            create_date_user: currnet_date,
            name: fullname,
            email: email,
            bday: bday,
            job: "client",
            uid: userId,
            current_stage: job_cilent,
            pic_url: url_sign_up
          },
          "user/teacher/"+userId,
          {
            create_date_user: currnet_date,
            name: fullname,
            email: email,
            bday: bday,
            job: "teacher",
            uid: userId,
            current_stage: job_teacher,
            pic_url: url_sign_up
          }
          ,"index.html");


      }).then(function () {


      }).catch(function (error) {
        // An error happened.
        console.log(error);

        console.log("error  sign up");
      });


    });
  }
  var update_db = function (path, data) {
    firebase.database().ref(path).set(data).then(function () {

    });
  }
  var update_db_and_goto = function (path, data, goto) {
    firebase.database().ref(path).update(data).then(function () {
      window.location.href = goto;
    });
  }
  var update_db_and_goto_2_data = function (path1, data1,path2,data2, goto) {
    firebase.database().ref(path1).set(data1).then(function () {
      firebase.database().ref(path2).set(data2).then(function () {
        window.location.href = goto;
      });
    });
  }

  var isDate18orMoreYearsOld = function (day, month, year) {
    return new Date(year + 18, month - 1, day) <= new Date();
  }


  /*
     * Pass options when class instantiated
     */
  this.construct();

};
