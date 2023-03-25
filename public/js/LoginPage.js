/*==================================================================
[ Button ]*/
$('.txt-forgot-password').on('click', function () {
    alert("This feature is not supported yet!");
});

/*==================================================================
[ Focus input ]*/
$('.input100').each(function () {
    $(this).on('blur', function () {
        if ($(this).val().trim() != "") {
            $(this).addClass('has-val');
        }
        else {
            $(this).removeClass('has-val');
        }
    })
})


/*==================================================================
[ Validate ]*/
$('.validate-form .input100').each(function () {
    $(this).focus(function () {
        hideValidate(this);
    });
});

var input = $('.validate-input .input100');
$('.validate-form').on('submit', function (e) {
    e.preventDefault();
    var check = true;
    for (var i = 0; i < input.length; i++) {
        if (validate(input[i]) == false) {
            showValidate(input[i]);
            check = false;
        }
    }
    if (check) {
        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                email: $(input[0]).val().trim(),
                pass: $(input[1]).val().trim()
            },
            success: function (data) {
                if (data.response === 'accept') {
                    window.location.href = "/home";
                }
                else if (data.response === 'retry') {
                    if (data.timeout === 1) {
                        AlertBox('You have entered wrong too many times. Try again in ' + data.timeout + ' minute!');
                    }
                    else {
                        AlertBox('You have entered wrong too many times. Try again in ' + data.timeout + ' minutes!');
                    }
                }
                else if (data.response === 'deny') {
                    AlertBox('Email or password is incorrect');
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }
});

function validate(input) {
    if ($(input).val().trim() == '') {
        $(input).parent().attr('data-validate', "This entry cannot be empty");
        return false;
    }
    if ($(input).attr('name') == 'email') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/) == null) {
            $(input).parent().attr('data-validate', "Email is invalid");
            return false;
        }
    }
    else if ($(input).attr('name') == 'pass') {
        if ($(input).val().trim().length < 6) {
            $(input).parent().attr('data-validate', 'Password must be at least 6 characters');
            return false;
        }
        if ($(input).val().trim().match(/^([a-zA-Z0-9!-~ ]+)$/) == null) {
            $(input).parent().attr('data-validate', "Password cannot contain special characters");
            return false;
        }
        if ($(input).val().trim().match(/(['"`]+)/) != null) {
            $(input).parent().attr('data-validate', "Password cannot contain characters (' \" `)");
            return false;
        }
    }
    return true;
}

function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}

function AlertBox(message) {
    $(".log-box").addClass("log-show");
    // $(".log-box").show();
    $(".log-box .log-text").html(message);
    setTimeout(function () {
        $(".log-box").removeClass('log-show');
        // $(".log-box").hide();
    }, 3000);
}