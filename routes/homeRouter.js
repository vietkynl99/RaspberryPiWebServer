var express = require('express');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');

app.use(cookieParser());

// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()

// Http request
router.get('/', function (req, res) {
	let email = sqlAdapter.removeSpecialCharacter(req.cookies.email);
	let token = sqlAdapter.removeSpecialCharacter(req.cookies.token);
	if (!email || !token) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(email, token,
		function successCallback(result) {
			if (result.length !== 1) {
				res.redirect('/login');
			}
			else {
				res.render('homePage', { email: email });
			}
		},
		function errorCallback(error) {
			res.redirect('/login');
		});
});
router.get('/account/login-history', function (req, res) {
	let email = sqlAdapter.removeSpecialCharacter(req.cookies.email);
	let token = sqlAdapter.removeSpecialCharacter(req.cookies.token);
	if (!email || !token) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(email, token,
		function successCallback(result) {
			if (result.length !== 1) {
				res.redirect('/login');
			}
			else if (result[0].permission !== sqlAdapter.UserPermission.ADMIN) {
				// res.redirect('/login');
				res.send('You do not have permission to access this page.');
			}
			else {
				res.render('account/login-history', { email: email });
			}
		},
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
		});
});
router.get('/setting/connectivity', function (req, res) {
	let email = sqlAdapter.removeSpecialCharacter(req.cookies.email);
	let token = sqlAdapter.removeSpecialCharacter(req.cookies.token);
	if (!email || !token) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(email, token,
		function successCallback(result) {
			if (result.length !== 1) {
				res.redirect('/login');
			}
			else if (result[0].permission !== sqlAdapter.UserPermission.ADMIN) {
				// res.redirect('/login');
				res.send('You do not have permission to access this page.');
			}
			else {
				res.render('setting/connectivity', { email: email });
			}
		},
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
		});
});

module.exports = router;
