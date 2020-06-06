var FirebaseInit = function () {
    console.log("fillter_and_sort");
    /*
     * Variables accessible
     * in the class
     */
   
   
    var vars = {};
    this.data;
    this.set_data = function (data_temp) {
        this.data =data_temp;
    };
    this.get_data = function () {
        this.data ;
    };

    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var root = this;

    /*
     * Constructor
     */
    this.construct = function (data) {
       this.data = data
        
    };

   
    


    /*
     * Pass options when class instantiated
     */
    this.construct();

};
