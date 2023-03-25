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
	sqlAdapter.query(`SELECT email FROM userinfo WHERE email='${email}' AND token='${token}' AND lastlogin >= DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
		function (success, result) {
			if (success == false || result.length != 1) {
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
	sqlAdapter.query(`SELECT email FROM userinfo WHERE email='${email}' AND token='${token}' AND lastlogin >= DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
		function (success, result) {
			if (success == false || result.length != 1) {
				res.redirect('/login');
			}
			else {
				res.render('account/login-history', { email: email });
			}
		})
});

module.exports = router;
