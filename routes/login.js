var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
const crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function generateToken() {
	const token = crypto.randomBytes(20).toString('hex');
	return token;
}

// connect to database
const sqlcon = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "KynlMySQL1103@!",
	database: "kynlwebdb"
});

try {
	sqlcon.connect((err) => {
		if (err) {
			throw err
		}
		console.log('[Login.js] Database connected!')
	});
}
catch (error) {
	console.log("[Login.js][ERROR] Can't connect to database: " + error)
	process.exit(1)
}

function sqlQuery(query, callback) {
	try {
		sqlcon.query(query, (error, result) => {
			if (error) {
				throw error
			}
			callback(true, result)
		});
	}
	catch (error) {
		console.log("[Login.js][ERROR] Sql query error: " + error)
		callback(false, undefined)
	}
}

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

	var query = `SELECT * FROM userinfo WHERE username='${username}' AND password='${password}'`
	sqlQuery(query, function (success, result) {
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
			res.cookie('username', username, { expires: expires_date, httpOnly: true});
			res.cookie('token', token, { expires: expires_date, httpOnly: true});
			// save token to sql
			var query = `UPDATE userinfo SET token = '${token}' , lastlogin = NOW() WHERE username = '${username}'`
			sqlQuery(query, function (success, result) {
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
