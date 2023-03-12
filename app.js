var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');
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
app.use('/', loginRouter);
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
const sqlcon = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "KynlMySQL1103@!",
	database: "kynlwebdb"
});

try {
	sqlcon.connect((err) => {
		if (err) {
			throw err
		}
		console.log('[App.js] Database connected!')
	});
}
catch (error) {
	console.log("[App.js][ERROR] Can't connect to database: " + error)
	process.exit(1)
}

function sqlQuery(query, callback) {
	try {
		sqlcon.query(query, (error, result) => {
			if (error) {
				throw error
			}
			callback(true, result)
		});
	}
	catch (error) {
		console.log("[App.js][ERROR] Sql query error: " + error)
		callback(false, undefined)
	}
}


// new connection to server
io.on('connection', function (socket) {
	console.log('Address [' + socket.handshake.address + '] ID [' + socket.id + '] connected')

	// client disconnect
	socket.on('disconnect', function () {
		console.log('Address [' + socket.handshake.address + '] ID [' + socket.id + '] disconnected')
	});

	//new message from client
	socket.on('message', function (msg) {
		console.log('get message from client: ' + msg)
	});

	// request data from client
	socket.on('navbar_fullname', function (data) {
		var query = `SELECT name FROM userinfo WHERE username='${data}'`
		sqlQuery(query, function (success, result) {
			if (success == false) {
				console.log('[App.js][ERROR] SQL query error')
			}
			else if (result.length <= 0) {
				console.log('[App.js][ERROR] Cannot find data of user "' + data + '"')
			}
			else {
				io.emit('navbar_fullname', result[0].name);
			}
		})
	});
	socket.on('navbar_email', function (data) {
		var query = `SELECT email FROM userinfo WHERE username='${data}'`
		sqlQuery(query, function (success, result) {
			if (success == false) {
				console.log('[App.js][ERROR] SQL query error')
			}
			else if (result.length <= 0) {
				console.log('[App.js][ERROR] Cannot find data of user "' + data + '"')
			}
			else {
				io.emit('navbar_email', result[0].email);
			}
		})
	});
});


http.listen(port, function () {
	console.log('Server started on port:' + port);
});
