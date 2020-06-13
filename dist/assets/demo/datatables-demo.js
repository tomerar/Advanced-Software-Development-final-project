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

function create_user(database) {
  let index_user = {};
      if("status" in database.client[key])
        index_user["status"] = database.client[key].status;
      index_user["date_create_user"] = database.client[key].create_date_user;
      index_user["user_id"] = database.client[key].uid;
      index_user["name"] = database.client[key].name;
      index_user["email"] = database.client[key].email;
      index_user["stage"] = database.client[key].current_stage;
      if ("lessons" in database.teacher[key])
          index_user["lessons_create"] = Object.keys(database.teacher[key].lessons).length ;
      if ("my_lessons_list" in database.client[key])
          index_user["lessons_signed_up"] = Object.keys(database.client[key].my_lessons_list).length ;
      index_user["photo_url"] = database.client[key].pic_url;
      
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
      all_users.push(create_user(database));
  }
  add_user_data_table_html(all_users);
}