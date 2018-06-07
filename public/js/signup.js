$(document).ready(function() {

    $('#skills').select2({
        placeholder: 'Select your skills'
    });

    // $('#skills').change(function() {
    //     var result = $('#skills').select2('data');
    //     console.log(result[0].text);
    // });

    $('#submit_btn').on('click', function(e) {
        e.preventDefault();
        var skill = $('#skills').select2('data');
        var skills = "";
        for (let i = 0; i < skill.length; i++) {
            if (i != skill.length - 1) {
                skills += skill[i].text + " ";
            } else {
                skills += skill[i].text;
            }

        }

        var data = {
            firstname: $('input[name=firstname]').val(),
            lastname: $('input[name=lastname]').val(),
            email: $('input[name=email]').val(),
            password: $('input[name=password]').val(),
            facebook: $('input[name=facebook]').val(),
            skype: $('input[name=skype]').val(),
            tutor: $('#tutor').prop('checked'),
            skills: skills,
            description: $('textarea[name=description]').val(),
            rph: $('#rate').val(),
        };

        $.ajax({
           url: "/create_user",
           type: "post",
           data: data,
           dataType: "json",
           async: true,
        });

        $(location).attr('href', '/login')
    });

    $('#tutor_btn').click(function () {
        $('#tutor_details').toggle();
        if($(this).text() === "Become a Student") {
            $(this).text("Become a Tutor");
            $('#notTutor').prop('checked', true);
        } else {
            $(this).text("Become a Student");
            $('#tutor').prop('checked', true);
        }
    });

});
