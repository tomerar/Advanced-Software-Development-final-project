class Lesson{
  constructor(lessonSnapshot, key,lessonIdInDom){
    this.data = lessonSnapshot;
    this.key = key;
    this.lessonIdInDom = lessonIdInDom;
    this.addToDom();
  }

  addToDom(){
    " ".length
    var about_me
    if (this.data.about_me.length >20){
      about_me = this.data.about_me.substring(0, 20) +"...";
    }else{
      about_me = this.data.about_me;
    }

     
    document.getElementById("teachersPictures").innerHTML += '<div class="col-lg-4 col-md-6 mb-4">' + 
    '<div class="card h-100">' + 
    '<a  id="lesson_' + this.lessonIdInDom +'"><img class="card-img-top" src="images/blank-profile.png" alt=""></a>'+
      '<div class="card-body">'+
        '<h4 class="card-title">'+
          '<p>' + this.data.subject +  '</p>'+
        '</h4>'+
        '<h5>Teacher name: '+ this.data.teacher_name+' </h5>'+
        '<h5>about the lesson: '+ about_me+' </h5>'+
        '<h6 class="card-text"> Date: ' + this.data.date + ' , ' + this.data.time + '</h6>'+
      '</div>'+
      '<div class="card-footer">'+
        '<small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>'+
        ' </div>'+
      '</div>'+
  '</div>';
  }

  getLessonName(){
    return this.data.subject;
  }
}