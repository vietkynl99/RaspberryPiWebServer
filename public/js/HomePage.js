
var username = document.getElementById("navbar_username").textContent.trim();
// conntec to socket
var socket = io();
socket.on('connect', function () {
	socket.emit('navbar_fullname', username);
	socket.emit('navbar_email', username);
});

socket.on('navbar_fullname', function (data) {
	document.getElementById('navbar_fullname').textContent = data;
});
socket.on('navbar_email', function (data) {
	document.getElementById('navbar_email').textContent = data;
});


$(document).ready(function () {
	function AlertBox(message) {
		$(".log-box").addClass("log-show");
		$(".log-box .log-text").html(message);
		setTimeout(function () {
			$(".log-box").removeClass('log-show');
		}, 5000);
	}
});


