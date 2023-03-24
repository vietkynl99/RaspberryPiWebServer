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

var inputValidate = $('.validate-input .input100');
$('.validate-form').on('submit', function (e) {
    e.preventDefault();
    var check = true;
    for (var i = 0; i < inputValidate.length; i++) {
        if (validate(inputValidate[i]) == false) {
            showValidate(inputValidate[i]);
            check = false;
        }
    }
});

function validate(input) {
    if ($(input).attr('name') == 'name') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9 ]+)$/) == null) {
            return false;
        }
    }
    else if ($(input).attr('name') == 'email') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/) == null) {
            return false;
        }
    }
    else if ($(input).attr('name') == 'phone') {
        if ($(input).val().trim().match(/^(\+84|0)\d{9}$/) == null) {
            return false;
        }
    }
    else if ($(input).attr('name') == 'pass' || $(input).attr('name') == 'confirm-pass') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9!-~ ]+)$/) == null) {
            return false;
        }
        if ($(input).val().trim().match(/(['"]+)/) != null) {
            return false;
        }
        if ($(input).attr('name') == 'confirm-pass') {
            if ($(inputValidate[inputValidate.length - 2]).val().trim() != $(inputValidate[inputValidate.length - 1]).val().trim()) {
                return false;
            }
        }
    }
    else {
        if ($(input).val().trim() == '') {
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
    $(".log-box .log-text").html(message);
    setTimeout(function () {
        $(".log-box").removeClass('log-show');
    }, 3000);
}