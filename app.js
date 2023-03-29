var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rootRouter = require('./routes/rootRouter');
var loginRouter = require('./routes/loginRouter');
var signUpRouter = require('./routes/signUpRouter');
var homeRouter = require('./routes/homeRouter');
var app = express();

// socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

// plugin
var uilog = require('./modules/uiLog')
var systemManager = require('./modules/systemManager');
var serialPortAdapter = require('./modules/serialPortAdapter');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', rootRouter);
app.use('/login', loginRouter);
app.use('/signup', signUpRouter);
app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


// connect to database
var sqlAdapter = require('./modules/sqlAdapter')
sqlAdapter.connect()

// client list
var clientList = require('./modules/clientList')

function user_login(email, page, id, ip) {
	email = sqlAdapter.removeSpecialCharacter(email);
	page = sqlAdapter.removeSpecialCharacter(page);
	id = sqlAdapter.removeSpecialCharacter(id);
	ip = sqlAdapter.removeSpecialCharacter(ip);
	if (!email || !page || !id || !ip) {
		return;
	}
	uilog.log(uilog.Level.SYSTEM, 'User "' + email + '" logged in ' + page + '!')
	clientList.add(email, page, id, ip)
	clientList.printList()
	// save login history  to sql
	sqlAdapter.query(`INSERT INTO loginhistory (time, type, email, ip) VALUES(NOW(), ${sqlAdapter.EventType.LOG_IN}, '${email}', '${ip}')`,
		function (success, result) {
			if (success == false) {
				uilog.log(uilog.Level.ERROR, 'SQL query error')
			}
		});
}

function user_logout(id) {
	let data = clientList.removeId(id)
	if (!data) {
		return
	}
	let email = sqlAdapter.removeSpecialCharacter(data.email);
	let page = sqlAdapter.removeSpecialCharacter(data.page);
	let ip = sqlAdapter.removeSpecialCharacter(data.ip);
	if (!email || !page || !ip) {
		return;
	}
	uilog.log(uilog.Level.SYSTEM, 'User "' + email + '" logged out ' + page + '!')
	clientList.printList()
	// save logout history  to sql
	sqlAdapter.query(`INSERT INTO loginhistory (time, type, email, ip) VALUES(NOW(), ${sqlAdapter.EventType.LOG_OUT}, '${email}', '${ip}')`,
		function (success, result) {
			if (success == false) {
				uilog.log(uilog.Level.ERROR, 'SQL query error')
			}
		});
}

function updateLoginHistoryTable(id, email) {
	sqlAdapter.query(`SELECT * FROM loginhistory WHERE email='${email}' ORDER BY id DESC LIMIT 10`,
		function (success, result) {
			if (success == false) {
				uilog.log(uilog.Level.ERROR, 'SQL query error')
			}
			else if (result.length <= 0) {
				uilog.log(uilog.Level.ERROR, 'Cannot find data of user "' + email + '"')
			}
			else {
				let data = [];
				result.forEach(element => {
					data.push([element.id, new Date(element.time).toLocaleString(), element.email, element.ip, element.type]);
				});
				let tableData = {
					id: 'login-history-table',
					columnName: ['#', 'Time', 'Email', 'IP', 'Status'],
					data: data
				}
				sendDataToClient(id, 'update table', tableData);
			}
		});
}

function sendDataToClient(id, event, data) {
	if (!id || !event || !data) {
		return;
	}
	io.to(id).emit(event, data);
}

function sendDataToAllClientInPage(page, event, data) {
	if (!page || !event || !data) {
		return;
	}
	for (let index = 0; index < clientList.list.length; index++) {
		const client = clientList.list[index];
		if (client.page === page) {
			sendDataToClient(client.id, event, data);
		}
	}
}

// new connection to server
io.on('connection', function (socket) {
	// uilog.log(uilog.Level.SYSTEM, 'Address [' + socket.handshake.address + '] ID [' + socket.id + '] connected')

	// client disconnect
	socket.on('disconnect', function () {
		user_logout(socket.id)
	});

	// user logged in
	socket.on('login', function (data) {
		let email = sqlAdapter.removeSpecialCharacter(data.email);
		let page = sqlAdapter.removeSpecialCharacter(data.page);
		if (!email || !page) {
			return
		}
		user_login(email, page, socket.id, socket.handshake.address)
		// send data to client
		sqlAdapter.query(`SELECT firstname, lastname FROM userinfo WHERE email='${email}'`,
			function (success, result) {
				if (success == false) {
					uilog.log(uilog.Level.ERROR, 'SQL query error')
				}
				else if (result.length <= 0) {
					uilog.log(uilog.Level.ERROR, 'Cannot find data of user "' + email + '"')
				}
				else {
					sendDataToClient(socket.id, 'user info', { name: result[0].firstname + ' ' + result[0].lastname });
				}
			});

		switch (page) {
			case 'home':
				// chart
				let chartId = 'performance-line';
				let chartLabel = 'Memory used';
				let ChartXData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
				let ChartYData = [100, 500, 300, 400, 900, 500, 700, 600, 600, 700];
				sendDataToClient(socket.id, 'update chart', { id: chartId, label: chartLabel, xData: ChartXData, yData: ChartYData });
				break;
			case 'connectivity':
				// port list
				sendPortList(socket.id);
				// port status
				sendPortStatus(false, socket.id);
				break;
			default:
				break;
		}
	});

	socket.on('req loginhistory', function (email) {
		email = sqlAdapter.removeSpecialCharacter(email);
		if (!email) {
			return
		}
		updateLoginHistoryTable(socket.id, email);
	});

	socket.on('req portlist', function (email) {
		setTimeout(() => {
			sendPortList(socket.id);
		}, 500);
	});

	socket.on('req connect', function (data) {
		setTimeout(() => {
			let email = sqlAdapter.removeSpecialCharacter(data.email);
			let port = sqlAdapter.removeSpecialCharacter(data.port);
			if (!email || !port) {
				return
			}
			uilog.log(uilog.Level.SYSTEM, 'Request connect to ' + port + ' from user ' + email);
			serialPortAdapter.connect(port,
				function openCallback(path) {
					sendPortStatus(true);
				},
				function closeCallback(path) {
					sendPortStatus(true);
				},
				function errorCallback(path, error) {
					sendDataToClient(socket.id, 'alert', { type: 'error', message: error });
					sendPortStatus(true);
				});
		}, 500);
	});

	socket.on('req disconnect', function (data) {
		setTimeout(() => {
			let email = sqlAdapter.removeSpecialCharacter(data.email);
			if (!email) {
				return
			}
			uilog.log(uilog.Level.SYSTEM, 'Request disconnect to from user ' + email);
			serialPortAdapter.disconnect();
		}, 500);
	});

});


http.listen(port, function () {
	uilog.log(uilog.Level.SYSTEM, 'Server started on port:' + port);
});


function sendPortList(id) {
	serialPortAdapter.getPortList(function (list) {
		sendDataToClient(id, 'update portlist', { list: list, path: serialPortAdapter.getPath() });
	})
}

function sendPortStatus(sendAll, id) {
	if (sendAll === true) {
		sendDataToAllClientInPage('connectivity', 'port status', { status: serialPortAdapter.isConnected(), path: serialPortAdapter.getPath() });
	}
	else if (id) {
		sendDataToClient(id, 'port status', { status: serialPortAdapter.isConnected(), path: serialPortAdapter.getPath() });
	}
}
