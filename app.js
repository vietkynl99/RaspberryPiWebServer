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

// module.exports = app;


// new connection to server
io.on('connection', function (socket) {
  console.log('Address [' + socket.handshake.address + '] ID [' + socket.id + '] connected')

  socket.on('authentication', function (username, password) {
    console.log('check authentication username[' + username + "] password[" + password + "]")
    io.emit('authentication', false);
  });

  //new message from client
  socket.on('message', function (msg) {
    console.log('get message from client: ' + msg)
    // send message back to client
    // io.emit('chat message', msg);
  });

  // client disconnect
  socket.on('disconnect', function () {
    console.log('Address [' + socket.handshake.address + '] ID [' + socket.id + '] disconnected')
  });
});


http.listen(port, function () {
  console.log('listening on port:' + port);
});
