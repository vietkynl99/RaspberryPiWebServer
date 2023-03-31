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
	sqlAdapter.checkAuthWithToken(email, token,	function (success, result) {
		if (success !== true || result.length !== 1) {
			res.redirect('/login');
		}
			else {
				res.render('homePage', { email: email });
			}
		})
});
router.get('/account/login-history', function (req, res) {
	let email = sqlAdapter.removeSpecialCharacter(req.cookies.email);
	let token = sqlAdapter.removeSpecialCharacter(req.cookies.token);
	if (!email || !token) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(email, token,	function (success, result) {
		if (success !== true || result.length !== 1) {
			res.redirect('/login');
		}
			else if (result[0].permission !== sqlAdapter.UserPermission.ADMIN) {
				// res.redirect('/login');
				res.send('You do not have permission to access this page.');
			}
			else {
				res.render('account/login-history', { email: email });
			}
		})
});
router.get('/setting/connectivity', function (req, res) {
	let email = sqlAdapter.removeSpecialCharacter(req.cookies.email);
	let token = sqlAdapter.removeSpecialCharacter(req.cookies.token);
	if (!email || !token) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.checkAuthWithToken(email, token,	function (success, result) {
		if (success !== true || result.length !== 1) {
			res.redirect('/login');
		}
			else if (result[0].permission !== sqlAdapter.UserPermission.ADMIN) {
				// res.redirect('/login');
				res.send('You do not have permission to access this page.');
			}
			else {
				res.render('setting/connectivity', { email: email });
			}
		})
});

module.exports = router;
