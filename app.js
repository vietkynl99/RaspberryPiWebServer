var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
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
var SqlAdapter = require('./modules/SqlAdapter')
var sqlAdapter = new SqlAdapter()
sqlAdapter.connect()

// client list
var clientList = new Array();
function print_client_list() {
	console.log();
	if(clientList.length == 0) {
		console.log('There are no client!')
	}
	else
	{
		console.log('There are ' + clientList.length + ' client:')
		clientList.forEach(function(value, index) {
			console.log((index + 1) + '. username=' + value.username + ' id=' + value.id)
		})
	}
	console.log();
}
function client_list_add(username, id) {
	clientList.push({username: username, id: id})
}
function client_list_remove(id) {
	var index = clientList.findIndex(x => x.id === id)
	if(index >= 0) {
		var data = clientList.at(index)
		clientList.splice(index, 1)
		return data
	}
	else {
		console.log('[App.js][ERROR] Cannot find user with id=' + id)
		return null
	}
}

function user_login(username, id) {
	console.log('[App.js] User "' + username + '" logged in!')
	client_list_add(username, id)
	print_client_list()
}

function user_logout(id) {
	var data = client_list_remove(id)
	if(data)
	{
		console.log('[App.js] User "' + data.username + '" logged out!')
		print_client_list()
	}
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
		user_login(username, socket.id)
	});

	// request data from client
	socket.on('navbar_fullname', function (data) {
		var query = `SELECT name FROM userinfo WHERE username='${data}'`
		sqlAdapter.query(query, function (success, result) {
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
		sqlAdapter.query(query, function (success, result) {
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
