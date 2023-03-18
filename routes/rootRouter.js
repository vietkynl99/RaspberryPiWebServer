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
	let username = sqlAdapter.removeSpecialCharacter(req.cookies.username);
	let token = sqlAdapter.removeSpecialCharacter(req.cookies.token);
	if (!username || !token) {
		res.redirect('/login');
		return;
	}
	// check token
	sqlAdapter.query(`SELECT * FROM userinfo WHERE username='${username}' AND token='${token}'`,
		function (success, result) {
			if (success == false) {
				res.redirect('/login');
			}
			else if (result.length <= 0) {
				res.redirect('/login');
			}
			else {
				res.redirect('/home');
			}
		})
});

module.exports = router;
