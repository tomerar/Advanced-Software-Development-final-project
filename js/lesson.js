class Lesson{
  constructor(lessonSnapshot, key,lessonIdInDom){
    this.data = lessonSnapshot;
    this.key = key;
    this.lessonIdInDom = lessonIdInDom;
    this.addToDom();
  }

  addToDom(){
    document.getElementById("teachersPictures").innerHTML += '<div class="col-lg-4 col-md-6 mb-4">' + 
    '<div class="card h-100">' + 
    '<a  id="lesson_' + this.lessonIdInDom +'"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>'+
      '<div class="card-body">'+
        '<h4 class="card-title">'+
          '<p>' + this.data.subject +  '</p>'+
        '</h4>'+
        '<h5>Teacher name: </h5>'+
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