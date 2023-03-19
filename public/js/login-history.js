(function ($) {
    'use strict';
    $(function () {

        // ===============================================================================================

        function updateTableData(tableData) {
            //set header of table
            let html = `<thead>
            <tr>`;
            tableData.columnName.forEach(element => {
                html += `<th>${element}</th>`;
            });
            //rows of table
            html += `</tr>
            </thead>
            <tbody>`;
            tableData.data.forEach(row => {
                html += `<tr>`;
                for (let index = 0; index < row.length; index++) {
                    const element = row[index];
                    if (index === row.length - 1) {
                        html += row[index] === 0 ? `<td><label class="badge badge-success">Login</label></td>` : `<td><label class="badge badge-danger">Logout</label></td>`;
                    }
                    else {
                        html += `<td>${row[index]}</td>`;
                    }
                }
                html += `<tr>`;
            });
            html += `</tbody>`;

            document.getElementById(tableData.id).innerHTML = html;
        }
        // ===============================================================================================

        var username = document.getElementById("navbar_username").textContent.trim();

        // conntec to socket
        var socket = io();
        socket.on('connect', function () {
            socket.emit('login', username);
            socket.emit('req loginhistory', username);
        });

        socket.on('user info', function (data) {
            document.getElementById('navbar_fullname').textContent = data.name;
            document.getElementById('navbar_email').textContent = data.email;
        });

        socket.on('update table', function (data) {
            updateTableData(data)
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


