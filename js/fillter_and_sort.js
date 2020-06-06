
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
    var update_to_db
    var root = this;
    this.set_update_to_db =function (params) {
        update_to_db = params;
    };
    var getLessonsFromDB =function (teachers_data) {
  
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
            var e = $(this);
            var title = e.data('title');
            var body = e.data('value');
            let lesson = subjectMapById.get(this.id);
            $("#myModal").modal("show");
            $('.modal-title').html(lesson.getLessonName());
            $('.modal-body').html(this.id);
          });
        }
    
      function addEvent() {
    
      }
    
    
    }
    this.active_all_lesson = function () {
        $("#all_lessons_btn").on( "click", function () {
            console.log("get_data");
            console.log(data_lessons);
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
                            if (co.lessons[key].lesson_title.includes(current_search))
                                
                            lessons[key]= co.lessons[key];
                        }

                    }
                }
            });
            final[index_teacher]= {lessons:lessons}; 
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
