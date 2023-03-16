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
	let username = sqlAdapter.removeSpecialCharacter(req.cookies.username);
	let token = sqlAdapter.removeSpecialCharacter(req.cookies.token);
	if (!username || !token) {
		res.redirect('/');
		return;
	}
	// check token
	sqlAdapter.query(`SELECT * FROM userinfo WHERE username='${username}' AND token='${token}'`,
		function (success, result) {
			if (success == false) {
				res.redirect('/');
			}
			else if (result.length <= 0) {
				res.redirect('/');
				console.log('[Home.js][WARN] Request login failed username "' + username + '" token "' + token + '"')
			}
			else {
				res.render('HomePage', { username: username });
			}
		})
});

module.exports = router;
