var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var cookieParser = require('cookie-parser');

app.use(cookieParser());

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
		console.log('[Home.js] Database connected!')
	});
}
catch (error) {
	console.log("[Home.js][ERROR] Can't connect to database: " + error)
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
	if (!req.cookies.username || !req.cookies.token) {
		res.redirect('/');
		return;
	}
	// check token
	var query = `SELECT * FROM userinfo WHERE username='${req.cookies.username}' AND token='${req.cookies.token}'`
	sqlQuery(query, function (success, result) {
		if (success == false) {
			res.redirect('/');
		}
		else if (result.length <= 0) {
			res.redirect('/');
			console.log('[Home.js][WARN] Request login failed username "' + req.cookies.username + '" token "' + req.cookies.token + '"')
		}
		else {
			console.log('[Home.js] User "' + req.cookies.username + '" logged in')
			res.render('HomePage', { username: req.cookies.username });
		}
	})
});

module.exports = router;
