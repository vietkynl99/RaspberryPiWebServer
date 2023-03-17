$(document).ready(function () {

	var username = document.getElementById("navbar_username").textContent.trim();
	// conntec to socket
	var socket = io();
	socket.on('connect', function () {
		socket.emit('login', username);
	});

	socket.on('navbar_fullname', function (data) {
		document.getElementById('navbar_fullname').textContent = data;
	});

	socket.on('navbar_email', function (data) {
		document.getElementById('navbar_email').textContent = data;
	});

	socket.on('cpu usage', function (data) {
		document.getElementById('cpu-usage').textContent = data + '%';
	});

	socket.on('mem usage', function (data) {
		document.getElementById('mem-usage').textContent = data + '%';
	});

	socket.on('total mem usage', function (data) {
		document.getElementById('total-mem-usage').textContent = data + 'GB';
	});

	socket.on('total mem', function (data) {
		document.getElementById('total-mem').textContent = data + 'GB';
	});


	function AlertBox(message) {
		$(".log-box").addClass("log-show");
		$(".log-box .log-text").html(message);
		setTimeout(function () {
			$(".log-box").removeClass('log-show');
		}, 5000);
	}
});


