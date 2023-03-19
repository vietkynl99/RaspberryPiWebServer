/*==================================================================
[ Button ]*/
$('.txt-forgot-password').on('click', function () {
    alert("This feature is not supported yet!");
});

$('.txt-register').on('click', function () {
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
                username: $(input[0]).val().trim(),
                pass: $(input[1]).val().trim()
            },
            success: function (response) {
                if (response === 'accept') {
                    window.location.href = "/home";
                }
                else {
                    AlertBox('Username or password is incorrect');
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }
});

function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    }
    else {
        if ($(input).val().trim() == '') {
            return false;
        }
    }
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