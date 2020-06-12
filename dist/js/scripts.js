var database;
$(document).ready(function () {

    var firebase_init = new FirebaseInit();
    firebase_init.is_login(null, "login.html");
    console.log("firebase_init");
});

(function ($) {
    "use strict";


    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function () {
        if (this.href === path) {
            $(this).addClass("active");
        }
    });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function (e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);


