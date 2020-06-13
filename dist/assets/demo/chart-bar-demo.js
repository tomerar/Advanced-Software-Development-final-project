// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';


var database_bar;
$(document).ready(function () {

  var starCountRef = firebase.database().ref("/user/");
    starCountRef.on('value', function(snapshot) {
      database_bar = snapshot.val();
      make_chart_bar();
    });
   
});

function get_data_lesson_per_month() {
  
  let lesson_per_month_arr_count = new Array(monthNames.length).fill(0);
  for (teacher_key in database_bar["teacher"]) {
    if ("lessons" in database_bar["teacher"][teacher_key]){
      
      for(lesson_key in database_bar["teacher"][teacher_key].lessons){
        
        
        let temp_lesson_date = new Date(Date.parse(database_bar["teacher"][teacher_key].lessons[lesson_key].date));
        for (let index = 0; index < lesson_per_month_arr_count.length; index++) {
          
          
          if (temp_lesson_date.getMonth() == index) {
            lesson_per_month_arr_count[index]++;
          }
    
        }
      }
    }
  }
  return lesson_per_month_arr_count;

}

function make_chart_bar() {
  
  // Bar Chart Example
  var ctx = document.getElementById("myBarChart");
  var myLineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthNames,
      datasets: [{
        label: "Lessons",
        backgroundColor: "rgba(2,117,216,1)",
        borderColor: "rgba(2,117,216,1)",
        data: get_data_lesson_per_month(),
      }],
    },
    options: {
      scales: {
        xAxes: [{
          time: {
            unit: 'month'
          },
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 20
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
              callback: function (value) { if (Number.isInteger(value)) { return value; } },
              stepSize: 1,
            min: 0,
            max: (get_data_lesson_per_month()).reduce(function (a, b) {
              return Math.max(a, b);
            }),
            maxTicksLimit: 20
          },
          gridLines: {
            display: true
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });
}
