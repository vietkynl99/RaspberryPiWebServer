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

        function alertBox(message) {
            $(".log-box").addClass("log-show");
            $(".log-box .log-text").html(message);
            setTimeout(function () {
                $(".log-box").removeClass('log-show');
            }, 5000);
        }
        // ===============================================================================================
        
        socket.on('connect', function () {
            socket.emit('login', { email: email, page: 'connectivity' });
        });

        socket.on('user info', function (data) {
            document.getElementById('navbar_fullname').textContent = data.name;
        });

        socket.on('update portlist', function (data) {
            if (data.list) {
                updatePortList(data.list);
            }
            if (data.path) {
                document.getElementById('port-select').value = data.path;
            }
            $("#icon-refesh").removeClass("fast-spin");
        });

        socket.on('port status', function (data) {
            portStatus = data.status === true;
            document.getElementById('port-status').innerHTML = (data.status === true) ? `<p>Status: <span class="text-success">Connected</span></p>` : `<p>Status: <span class="text-danger">Disconnected</span></p>`;
            document.getElementById('button-connect').textContent = (data.status === true) ? 'Disconnect' : 'Connect';
            document.getElementById('button-connect').disabled = false;
            document.getElementById('port-select').disabled = portStatus === true;
            if(data.path) {
                document.getElementById('port-select').value = data.path;
            }
            document.getElementById('checkbox-auto-connect').checked = data.autoConnect
        });

        socket.on('alert', function (data) {
            switch (data.type) {
                case 'error':
                    alertBox(data.message);
                    break;
                default:
                    break;
            }
        });
        // ===============================================================================================

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
        
        $("#checkbox-auto-connect").click(function () {
            socket.emit('save autoconnect', { email: email, status: document.getElementById('checkbox-auto-connect').checked });
        });

    });
})(jQuery);


