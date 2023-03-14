var express = require('express');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');

app.use(cookieParser());

// connect to database
var SqlAdapter = require('../modules/SqlAdapter')
var sqlAdapter = new SqlAdapter()
sqlAdapter.connect()

// Http request
router.get('/', function (req, res) {
	if (!req.cookies.username || !req.cookies.token) {
		res.redirect('/');
		return;
	}
	// check token
	sqlAdapter.query(`SELECT * FROM userinfo WHERE username='${req.cookies.username}' AND token='${req.cookies.token}'`,
		function (success, result) {
			if (success == false) {
				res.redirect('/');
			}
			else if (result.length <= 0) {
				res.redirect('/');
				console.log('[Home.js][WARN] Request login failed username "' + req.cookies.username + '" token "' + req.cookies.token + '"')
			}
			else {
				res.render('HomePage', { username: req.cookies.username });
			}
		})
});

module.exports = router;
