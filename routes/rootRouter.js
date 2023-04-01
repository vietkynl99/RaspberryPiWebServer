var express = require('express');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');

app.use(cookieParser());

// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()

// root
router.get('/', function (req, res) {
	res.redirect('/dashboard');
});

// dashboard
router.get('/dashboard', function (req, res) {
	let encryptedEmail = sqlAdapter.removeSpecialCharacter(req.cookies.key1);
	let encryptedToken = sqlAdapter.removeSpecialCharacter(req.cookies.key2);
	if (!encryptedEmail || !encryptedToken) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(encryptedEmail, encryptedToken,
		function successCallback(result) {
			if (result.length !== 1) {
				res.redirect('/login');
			}
			else {
				res.render('dashboard', { email: sqlAdapter.decrypte(encryptedEmail) });
			}
		},
		function errorCallback(error) {
			res.redirect('/login');
		});
});

// login history
router.get('/account/login-history', function (req, res) {
	let encryptedEmail = sqlAdapter.removeSpecialCharacter(req.cookies.key1);
	let encryptedToken = sqlAdapter.removeSpecialCharacter(req.cookies.key2);
	if (!encryptedEmail || !encryptedToken) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(encryptedEmail, encryptedToken,
		function successCallback(result) {
			if (result.length !== 1) {
				res.redirect('/login');
			}
			else if (result[0].permission !== sqlAdapter.UserPermission.ADMIN) {
				// res.redirect('/login');
				res.send('You do not have permission to access this page.');
			}
			else {
				res.render('account/login-history', { email: sqlAdapter.decrypte(encryptedEmail) });
			}
		},
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
		});
});

// connectivity
router.get('/setting/connectivity', function (req, res) {
	let encryptedEmail = sqlAdapter.removeSpecialCharacter(req.cookies.key1);
	let encryptedToken = sqlAdapter.removeSpecialCharacter(req.cookies.key2);
	if (!encryptedEmail || !encryptedToken) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(encryptedEmail, encryptedToken,
		function successCallback(result) {
			if (result.length !== 1) {
				res.redirect('/login');
			}
			else if (result[0].permission !== sqlAdapter.UserPermission.ADMIN) {
				// res.redirect('/login');
				res.send('You do not have permission to access this page.');
			}
			else {
				res.render('setting/connectivity', { email: sqlAdapter.decrypte(encryptedEmail) });
			}
		},
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
		});
});

module.exports = router;
