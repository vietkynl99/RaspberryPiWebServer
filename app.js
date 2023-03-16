var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rootRouter = require('./routes/rootRouter');
var loginRouter = require('./routes/loginRouter');
var homeRouter = require('./routes/homeRouter');
var app = express();

// socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


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
var SqlAdapter = require('./modules/SqlAdapter')
var sqlAdapter = new SqlAdapter()
sqlAdapter.connect()

// client list
var ClientList = require('./modules/ClientList')
var clientList = new ClientList()

function user_login(username, id, ip) {
	username = sqlAdapter.removeSpecialCharacter(username);
	id = sqlAdapter.removeSpecialCharacter(id);
	ip = sqlAdapter.removeSpecialCharacter(ip);
	if (!username || !id || !ip) {
		return;
	}
	console.log('[App.js] User "' + username + '" logged in!')
	clientList.add(username, id, ip)
	clientList.printList()
	// save login history  to sql
	sqlAdapter.query(`INSERT INTO loginhistory (time, type, username, ip) VALUES(NOW(), 0, '${username}', '${ip}')`,
		function (success, result) {
			if (success == false) {
				console.log('[App.js][ERROR] SQL query error')
			}
		});
}

function user_logout(id) {
	let data = clientList.removeId(id)
	if (!data) {
		return
	}
	let username = sqlAdapter.removeSpecialCharacter(data.username);
	let ip = sqlAdapter.removeSpecialCharacter(data.ip);
	if (!username || !ip) {
		return;
	}
	console.log('[App.js] User "' + username + '" logged out!')
	clientList.printList()
	// save logout history  to sql
	sqlAdapter.query(`INSERT INTO loginhistory (time, type, username, ip) VALUES(NOW(), 1, '${username}', '${ip}')`,
		function (success, result) {
			if (success == false) {
				console.log('[App.js][ERROR] SQL query error')
			}
		});
}

// new connection to server
io.on('connection', function (socket) {
	// console.log('Address [' + socket.handshake.address + '] ID [' + socket.id + '] connected')

	// client disconnect
	socket.on('disconnect', function () {
		user_logout(socket.id)
	});

	// user logged in
	socket.on('login', function (username) {
		username = sqlAdapter.removeSpecialCharacter(username);
		if (!username) {
			return
		}
		user_login(username, socket.id, socket.handshake.address)
		// send data to client
		sqlAdapter.query(`SELECT name FROM userinfo WHERE username='${username}'`,
			function (success, result) {
				if (success == false) {
					console.log('[App.js][ERROR] SQL query error')
				}
				else if (result.length <= 0) {
					console.log('[App.js][ERROR] Cannot find data of user "' + data + '"')
				}
				else {
					io.to(socket.id).emit('navbar_fullname', result[0].name);
				}
			});
		sqlAdapter.query(`SELECT email FROM userinfo WHERE username='${username}'`,
			function (success, result) {
				if (success == false) {
					console.log('[App.js][ERROR] SQL query error')
				}
				else if (result.length <= 0) {
					console.log('[App.js][ERROR] Cannot find data of user "' + data + '"')
				}
				else {
					io.to(socket.id).emit('navbar_email', result[0].email);
				}
			});
	});
});


http.listen(port, function () {
	console.log('Server started on port:' + port);
});
