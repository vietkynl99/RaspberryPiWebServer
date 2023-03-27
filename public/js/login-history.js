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

        var email = document.getElementById("navbar_email").textContent.trim();

        // conntec to socket
        var socket = io();
        socket.on('connect', function () {
            socket.emit('login', {email: email, page: 'loginhistory'});
            socket.emit('req loginhistory', email);
        });

        socket.on('user info', function (data) {
            document.getElementById('navbar_fullname').textContent = data.name;
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


