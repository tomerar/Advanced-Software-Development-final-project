class Lesson{
  constructor(lessonSnapshot, key,lessonIdInDom,rateList){
    this.data = lessonSnapshot;
    this.class_list = [];
    if ("class_list" in this.data){
      this.class_list = this.data.class_list;
    }
    this.key = key;
    this.lessonIdInDom = lessonIdInDom;
    this.about_me_class;
    this.profile_pic_class;
    this.rateList = rateList;
    this.teacherRate = this.calculateRate();
    this.addToDom();
  }

  calculateRate(){
    let counter = 0;

    let sum = 0;

    for (var key in this.rateList) {
      sum += this.rateList[key].rateNum;
      counter++;
    }
    return Math.ceil(sum/counter);
  }
  addToDom(){

    var about_me
    var profile_pic = "images/blank-profile.png";

    if("pic_url" in this.data){
      if (this.data.pic_url.length != 0) {
        profile_pic = this.data.pic_url;
      }
    }
    if (this.data.about_me.length > 20) {
      about_me = this.data.about_me.substring(0, 20) + "...";
    } else {
      about_me = this.data.about_me;
    }
    this.about_me_class = about_me;
    this.profile_pic_class = profile_pic;

    document.getElementById("teachersPictures").innerHTML += '<div class="col-lg-4 col-md-6 mb-4">' +
    '<div class="card h-100">' +
    '<a  id="lesson_' + this.lessonIdInDom +'"><img class="card-img-top" src="'+profile_pic+'" alt=""></a>'+
      '<div class="card-body">'+
        '<h4 class="card-title">'+
          '<p>' + this.data.subject + '</p>'+
          '<p>Title: ' + this.data.lesson_title + '</p>'+
          '<p id="lesson_id" style="display:none;">' + this.data.lesson_id + '</p>'+
        '</h4>'+
        '<h5>Teacher name: '+ this.data.teacher_name+' </h5>'+
        '<h5>about the lesson: '+ about_me+' </h5>'+
        '<h6 class="card-text"> Date: ' + this.data.date + ' , ' + this.data.time + '</h6>'+
      '</div>'+
      '<div class="card-footer">'+
        '<small class="text-muted-new" >' + this.getStar() + '</small>'+
        ' </div>'+
      '</div>'+
  '</div>';
  }

  getStar(){
    //&#9733; &#9733; &#9733; &#9733; &#9734;
    switch (this.teacherRate) {
    case 1:
      return '&#9733;';
    case 2:
      return '&#9733;&#9733;';
    case 3:
      return '&#9733;&#9733;&#9733;';
    case 4:
      return '&#9733;&#9733;&#9733;&#9733;';
    case 5:
      return '&#9733;&#9733;&#9733;&#9733;&#9733;';
    default:
      return '';
    }
  }
  getAvailablePlaces(){
    if (parseInt(this.data.number_of_student) > this.class_list.length){

      return '<h5 class="text-success">Available places: '+
      (parseInt(this.data.number_of_student) - this.class_list.length)+'</h5>';
    }else{
      return '<h5 class="text-danger">Available places: '+0+'</h5>';
    }

  }
  getLessonTeacherUid(){
    return this.data.teacher_uid;
  }
  getNumberStudent(){
    return this.data.number_of_student;
  }
  getLink(){
    return this.data.link;
  }
  getNumberStudent(){
    return this.data.number_of_student;
  }
  getLessonTeacher(){
    return this.data.teacher_name;
  }
  getLessonTitle(){
    return this.data.lesson_title;
  }
  getLessonSubject(){
    return this.data.subject;
  }
  getAboutMe(){
    return this.data.about_me;
  }
  getProfilePic(){
    return this.profile_pic_class;
  }
  getLessonID(){
    return this.data.lesson_id;
  }
  getLessonDate(){
    return this.data.date;
  }
  getLessonTime(){
    return this.data.time;
  }
  getLessonHtmlID(){
    return 'lesson_' + this.lessonIdInDom ;
  }
}