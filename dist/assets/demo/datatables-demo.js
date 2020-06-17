// Call the dataTables jQuery plugin
$(document).ready(function() {
  firebase.database().ref("/user/" ).once('value').then(function (snapshot) {
    database = snapshot.val();
  }).then(function () { 
      user_data_table_init(database);
  }).then(function () {
    $('#dataTable').DataTable();
  });
});

function create_user(client_user,teacher_user) {
  let index_user = {};
      if("status" in client_user)
        index_user["status"] = client_user.status;
      index_user["date_create_user"] = client_user.create_date_user;
      index_user["user_id"] = client_user.uid;
      index_user["name"] = client_user.name;
      index_user["email"] = client_user.email;
      index_user["stage"] = client_user.current_stage;
  
      if ("lessons" in teacher_user)
          index_user["lessons_create"] = Object.keys(teacher_user.lessons).length ;
          
      if ("my_lessons_list" in client_user)
          index_user["lessons_signed_up"] = Object.keys(client_user.my_lessons_list).length ;
      index_user["photo_url"] = client_user.pic_url;
      
      return index_user;
}
function add_user_data_table_html(all_users) {
  $("#user_data_table").empty();
  all_users.forEach(element => {
    let status_html = 'old version';
    if (element.hasOwnProperty('status')) {
      if (element.status.localeCompare("online")==0) {
        status_html = '<img src=../images/iconfinder_status_online.png>online';
      }else{
        status_html = '<img src=../images/iconfinder_status_offline.png>offline' ;
      }
    }
      let stage = (element.stage ? 'student' : 'teacher');
      let lessons_create = ((element.hasOwnProperty('lessons_create')) ? element.lessons_create : "None")
      let lessons_signed_up = ((element.hasOwnProperty('lessons_signed_up')) ? element.lessons_signed_up : "None")
      let photo_url_pic = (element.photo_url? element.photo_url : "../images/blank-profile.png")
      $("#user_data_table").append(
          '<tr>' +
          '<td>' + status_html + '</td>' +
          '<td>' + element.date_create_user + '</td>' +
          '<td>' + element.user_id + '</td>' +
          '<td>' + element.name + '</td>' +
          '<td>' + element.email + '</td>' +
          '<td>' + stage + '</td>' +
          '<td>' + lessons_create + '</td>' +
          '<td>' + lessons_signed_up + '</td>' +
          '<td><img src=' + photo_url_pic + ' style="max-height: 80px; max-width: 80px;"></td>' +
          '</tr>'
      );
  });
}
function user_data_table_init(database) {
  var all_users = new Array();
  for (key in database.client) {

      if (database.teacher[key] && database.client[key]) {
        all_users.push(create_user(database.client[key],database.teacher[key]));
      }
  }
  add_user_data_table_html(all_users);
}