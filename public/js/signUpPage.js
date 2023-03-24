(function ($) {
    'use strict';
    $(function () {

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
            if (check) {
                $.ajax({
                    url: '/signup',
                    type: 'POST',
                    data: {
                        firstname: $(inputValidate[0]).val(),
                        lastname: $(inputValidate[1]).val(),
                        phone: $(inputValidate[2]).val(),
                        birthday: $(inputValidate[3]).val(),
                        email: $(inputValidate[4]).val(),
                        pass: $(inputValidate[5]).val()
                    },
                    success: function (data) {
                        if (data.response === 'accept') {
                            window.location.href = "/login";
                        }
                        else if (data.response === 'registered') {
                            AlertBox('Account has been registered. Please register another account!');
                        }
                        else if (data.response === 'deny') {
                            AlertBox('The server does not accept account registration!');
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
            if ($(input).attr('name') == 'name') {
                if ($(input).val().trim().match(/^([a-zA-Z0-9 ]+)$/) == null) {
                    $(input).parent().attr('data-validate', "Name is invalid");
                    return false;
                }
            }
            else if ($(input).attr('name') == 'email') {
                if ($(input).val().trim().match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/) == null) {
                    $(input).parent().attr('data-validate', "Email is invalid");
                    return false;
                }
            }
            else if ($(input).attr('name') == 'phone') {
                if ($(input).val().trim().match(/^(\+84|0)\d{9}$/) == null) {
                    $(input).parent().attr('data-validate', "Phone number is invalid");
                    return false;
                }
            }
            else if ($(input).attr('name') == 'pass' || $(input).attr('name') == 'confirm-pass') {
                if ($(input).attr('name') == 'confirm-pass') {
                    if ($(inputValidate[inputValidate.length - 2]).val().trim() != $(inputValidate[inputValidate.length - 1]).val().trim()) {
                        $(input).parent().attr('data-validate', "The password confirmation does not match");
                        return false;
                    }
                }
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
            $(".log-box .log-text").html(message);
            setTimeout(function () {
                $(".log-box").removeClass('log-show');
            }, 3000);
        }

    });
})(jQuery);