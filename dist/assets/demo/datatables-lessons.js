// Call the dataTables jQuery plugin
var teacher_db;
$(document).ready(function() {
    firebase.database().ref("/user/teacher" ).once('value').then(function (snapshot) {
        teacher_db = snapshot.val();
    }).then(function () { 
        lesson_data_table_init(get_all_lesson(teacher_db));
    }).then(function () {
        
      $('#dataTable_lesson').DataTable();
    });
  });
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
            '<td><button type="button" class="btn btn-danger">Delete</button></td>' +
            '</tr>'
        );
    });
  }
  function lesson_data_table_init(database) {
    var all_lessons = new Array();
    for (key in database) {
        console.log(database[key]);
        all_lessons.push(create_lesson(database[key]));
    }
    console.log(all_lessons);
    
    add_lesson_data_table_html(all_lessons);
  }