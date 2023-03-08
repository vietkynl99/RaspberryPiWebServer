var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcrypt');
const secretkey = '!Ky#l12_Tr@nq!';
var app = express();
var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');

// socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// mysql
var mysql = require('mysql');

const sqlcon = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "KynlMySQL1103@!",
	database: "kynlwebdb"
});
sqlcon.connect((err) => {
	if (err) {
		throw err
	}
	console.log('Database connected!')
});
function checkAuthentication(username, password, callback) {
	const query = `SELECT * FROM userinfo WHERE username='${username}' AND password='${password}'`
	sqlcon.query(query, (error, results) => {
		if (error) {
			throw error
		}
		if (results.length == 0) {
			callback('deny')
		}
		else {
			callback('accept')
		}
	});
}
function getPassFromSQL(username, callback) {
	const query = `SELECT password FROM userinfo WHERE username='${username}'`
	sqlcon.query(query, (error, results) => {
		if (error) {
			throw error
		}
		if (results.length == 0) {
			callback(null)
		}
		else {
			callback(results[0].password)
		}
	});
}

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


// new connection to server
io.on('connection', function (socket) {
	// console.log('Address [' + socket.handshake.address + '] ID [' + socket.id + '] connected')

	// check authentication
	socket.on('check auth', function (username, password) {
		checkAuthentication(username, password, function (result) {
			var salt = bcrypt.genSaltSync(10)
			var hash = bcrypt.hashSync(password + secretkey, salt)
			io.emit('resp auth', result, hash);
		})
	});
	socket.on('check hash', function (username, hash) {
		getPassFromSQL(username, function (password) {
			if (password == null) {
				io.emit('resp hash', 'deny');
			}
			else {
				if (bcrypt.compareSync(password + secretkey, hash)) {
					console.log('User "' + username + '" logged in successfully!')
					io.emit('resp hash', 'accept');
				}
				else {
					io.emit('resp hash', 'deny');
				}
			}
		})
	});

	//new message from client
	socket.on('message', function (msg) {
		console.log('get message from client: ' + msg)
	});

	// client disconnect
	socket.on('disconnect', function () {
		// console.log('Address [' + socket.handshake.address + '] ID [' + socket.id + '] disconnected')
	});
});


http.listen(port, function () {
	console.log('Server started on port:' + port);
});
