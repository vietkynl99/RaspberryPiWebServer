(function ($) {
    'use strict';
    $(function () {

        // ===============================================================================================

        var socket = io();
        var email = document.getElementById("navbar_email").textContent.trim();
        var portStatus = false;
        // ===============================================================================================

        function updatePortList(PortList) {
            let html = '';
            PortList.forEach(element => {
                html += `<option value="${element.path}">${element.path} ${element.description}</option>`;
            });
            document.getElementById('port-select').innerHTML = html;
        }

        function updatePortStatus(status) {
            portStatus = status === true;
            document.getElementById('port-status').innerHTML = (status === true) ? `<p>Status: <span class="text-success">Connected</span></p>` : `<p>Status: <span class="text-danger">Disconnected</span></p>`;
            document.getElementById('button-connect').textContent = (status === true) ? 'Disconnect' : 'Connect';
            document.getElementById('button-connect').disabled = false;
            document.getElementById('port-select').disabled = portStatus === true;
        }
        // ===============================================================================================
        socket.on('connect', function () {
            socket.emit('login', { email: email, page: 'connectivity' });
            socket.emit('req portlist', email);
        });

        socket.on('user info', function (data) {
            if(data) {
                document.getElementById('navbar_fullname').textContent = data.name;
            }
        });

        socket.on('update portlist', function (data) {
            if(data) {
                updatePortList(data);
                $("#icon-refesh").removeClass("fast-spin");
            }
        });

        socket.on('port status', function (data) {
            console.log('get port status', data);
            if(data) {
                updatePortStatus(data.status);
            }
        });

        $("#button-connect").click(function () {
            let button = document.getElementById('button-connect');
            if (portStatus) {
                button.textContent = 'Disconnecting...';
                button.disabled = true;
                socket.emit('req disconnect', { email: email });
            }
            else {
                button.textContent = 'Connecting...';
                button.disabled = true;
                socket.emit('req connect', { email: email, port: $('#port-select').val() });
            }
        });

        $("#icon-refesh").click(function () {
            document.getElementById('port-select').innerHTML = '';
            $("#icon-refesh").addClass("fast-spin");
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


