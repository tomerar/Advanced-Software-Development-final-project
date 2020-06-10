
var FillterAndSort = function () {
    console.log("fillter_and_sort");
    /*
     * Variables accessible
     * in the class
     */
   
   
    var vars = {};
    
    var data_lessons;
    this.set_data = function (data_temp) {
       data_lessons = data_temp;
    };
    this.get_data = function () {
        
       return data_lessons;
    };

    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var counter_date = 0;
    var update_to_db
    var root = this;
    this.set_update_to_db =function (params) {
        update_to_db = params;
    };
    var getLessonsFromDB = function(teachers_data) {
      counterLesson = 0;
        $("#teachersPictures").html("")
        $.each(teachers_data, function( index, user ) {
          let lessons = user.lessons;
          if (lessons != null) {
            for (var key in lessons) {
              let subjectName = lessons[key].subject;
              let newLesson = new Lesson(lessons[key], key, counterLesson)
              if (!subjectMapByGroup.has(subjectName)) {
                let newSubject = new Subject();
                subjectMapByGroup.set(subjectMapByGroup, newSubject);
                newSubject.addLesson(newLesson);
              }
              else {
                subjectMapByGroup.get(subjectName).addLesson(newLesson);
              }
              let lessonId = 'lesson_' + counterLesson + '';
              subjectMapById.set(lessonId, newLesson); 
              counterLesson++;
            }
          }
        });
        for (let index = 0; index < counterLesson; index++) {
          let lessonId = '#lesson_' + index + '';
          $(lessonId).click(function () {
            event.preventDefault();
            addLessonBtn(lessonId);
            var e = $(this);
            var title = e.data('title');
            var body = e.data('value');
            let lesson = subjectMapById.get(this.id);
            $("#myModal").modal("show");
            $('.modal-title').html(lesson.getLessonTitle());
            $('.modal-subject').html(lesson.getLessonSubject());
            $('.modal-teacher').html("Teacher: "+lesson.getLessonTeacher());
            $('.modal-about').html("<h5>Lesson info:</h5> "+lesson.getAboutMe());
            $('.modal-available').html(lesson.getAvailablePlaces());
            $('.modal-date').html("Date: "+lesson.getLessonDate());
            $('.modal-time').html("Time: "+lesson.getLessonTime());
            $('.modal-lessonid').html("Lesson ID: "+lesson.getLessonID());
           
           
          });
        }
        
    }
    var add_to_calender = async function(lesson,userID) {
      let ref_lesson_addres = "/user/teacher/" +lesson.getLessonTeacherUid()+"/lessons/"+lesson.getLessonID();
      let ref_student_addres = "/user/client/" + userID;
      var lesson_in_db;
      var user_in_db;
      var updates_class_list;
      var updates_my_lessons_list;
      await firebase.database().ref(ref_lesson_addres).once('value', function (snapshot) { 
        lesson_in_db = snapshot.val();
      });
      await firebase.database().ref(ref_student_addres).once('value', function (snapshot) { 
        user_in_db = snapshot.val();
      })
      
       //check if in the lesson
       if( "class_list" in lesson_in_db){
        if((parseInt(lesson_in_db.number_of_student) - lesson_in_db.class_list.length)<=0){
          $(".modal-eror").html("lesson is full!!")
          
          setTimeout(() => {
            $(".modal-eror").html("");
          }, 3000);
          $("#add-lesson-btn").unbind('click');
          return false;
        }
      }
      //check if in the lesson
      if( "class_list" in lesson_in_db){
        if(lesson_in_db.class_list.indexOf(userID) >= 0){
          $(".modal-eror").html("you all ready in the lesson")
          
          setTimeout(() => {
            $(".modal-eror").html("");
          }, 3000);
          $("#add-lesson-btn").unbind('click');
          return false;
        }
      }
      //update db
      if ("class_list" in lesson_in_db) {
        
        lesson_in_db.class_list.push(userID)
        await firebase.database().ref(ref_lesson_addres+"/class_list").set(lesson_in_db.class_list);
      }else{
        updates_class_list = { "class_list": [userID] };
        await firebase.database().ref(ref_lesson_addres).update(updates_class_list);
      }
      
      if ("my_lessons_list" in user_in_db) {
        user_in_db.my_lessons_list.push(lesson.getLessonID())
        await firebase.database().ref(ref_student_addres+"/my_lessons_list").set(user_in_db.my_lessons_list);
      }else{
        updates_my_lessons_list = { "my_lessons_list": [lesson.getLessonID()] };
        await firebase.database().ref(ref_student_addres).update(updates_my_lessons_list);
      }
      //update need to loacl lesson
      lesson.class_list.push(userID)
      $('.modal-available').html(lesson.getAvailablePlaces());
      $('#myModal').modal('hide');
    
    }
    var addLessonBtn = function(lessonId) {
      let lesson = subjectMapById.get($(lessonId).attr('id'));
      var userID = firebase.auth().currentUser.uid;
      
      $("#add-lesson-btn").on("click",function () {
        add_to_calender(lesson,userID);
        $("#add-lesson-btn").unbind('click');
      });
    }
    this.active_all_lesson = function () {
        $("#all_lessons_btn").on( "click", function () {
            getLessonsFromDB(data_lessons);
        } );
    };
    var get_all_lessons =function () {
        let temp_arr_filter = {};
        $.each(data_lessons, function( index, user ) {
            let lessons = user.lessons;
            if (lessons != null) {
              for (var key in lessons) {
                  temp_arr_filter[key] = lessons[key];
              }
            };
        });
        return temp_arr_filter;
    }
    this.filter_by_key = function () {
        $("#search-lesson").keyup('change', function () {
            let current_search = $(this).val();
            let index_teacher;
           let final= {};
            let lessons = {};
            $.each(data_lessons, function (index, co) {
                index_teacher = index
                if("lessons" in co){
                    for (var key in co.lessons){
                        if("lesson_title" in co.lessons[key]){
                            if (co.lessons[key].lesson_title.includes(current_search)){
                              lessons[key]= co.lessons[key];
                            }
                                
                        }

                    }
                }
            });
            final[index_teacher]= {lessons:lessons}; 
            getLessonsFromDB(final);
        });
    };
  this.filter_by_date_and_time = function () {
    console.log("filter_by_date_and_time");
    var date_range;
    var date_list;
    var date_start;
    var date_end;

    $("#daterange").on('change', function () {
      counter_date++;
      if(counter_date > 1){

        date_range =  $("#daterange").val();
        date_list = date_range.split("-");
        date_start = new Date(Date.parse(date_list[0]));
        date_end = new Date(Date.parse(date_list[1]));
      
        let index_teacher;
           let final= {};
            let lessons = {};
            $.each(data_lessons, function (index, co) {
                index_teacher = index
                if("lessons" in co){
                    for (var key in co.lessons){
                        if("time" in co.lessons[key] && "time" in co.lessons[key]){
                            if (is_in_range(date_start,date_end,co.lessons[key].time,co.lessons[key].date)){
                              lessons[key]= co.lessons[key];

                            }
                                
                        }

                    }
                }
            });
            final[index_teacher]= {lessons:lessons}; 
            getLessonsFromDB(final);
      }
      
    });
  }
  var is_in_range= function (date_start,date_end,lessons_time,lessons_date) {
    let date_check = new Date(Date.parse(lessons_date+" "+lessons_time))
    return date_check > date_start && date_check < date_end
  }
    this.filter_by_subject = function (subject_data) {

      //update options
      append_options ="<option value='all' selected>All Subjects</option> ";
      for(subject in subject_data){
        append_options +=  "<option value='"+subject_data[subject] +"'>"+subject_data[subject]+"</option> "
      }
      $("#group-filter-lesson").html(append_options)
      $('.selectpicker').selectpicker('refresh');
     
      //on change selet options
      $("#group-filter-lesson").on('change', function () {
          // let current_search = $(this).val();
        console.log("start");
        
        let list_group = $("#group-filter-lesson").val();
        console.log(list_group);
        if (list_group.indexOf("all") >= 0) {
          getLessonsFromDB(data_lessons);
          return data_lessons;
        }
        let index_teacher;
         let final= {};
          let lessons = {};
          $.each(data_lessons, function (index, co) {
              index_teacher = index
              if("lessons" in co){
                  for (var key in co.lessons){
                      
                      if("subject" in co.lessons[key]){
                       
                          if (list_group.indexOf(co.lessons[key].subject) >= 0) { //if chosen all 
                            
                            lessons[key]= co.lessons[key];
                             
                          }
                      }

                  }
              }
          });
          final[index_teacher]= {lessons:lessons}; 
          console.log("final");
          console.log(final);
          
          getLessonsFromDB(final);
      });



  };


    /*
     * Constructor
     */
    
    this.construct = function () {
    };
    /*
     * Pass options when class instantiated
     */
    this.construct();

};
