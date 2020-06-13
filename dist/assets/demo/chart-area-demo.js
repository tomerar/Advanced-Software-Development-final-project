// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var database;
var myLineChart
var today_date = new Date();
var month_name = monthNames[today_date.getMonth()];
var N_DAY = 14 ;
// Area Chart Example
$(document).ready(function () {
  var starCountRef = firebase.database().ref("/user/");
    starCountRef.once('value', function(snapshot) {
      database = snapshot.val();
      make_chart();
    });
});
const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

function get_data_user_create(n_day_back) {

  
    let date_arr = new Array();
    let date_arr_count = new Array();
    for (let index = 0; index < n_day_back; index++) {
      date_arr_count.push(0);
      
    }
    
    for (let index = 0; index < n_day_back; index++) {
      let temp_date = new Date
      temp_date.setDate(today_date.getDate() - index)
      date_arr.push(temp_date);
    }
    
    date_arr = date_arr.reverse();
    for (key in database["client"]) {
      let temp_user_date = new Date(Date.parse(database["client"][key].create_date_user));

      for (let index = 0; index < date_arr.length; index++) {

        if (datesAreOnSameDay(date_arr[index], temp_user_date)) {
          date_arr_count[index]++;
        }

      }
    }
    return date_arr_count;
  
 

}

function get_array_date_back_by_n(n_day_back) {
  let date_arr = new Array();
  for (let index = 0; index < n_day_back; index++) {
    let temp_date = new Date
    temp_date.setDate(today_date.getDate() - index)
    date_arr.push(monthNames[temp_date.getMonth()]+" "+temp_date.getDate()); 
  }
  
  return date_arr.reverse();
}


$(document).on('input', '#range_chart_area', function() {
  myLineChart.destroy();
  database_range =database;
  N_DAY = $(this).val()
  $('#chart_area_count_user').html(
    '<i class="fas fa-chart-area mr-1"></i>Count user at last '+N_DAY+' days</div>'
  );
  make_chart();
});


function make_chart() {
    var ctx = document.getElementById("myAreaChart");
    myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: get_array_date_back_by_n(N_DAY),
        datasets: [{
          label: "Users",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          data: get_data_user_create(N_DAY),
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: true
            },
            ticks: {
              maxTicksLimit: N_DAY
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function (value) { if (Number.isInteger(value)) { return value; } },
              stepSize: 1,
              min: 0,
              max: (get_data_user_create(N_DAY)).reduce(function (a, b) {
                return Math.max(a, b);
              }),
              maxTicksLimit: 20
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
}

