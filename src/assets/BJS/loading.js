$(document).ready(function() {

    const bclick = document.getElementById('kt_button_1');
    bclick.addEventListener('click', function () { 
    // mydiv.style.backgroundColor = 'red';
        // Activate indicator
        bclick.setAttribute("data-kt-indicator", "on");
         // Disable indicator after 3 seconds
    // setTimeout(function() {
    //     bclick.removeAttribute("data-kt-indicator");
    // }, 10000);

    });
    
});

$(document).ready(function () {
    $('#kt_carousel_1_carousel').carousel();
});
// Element to indecate
//var button = document.querySelector("#kt_button_1");

// Handle button click event
//button.addEventListener("click", function() {
    // Activate indicator
    //button.setAttribute("data-kt-indicator", "on");

    // Disable indicator after 3 seconds
    // setTimeout(function() {
    //     button.removeAttribute("data-kt-indicator");
    // }, 3000);
//});