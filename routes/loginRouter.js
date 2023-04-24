var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
var uilog = require('../modules/uiLog')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()

var authHistoryList = [];
function saveAuthHistory(email, isValid) {
	let index = authHistoryList.findIndex(x => x.email === email)
	if (!isValid) {
		if (index < 0) {
			authHistoryList.push({ email: email, retry: 0, totalretry: 0, unlocktime: new Date() });
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

function allowLogin(email) {
	let index = authHistoryList.findIndex(x => x.email === email)
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
	res.clearCookie('key1');
	res.clearCookie('key2');
	// go to login page
	res.render('login');
});

router.post('/', function (req, res) {
	let email = sqlAdapter.removeSpecialCharacter(req.body.email);
	let password = sqlAdapter.removeSpecialCharacter(req.body.pass);
	if (!email || !password) {
		// deny request
		res.send({ response: 'deny', timeout: null });
		return
	}

	let data = allowLogin(email);
	if (!data.allow) {
		// clear the cookie
		res.clearCookie('key1');
		res.clearCookie('key2');
		// deny request
		res.send({ response: 'retry', timeout: data.timeout });
		return;
	}

	sqlAdapter.checkAuthWithPass(email, password,
		function successCallback(result) {
			if (result.length !== 1) {
				saveAuthHistory(email, false)
				// clear the cookie
				res.clearCookie('key1');
				res.clearCookie('key2');
				// deny request
				res.send({ response: 'deny', timeout: null });
				return;
			}
			else {
				uilog.log(uilog.Level.SYSTEM, "User " + email + " logged in successfully")
				saveAuthHistory(email, true);
				// set data to cookie
				let encryptedEmail = sqlAdapter.encrypte(email);
				let token = sqlAdapter.generateToken();
				let expires_date = new Date(Date.now() + 60 * 60 * 1000) //cookie will expire in 1 hour
				res.cookie('key1', encryptedEmail, { expires: expires_date, httpOnly: true });
				res.cookie('key2', token.encrypted, { expires: expires_date, httpOnly: true });
				// save token to sql
				sqlAdapter.updateToken(email, token.raw,
					function (changedRows) {
						if (changedRows !== 1) {
							uilog.log(uilog.Level.ERROR, "Cannot update token to sql")
							// deny request
							res.send({ response: 'deny', timeout: null });
						}
						else {
							res.send({ response: 'accept', timeout: null });
						}
					},
					function (error) {
						uilog.log(uilog.Level.ERROR, "Cannot update token to sql")
						// deny request
						res.send({ response: 'deny', timeout: null });
					});
			}
		},
		function errorCallback(error) {
			uilog.log(uilog.Level.ERROR, 'SQL query error')
			saveAuthHistory(email, false)
			// clear the cookie
			res.clearCookie('key1');
			res.clearCookie('key2');
			// deny request
			res.send({ response: 'deny', timeout: null });
		});
});

module.exports = router;
