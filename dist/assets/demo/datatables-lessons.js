// Call the dataTables jQuery plugin
var teacher_db;
$(document).ready(function() {
  download_db();
  });
  function download_db() {
          firebase.database().ref("/user/teacher" ).once('value').then(function (snapshot) {
            teacher_db = snapshot.val();
        }).then(function () { 
            lesson_data_table_init(get_all_lesson(teacher_db));
        }).then(function () {
          disaplayContent();
          $('#dataTable_lesson').DataTable();
          remove_lesoson();
        });
  }
  function get_all_lesson(data_lessons) {
    let index_teacher;
    let final= {};
    let lessons = {};
    $.each(data_lessons, function (index, co) {
      index_teacher = index
      if("lessons" in co){
        for (var key in co.lessons){
          if("lesson_title" in co.lessons[key]){  
              lessons[key]= co.lessons[key];
          }

        }
      }
    });
    // final[index_teacher]= {lessons:lessons};
    return lessons   
  }
  function create_lesson(database) {
    let index_lesson = {};
        
        index_lesson["about_me"] = database.about_me;
        if ("class_list" in database)
            index_lesson["class_list"] = database.class_list;
        index_lesson["date"] = database.date;
        index_lesson["time"] = database.time;
        index_lesson["lesson_id"] = database.lesson_id;
        index_lesson["lesson_title"] = database.lesson_title;
        index_lesson["number_of_student"] = database.number_of_student ;
        index_lesson["pic_url"] = database.pic_url ;
        index_lesson["subject"] = database.subject ;
        index_lesson["teacher_name"] = database.teacher_name ;
        index_lesson["teacher_uid"] = database.teacher_uid ;            
        return index_lesson;
  }
  function add_lesson_data_table_html(all_users) {
    $("#lesson_data_table").empty();
    let_today = new Date;
    all_users.forEach(element => {
        let status_lesson = 'old version';
        let lesson_date_time = new Date(Date.parse(element.date+" "+element.time))
        if (let_today< lesson_date_time ) {
            status_lesson = '<img src=../images/iconfinder_status_online.png>active';
        }else{
            status_lesson = '<img src=../images/iconfinder_status_offline.png>no active' ;
        }
      
        
        let size_class = ((element.hasOwnProperty('class_list')) ? Object.keys(element.class_list).length : "0")
        let lesson_info = (element.about_me.length!=0? element.about_me : "None")
        let photo_url_pic = (element.pic_url? element.pic_url : "../images/blank-profile.png")
        $("#lesson_data_table").append(
            '<tr>' +
            '<td>' + status_lesson + '</td>' +
            '<td>' + element.date +" " + element.time+'</td>' +
            '<td>' + size_class + '</td>' +
            '<td>' + element.lesson_id + '</td>' +
            '<td>' + element.subject + '</td>' +
            '<td>' + element.lesson_title + '</td>' +
            '<td>' + lesson_info + '</td>' +
            '<td>' + element.number_of_student + '</td>' +
            '<td>' + element.teacher_name + '</td>' +
            '<td>' + element.teacher_uid + '</td>' +
            '<td><img src=' + photo_url_pic + ' style="max-height: 80px; max-width: 80px;"></td>' +
            '<td><button type="button" class="btn btn-danger remove_lesson_btn" data_t_uid="'+element.teacher_uid+'" data_l_uid="'+element.lesson_id+'">Delete</button></td>' +
            '</tr>'
        );
    });
  }
  function remove_lesoson() {
    console.log("remove_lesson_btn");
    $(".remove_lesson_btn").on("click",function () {
      console.log("click remove_lesson_btn");
      
      let lesson_id = $(this).attr("data_l_uid")
      let teacher_id = $(this).attr("data_t_uid")

      console.log(lesson_id);
      console.log(teacher_id);
      console.log("/user/teacher/"+teacher_id+"/lessons/"+lesson_id);
      var teacher_db;
      firebase.database().ref("/user/teacher/"+teacher_id+"/lessons/"+lesson_id).once("value",function (DB) {
        teacher_db=DB.val();
      }).then(function () {
        console.log(teacher_db);
        
        if('class_list' in teacher_db){
          for(key in teacher_db.class_list){
            console.log("/user/client/"+teacher_db.class_list[key]+"/my_lessons_list/"+lesson_id);
            
            firebase.database().ref("/user/client/"+teacher_db.class_list[key]+"/my_lessons_list/"+lesson_id).once("value",function (client_db) {
             console.log(client_db.val());
             firebase.database().ref("/user/client/"+teacher_db.class_list[key]+"/my_lessons_list/"+lesson_id).remove();
             
            })
          }
        }
      }).then(function () {

        firebase.database().ref("/user/teacher/"+teacher_id+"/lessons/"+lesson_id).remove()
      }).then(function () {
        download_db();
      })
      
    })
    
  }
  function lesson_data_table_init(database) {
    var all_lessons = new Array();
    for (key in database) {
      if (database[key] ) {
        all_lessons.push(create_lesson(database[key]));
      }
    }
    
    add_lesson_data_table_html(all_lessons);
  }
  function disaplayContent(){
    document.getElementById("allContent").style.display = "block";
    document.getElementById("loader").style.display = "none";
  }