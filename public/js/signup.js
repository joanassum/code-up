$(document).ready(function() {

    $('#skills').select2({
        placeholder: 'Select your skills'
    });

    $('#tutor_btn').click(function () {
        $('#tutor_details').toggle();
        if($(this).text() === "Become a Student") {
            $(this).text("Become a Tutor");
        } else {
            $(this).text("Become a Student");
        }

    });

});
