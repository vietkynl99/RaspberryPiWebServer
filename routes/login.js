var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
const crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function generateToken() {
	const token = crypto.randomBytes(20).toString('hex');
	return token;
}

// connect to database
var SqlAdapter = require('../modules/SqlAdapter')
var sqlAdapter = new SqlAdapter()
sqlAdapter.connect()

// Http request
router.get('/', function (req, res) {
	// clear the cookie
	res.clearCookie('username');
	res.clearCookie('token');
	// go to login page
	res.render('LoginPage');
});

router.post('/', function (req, res) {
	var username = req.body.username;
	var password = req.body.pass;

	sqlAdapter.query(`SELECT username FROM userinfo WHERE username='${username}' AND password='${password}'`,
		function (success, result) {
			if (success == false) {
				console.log("[Login.js][Error] Sql query error")
				// clear the cookie
				res.clearCookie('username');
				res.clearCookie('token');
				// go to login page
				res.render('LoginPage');
			}
			else if (result.length <= 0) {
				// clear the cookie
				res.clearCookie('username');
				res.clearCookie('token');
				// go to login page
				res.render('LoginPage');
			}
			else {
				// set data to cookie
				var token = generateToken();
				var expires_date = new Date(Date.now() + 60 * 60 * 1000) //cookie will expire in 1 hour
				// res.cookie('username', username, { expires: expires_date, httpOnly: true, secure: true });
				// res.cookie('token', token, { expires: expires_date, httpOnly: true, secure: true });
				res.cookie('username', username, { expires: expires_date, httpOnly: true });
				res.cookie('token', token, { expires: expires_date, httpOnly: true });
				// save token to sql
				sqlAdapter.query(`UPDATE userinfo SET token = '${token}' , lastlogin = NOW() WHERE username = '${username}'`,
					function (success, result) {
						if (success == false) {
							console.log("[Login.js][Error] Can't update token to sql")
						}
					})
				// go to home page
				res.redirect('/home');
			}
		})
});

module.exports = router;
