  document.body.style.zoom="94%";

  // window.open(URL, '', 'fullscreen=yes, scrollbars=auto');
  // window.open(URL, '', 'fullscreen=yes, scrollbars=auto, resizble=yes, status=yes, toolbar=yes,menubar=yes, scrollbars=no');
  // $(document).ready(function () {
  //  $(document).fullScreen(true);
   // function   FullScreenMode(){
        // var win = window.open("http://localhost:4200/dashboard", "full", "dependent=yes, fullscreen=yes");
        // win.location = window.location.href;
        // window.opener = null;
   // }  
  // });
 // var elem = document.documentElement; if (elem.requestFullscreen) { elem.requestFullscreen() }

  // Find the right method, call on correct element
// function launchFullScreen(element) {
//   if(element.requestFullscreen) {
//     element.requestFullscreen();
//   } else if(element.mozRequestFullScreen) {
//     element.mozRequestFullScreen();
//   } else if(element.webkitRequestFullscreen) {
//     element.webkitRequestFullscreen();
//   } else if(element.msRequestFullscreen) {
//     element.msRequestFullscreen();
//   }
// }

// Launch fullscreen for browsers that support it!
// launchFullScreen(document.documentElement); // the whole page

  document.addEventListener("DOMContentLoaded", function(event) {

    let currentDate = new Date();
    let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let cDay = currentDate.getDate();
    //let cMonth = currentDate.getMonth() + 1;
    let cMonth =  month[currentDate.getMonth()]; ;
    let cYear = currentDate.getFullYear();

document.getElementById("cDay").innerText = cDay;
document.getElementById("cMonth").innerText = cMonth;
document.getElementById("cYear").innerText = cYear;

realTime();

});


function realTime() {


var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
var sec = date.getSeconds();
var halfday = "AM";
halfday = (hour >= 12) ? "PM" : "AM";
hour = (hour == 0) ? 12 : ((hour > 12) ? (hour - 12): hour);
hour = update(hour);
min = update(min);
sec = update(sec);
document.getElementById("h").innerText = hour;
document.getElementById("m").innerText = min;
document.getElementById("s").innerText = sec;
document.getElementById("ap").innerText = halfday;




setTimeout(realTime, 1000);
}

function update(k) {
if (k < 10) { return "0" + k; } else { return k; } }



// document.oncontextmenu = function(event) {
//   // block right-click / context-menu
//   event.preventDefault();
//   event.stopPropagation();
//   return false;
// };

// document.addEventListener("keydown", function(event) {
//   if (event.keyCode == 116) {
//       // block F5 (Refresh)
//       event.preventDefault();
//       event.stopPropagation();
//       return false;

//   } else if (event.keyCode == 122) {
//       // block F11 (Fullscreen)
//       event.preventDefault();
//       event.stopPropagation();
//       return false;

//   } else if (event.keyCode == 123) {
//       // block F12 (DevTools)
//       event.preventDefault();
//       event.stopPropagation();
//       return false;

//   } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
//       // block Strg+Shift+I (DevTools)
//       event.preventDefault();
//       event.stopPropagation();
//       return false;

//   } else if (event.ctrlKey && event.shiftKey && event.keyCode == 74) {
//       // block Strg+Shift+J (Console)
//       event.preventDefault();
//       event.stopPropagation();
//       return false;
//   }
// });

    $(document).ready(function(){
      $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });


    });

    $("#kt_datatable_example_6").DataTable({
      responsive: true
     });
     $(document).ready(function(){
      $("#fromDate").datepicker({
          format: 'dd-mm-yyyy',
          autoclose: true,
      }).on('changeDate', function (selected) {
          var minDate = new Date(selected.date.valueOf());
          $('#toDate').datepicker('setStartDate', minDate);
      });
   
      $("#toDate").datepicker({
          format: 'dd-mm-yyyy',
          autoclose: true,
      }).on('changeDate', function (selected) {
              var minDate = new Date(selected.date.valueOf());
              $('#fromDate').datepicker('setEndDate', minDate);
      });
   });