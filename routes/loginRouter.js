var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
const crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function generateToken() {
	return crypto.randomBytes(20).toString('hex');
}

// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()

var authHistoryList = [];
function saveAuthHistory(username, isValid) {
	let index = authHistoryList.findIndex(x => x.username === username)
	if (!isValid) {
		if (index < 0) {
			authHistoryList.push({ username: username, retry: 0, totalretry: 0, unlocktime: new Date() });
		}
		else {
			authHistoryList[index].retry++;
			authHistoryList[index].totalretry++;
			// increase unlock time
			if (authHistoryList[index].retry >= 3) {
				authHistoryList[index].retry = 0;
				let now = new Date();
				let numberOfIncrements = Math.round(authHistoryList[index].totalretry / 3);
				authHistoryList[index].unlocktime.setMinutes(now.getMinutes() + 5 * Math.pow(2, numberOfIncrements - 1));
			}
		}
	} else {
		if (index >= 0) {
			authHistoryList.splice(index, 1);
		}
	}
}

function allowLogin(username) {
	let index = authHistoryList.findIndex(x => x.username === username)
	if (index < 0) {
		return { allow: true, timeout: null };
	}
	if (authHistoryList[index].totalretry <= 0 || authHistoryList[index].totalretry % 3 !== 0) {
		return { allow: true, timeout: null };
	}

	let now = new Date();
	let timeout = authHistoryList[index].unlocktime.getMinutes() - now.getMinutes();
	if (timeout > 0) {
		return { allow: false, timeout: timeout };
	} else {
		return { allow: true, timeout: null };
	}
}

// Http request
router.get('/', function (req, res) {
	// clear the cookie
	res.clearCookie('username');
	res.clearCookie('token');
	// go to login page
	res.render('loginPage');
});

router.post('/', function (req, res) {
	let username = sqlAdapter.removeSpecialCharacter(req.body.username);
	let password = sqlAdapter.removeSpecialCharacter(req.body.pass);
	if (!username || !password) {
		// deny request
		res.send({ response: 'deny', timeout: null });
		return
	}

	let data = allowLogin(username);
	if (!data.allow) {
		// clear the cookie
		res.clearCookie('username');
		res.clearCookie('token');
		// deny request
		res.send({ response: 'retry', timeout: data.timeout });
		return;
	}

	sqlAdapter.query(`SELECT username FROM userinfo WHERE username='${username}' AND password='${password}'`,
		function (success, result) {
			if (success === false || result.length !== 1) {
				saveAuthHistory(username, false)
				// clear the cookie
				res.clearCookie('username');
				res.clearCookie('token');
				// deny request
				res.send({ response: 'deny', timeout: null });
				return;
			}
			
			saveAuthHistory(username, true);
			// set data to cookie
			let token = sqlAdapter.removeSpecialCharacter(generateToken());
			if (!token) {
				return
			}
			let expires_date = new Date(Date.now() + 60 * 60 * 1000) //cookie will expire in 1 hour
			// res.cookie('username', username, { expires: expires_date, httpOnly: true, secure: true });
			// res.cookie('token', token, { expires: expires_date, httpOnly: true, secure: true });
			res.cookie('username', username, { expires: expires_date, httpOnly: true });
			res.cookie('token', token, { expires: expires_date, httpOnly: true });
			// save token to sql
			sqlAdapter.query(`UPDATE userinfo SET token = '${token}' , lastlogin = NOW() WHERE username = '${username}'`,
				function (success, result) {
					if (success == false) {
						console.log("[Login.js][Error] Can't update token to sql")
						// deny request
						res.send({ response: 'deny', timeout: null });
					}
					else {
						// accept request
						res.send({ response: 'accept', timeout: null });
					}
				})
		})
});

module.exports = router;
