const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rootRouter = require('./routes/rootRouter');
const loginRouter = require('./routes/loginRouter');
const signUpRouter = require('./routes/signUpRouter');
const app = express();
const uilog = require('./modules/uiLog')
const systemManager = require('./modules/systemManager');
const serialPortAdapter = require('./modules/serialPortAdapter');
const { PythonShell } = require('python-shell');
const config = require('./modules/config')
require('dotenv').config();

uilog.log(uilog.Level.SYSTEM, 'NODE_ENV: ' + process.env.NODE_ENV);

// socket.io
const backup_port = 8080;
let port = process.env.PORT || 80;
const http = require('http').Server(app);
// const io = require('socket.io')(http);
const io = require('socket.io')(http, {
	allowEIO3: true
});

uilog.log(uilog.Level.SYSTEM, `Server IP addresses:\n${systemManager.getEthernetIP()}`);

http.listen(port, function () {
	uilog.log(uilog.Level.SYSTEM, 'Server is running on port: ' + port);
});

http.on('error', (err) => {
	uilog.log(uilog.Level.ERROR, 'Server error: ' + err.message);
	uilog.log(uilog.Level.ERROR, 'Close current server and try to connect to backup port: ' + backup_port);

	http.close();
	http.removeAllListeners('error')
	port = backup_port

	http.listen(port, function () {
		uilog.log(uilog.Level.SYSTEM, 'Server is running on port: ' + port);
	});

	http.on('error', (err) => {
		uilog.log(uilog.Level.ERROR, 'Server error: ' + err.message);
		uilog.log(uilog.Level.ERROR, 'Exit program !!!');
		process.exit(1)
	});
});

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.status = err.status;

	// render the error page
	if (req.app.get('env') === 'development') {
		res.locals.message = err.message;
		// uilog.log(uilog.Level.ERROR, "Client get error " + err.status)
		// console.log(err);
	}
	else {
		res.locals.message = 'Something went wrong. Please try again.';
	}
	res.status(err.status || 500);
	res.render('error');
});


// connect to database
var sqlAdapter = require('./modules/sqlAdapter')
sqlAdapter.connect()

// read old setting
sqlAdapter.readAllFromTable('setting', undefined,
	function successCallback(result) {
		result = result[0];
		uilog.log(uilog.Level.SQL, 'Old setting: ');
		uilog.log(uilog.Level.SQL, result);

		serialPortAdapter.autoConnect = result.autoconnect === 1;
		if (result.autoconnect === 1 && result.serialport != '') {
			uilog.log(uilog.Level.SQL, 'Auto connect to ' + result.serialport);
			serialPortAdapter.connect(result.serialport,
				function openCallback() {
					sendPortStatus(true);
					sendDataToAllClientInPage('connectivity', 'alert', { type: 'info', message: 'Serial port is connected!' });
				},
				function closeCallback() {
					sendDataToAllClientInPage('connectivity', 'alert', { type: 'info', message: 'Serial port is disconnected!' });
					sendPortStatus(true);
				},
				function errorCallback(error) {
					sendDataToAllClientInPage('connectivity', 'alert', { type: 'danger', message: 'Error! ' + error });
					sendPortStatus(true);
				},
				function dataCallback(data) {
					uilog.log(uilog.Level.SERIALPORT, data);
				});
		}
	}, function errorCallback(error) {
		uilog.log(uilog.Level.ERROR, 'SQL query error')
	})


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
	sqlAdapter.insertToTable('loginhistory', `time, type, email, ip`, `NOW(), ${sqlAdapter.EventType.LOG_IN}, '${email}', '${ip}'`,
		function successCallback(result) { },
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
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
	sqlAdapter.insertToTable('loginhistory', `time, type, email, ip`, `NOW(), ${sqlAdapter.EventType.LOG_OUT}, '${email}', '${ip}'`,
		function successCallback(result) { },
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
		});
}

function updateLoginHistoryTable(id, email) {
	sqlAdapter.readAllFromTable('loginhistory', 10,
		function successCallback(result) {
			if (result.length <= 0) {
				uilog.log(uilog.Level.ERROR, 'Cannot find data in loginhistory table')
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
		},
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
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
	uilog.log(uilog.Level.SYSTEM, 'Address [' + socket.handshake.address + '] ID [' + socket.id + '] connected')

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
		sqlAdapter.readUserInformation(email,
			function successCallback(result) {
				if (result.length <= 0) {
					uilog.log(uilog.Level.ERROR, 'Cannot find data of user "' + email + '"')
				}
				else {
					sendDataToClient(socket.id, 'user info', { name: result[0].firstname + ' ' + result[0].lastname });
				}
			},
			function errorCallback(error) {
				uilog.log(uilog.Level.ERROR, 'SQL query error')
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
			// save settings 
			sqlAdapter.updateTable('setting', 'serialport', port,
				function successCallback(result) { },
				function errorCallback(error) {
					uilog.log(uilog.Level.ERROR, 'SQL query error. Cannot save settings')
				});
			// connect to serial port
			serialPortAdapter.connect(port,
				function openCallback() {
					sendPortStatus(true);
					sendDataToAllClientInPage('connectivity', 'alert', { type: 'info', message: 'Serial port is connected!' });
				},
				function closeCallback() {
					sendDataToAllClientInPage('connectivity', 'alert', { type: 'info', message: 'Serial port is disconnected!' });
					sendPortStatus(true);
				},
				function errorCallback(error) {
					sendDataToAllClientInPage('connectivity', 'alert', { type: 'danger', message: 'Error! ' + error });
					sendPortStatus(true);
				},
				function dataCallback(data) {
					uilog.log(uilog.Level.SERIALPORT, data);
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

	socket.on('save autoconnect', function (data) {
		setTimeout(() => {
			let autoconnect;
			if (data.status === true) {
				autoconnect = 1;
			}
			else {
				autoconnect = 0;
			}
			serialPortAdapter.autoConnect = data.status === true;
			uilog.log(uilog.Level.SYSTEM, 'Request save autoconnect = ' + autoconnect + ' from user ' + data.email);
			sqlAdapter.updateTable('setting', 'autoconnect', autoconnect,
				function successCallback(result) { },
				function errorCallback(error) {
					uilog.log(uilog.Level.ERROR, 'SQL query error. Cannot save settings')
				});
		}, 500);
	});

	// Get data from mobile devices
	socket.on('MD_message', function (data) {
		if (config.enableNLP) {
			let sentence = data.trim();
			nlpAnalyze(sentence,
				function successCallback(result) {
					uilog.log(uilog.Level.MD, `received message: [${data}] -> [${result}]`);
					sendDataToClient(socket.id, 'MD_message_res', { message: result });
				},
				function errorCallback(error) {
					let result;
					switch (error) {
						case 'syntax':
							result = "Sorry. I can only understand English."
							uilog.log(uilog.Level.MD, `received message: [${data}] -> [${result}]`);
							sendDataToClient(socket.id, 'MD_message_res', { message: result });
							break;
						case 'system':
							result = "System error. Please try again."
							uilog.log(uilog.Level.MD, `received message: [${data}] -> [${result}]`);
							sendDataToClient(socket.id, 'MD_message_res', { message: result });
							break;
						case 'busy':
							result = "System is busy. Please try again."
							uilog.log(uilog.Level.MD, `received message: [${data}] -> [${result}]`);
							sendDataToClient(socket.id, 'MD_message_res', { message: result });
							break;
						default:
							result = "Sorry. I don't understand your question."
							uilog.log(uilog.Level.MD, `received message: [${data}] -> [${result}]`);
							sendDataToClient(socket.id, 'MD_message_res', { message: result });
							break;
					}
				})
		}
		else {
			result = "This feature is not supported. Please try again later."
			uilog.log(uilog.Level.MD, `received message: [${data}] -> [${result}]`);
			sendDataToClient(socket.id, 'MD_message_res', { message: result });
		}
	})
	socket.on('MD_data', function (data) {
		uilog.log(uilog.Level.MD, `received data: ${data}`)
		arr = data.split(';')
		if (arr.length == 3) {
			sendDataToAllClientInPage('dashboard', 'device status', { type: arr[0], name: arr[1], status: arr[2] })
		}
	})
});



function sendPortList(id) {
	serialPortAdapter.getPortList(function (list) {
		sendDataToClient(id, 'update portlist', { list: list, path: serialPortAdapter.getPath() });
	})
}

function sendPortStatus(sendAll, id) {
	if (sendAll === true) {
		sendDataToAllClientInPage('connectivity', 'port status', { status: serialPortAdapter.isConnected(), path: serialPortAdapter.getPath(), autoConnect: serialPortAdapter.autoConnect });
	}
	else if (id) {
		sendDataToClient(id, 'port status', { status: serialPortAdapter.isConnected(), path: serialPortAdapter.getPath(), autoConnect: serialPortAdapter.autoConnect });
	}
}



// NLP API methods
if (config.enableNLP) {
	const pyshell = new PythonShell('nlp_parser.py');

	function nlpAnalyze(sentence, successCallback, errorCallback) {
		sentence = sentence.toLowerCase().trim()
		if (!sentence) {
			uilog.log(uilog.Level.ERROR, 'Invalid NLP sentence')
			errorCallback('syntax')
			return
		}

		// check special characters
		sentence2 = sentence.replace(/[^\x00-\x7F]/g, "")
		if (sentence != sentence2) {
			errorCallback('syntax')
			return
		}

		// remove old callback
		pyshell.removeAllListeners('message')

		pyshell.on('message', function (outputStr) {
			try {
				let data = JSON.parse(outputStr)
				switch (data.event) {
					case 'init error':
						uilog.log(uilog.Level.ERROR, 'NLP initialization failed: ' + data.description)
						uilog.log(uilog.Level.ERROR, 'Exit program !!!');
						process.exit(1)
					case 'init done':
						uilog.log(uilog.Level.SYSTEM, 'NLP initialization successful')
						errorCallback('busy')
					case 'parse error':
						uilog.log(uilog.Level.ERROR, 'NLP Error parsing: ' + data.description)
						errorCallback('system')
						break;
					case 'result':
						uilog.log(uilog.Level.SYSTEM, 'NLP successfully parsed:' + data.result)
						successCallback(data.result)
						break;
					default:
						break;
				}
			} catch (error) {
				console.log('NLP raw data:', outputStr)
				errorCallback('system')
			}
		});

		pyshell.send(sentence)
	}

	pyshell.on('message', function (outputStr) {
		try {
			let data = JSON.parse(outputStr)
			switch (data.event) {
				case 'init error':
					uilog.log(uilog.Level.ERROR, 'NLP initialization failed: ' + data.description)
					uilog.log(uilog.Level.ERROR, 'Exit program !!!');
					process.exit(1)
				case 'init done':
					uilog.log(uilog.Level.SYSTEM, 'NLP initialization successful')
				case 'parse error':
					uilog.log(uilog.Level.ERROR, 'NLP Error parsing: ' + data.description)
					break;
				default:
					break;
			}
		} catch (error) {
			console.log('NLP raw data:', outputStr)
		}
	});

}
else {
	uilog.log(uilog.Level.ERROR, 'Warning! NLP is disable !!!');
}