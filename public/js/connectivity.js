(function ($) {
    'use strict';
    $(function () {

        // ===============================================================================================

        function updatePortList(PortList) {
            let html = '';
            PortList.forEach(element => {
                html += `<option value="${element.path}">${element.path} ${element.description}</option>`;
            });
            document.getElementById('portSelect').innerHTML = html;
        }
        // ===============================================================================================

        var email = document.getElementById("navbar_email").textContent.trim();
        // conntec to socket
        var socket = io();
        socket.on('connect', function () {
            socket.emit('login', { email: email, page: 'connectivity' });
            socket.emit('req portlist', email);
        });

        socket.on('user info', function (data) {
            document.getElementById('navbar_fullname').textContent = data.name;
        });

        socket.on('update portlist', function (data) {
            updatePortList(data);
            let button = document.getElementById('button-refesh');
            button.innerHTML = `<i class="ti-reload btn-icon-prepend"></i>Refesh`;
            button.disabled = false;
        });

        socket.on('port status', function (data) {
            console.log(data);
        });

        $("#button-connect").click(function () {
            socket.emit('req connect', { email: email, port: $('#portSelect').val() });
        });

        $("#button-refesh").click(function () {
            document.getElementById('portSelect').innerHTML = '';
            let button = document.getElementById('button-refesh');
            button.innerHTML = `<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Refeshing...`;
            button.disabled = true;
            socket.emit('req portlist', email);
        });


        function AlertBox(message) {
            $(".log-box").addClass("log-show");
            $(".log-box .log-text").html(message);
            setTimeout(function () {
                $(".log-box").removeClass('log-show');
            }, 5000);
        }
    });
})(jQuery);


