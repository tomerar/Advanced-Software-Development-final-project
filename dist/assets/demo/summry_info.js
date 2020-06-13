var summry_database
var today_date_active = new Date();
$(document).ready(function() {
    
    var starCountRef = firebase.database().ref("/user/");
    starCountRef.on('value', function(snapshot) {
        summry_database = snapshot.val();
        upddate_summrys(summry_database);
        disaplayContent();
    });
        
  });
function update_all_user(summry_database) {
    return Object.keys(summry_database["client"]).length
}
function update_all_user_online(summry_database) {
    let count_online = 0 ;
    for(key in summry_database["client"])
    {
        if("status" in summry_database["client"][key] ){
            if (summry_database["client"][key].status.localeCompare("online")==0) {
                count_online++;
            }
        }
    }
    return count_online;
}
function update_all_lessons(summry_database) {
    let count_all_lessons = 0 ;
    for(key in summry_database["teacher"])
    {
        if("lessons" in summry_database["teacher"][key] ){
            
            count_all_lessons+= Object.keys(summry_database["teacher"][key].lessons).length;
        }
    }
    return count_all_lessons;
}
function update_all_lessons_active(summry_database) {
    let count_all_lessons_active = 0 ;
    for(key in summry_database["teacher"])
    {
        if("lessons" in summry_database["teacher"][key] ){
            for(key_lesson in summry_database["teacher"][key].lessons){
                let temp_date = summry_database["teacher"][key].lessons[key_lesson].date;
                let temp_time = summry_database["teacher"][key].lessons[key_lesson].time;
                let date_comp = new Date(Date.parse(temp_date+" "+temp_time))
                if (today_date_active<date_comp) {
                    count_all_lessons_active++
                }

            }
        }
    }
    return count_all_lessons_active;
}
var upddate_summrys = function (summry_database) {
    $("#user_summary").empty();
    $("#online_user_summary").empty();
    $("#lessons_all_summary").empty();
    $("#lessons_active_summary").empty();
    $("#user_summary").append(update_all_user(summry_database));
    $("#online_user_summary").append(update_all_user_online(summry_database));
    $("#lessons_all_summary").append(update_all_lessons(summry_database));
    $("#lessons_active_summary").append(update_all_lessons_active(summry_database));
      
  }

  function disaplayContent(){
    document.getElementById("allContent").style.display = "block";
    document.getElementById("loader").style.display = "none";
  }