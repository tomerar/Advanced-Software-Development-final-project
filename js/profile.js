$(document).ready(function () {
   initFireBase();  
});

async function initFireBase(){
	firebase_init =  new FirebaseInit();
	firebase_init.is_login(null,"index.html");
	firebase.auth().onAuthStateChanged(user => 
	firebase_init.getCurrentTeacherVariable (myFunc,"lesson"));	
}

function myFunc(lesson) {
	user_uid = firebase_init.get_user().uid;
	user_bday = firebase_init.get_user().bday;
	user = firebase_init.get_user();
	var d=new Date();
	console.log(d);
	d=Date.parse(user_bday);
	console.log(d);
	document.getElementById('email-address').innerHTML=user.email;
	document.getElementById('name').innerHTML=user.name;
	document.getElementById('bdate').innerHTML='Birthdate: '+user.bday;
	//document["image"].src = user.pic_url.src;
	console.log(d);
	displayContent();
}

function displayContent(){
  document.getElementById("allContent").style.display = "block";
  document.getElementById("loader").style.display = "none";
}
