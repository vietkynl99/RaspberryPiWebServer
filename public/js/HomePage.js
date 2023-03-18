$(document).ready(function () {

	var chartOption = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			yAxes: [{
				gridLines: {
					display: true,
					drawBorder: false,
					color: "#F0F0F0",
					zeroLineColor: '#F0F0F0',
				},
				ticks: {
					beginAtZero: false,
					autoSkip: true,
					maxTicksLimit: 4,
					fontSize: 10,
					color: "#6B778C"
				}
			}],
			xAxes: [{
				gridLines: {
					display: false,
					drawBorder: false,
				},
				ticks: {
					beginAtZero: false,
					autoSkip: true,
					maxTicksLimit: 7,
					fontSize: 10,
					color: "#6B778C"
				}
			}],
		},
		legend: false,
		legendCallback: function (chart) {
			var text = [];
			text.push('<div class="chartjs-legend"><ul>');
			for (var i = 0; i < chart.data.datasets.length; i++) {
				// console.log(chart.data.datasets[i]); // see what's inside the obj.
				text.push('<li>');
				text.push('<span style="background-color:' + chart.data.datasets[i].borderColor + '">' + '</span>');
				text.push(chart.data.datasets[i].label);
				text.push('</li>');
			}
			text.push('</ul></div>');
			return text.join("");
		},
		elements: {
			line: {
				tension: 0.4,
			}
		},
		tooltips: {
			backgroundColor: 'rgba(31, 59, 179, 1)',
		}
	}
	// ===============================================================================================

	function updateChartData(chartData) {
		if ($('#' + chartData.id).length) {
			let lineChartCanvas = document.getElementById(chartData.id).getContext('2d');
			let gradientBg = lineChartCanvas.createLinearGradient(5, 0, 5, 100);
			gradientBg.addColorStop(0, 'rgba(26, 115, 232, 0.18)');
			gradientBg.addColorStop(1, 'rgba(26, 115, 232, 0.02)');
			let data = {
				labels: chartData.xData,
				datasets: [{
					label: chartData.label,
					data: chartData.yData,
					backgroundColor: gradientBg,
					borderColor: '#1F3BB3',
					borderWidth: 1.5,
					fill: true,
					pointBorderWidth: 1,
					pointRadius: 4,
					pointHoverRadius: 2,
					pointBackgroundColor: '#1F3BB3',
					pointBorderColor: '#fff',
				}]
			};
			let lineChart = new Chart(lineChartCanvas, {
				type: 'line',
				data: data,
				options: chartOption
			});
			document.getElementById(chartData.id + '-legend').innerHTML = lineChart.generateLegend();
		}
	}
	// ===============================================================================================

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

	socket.on('update chart', function (data) {
		updateChartData(data)
	});


	function AlertBox(message) {
		$(".log-box").addClass("log-show");
		$(".log-box .log-text").html(message);
		setTimeout(function () {
			$(".log-box").removeClass('log-show');
		}, 5000);
	}
});


