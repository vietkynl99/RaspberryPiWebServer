var express = require('express');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
var uilog = require('../modules/uiLog')

app.use(cookieParser());

// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()

function handleClientRequest(address, sourceFile, needAdminPermission) {
	router.get(address, function (req, res) {
		let encryptedEmail = sqlAdapter.removeSpecialCharacter(req.cookies.key1);
		let encryptedToken = sqlAdapter.removeSpecialCharacter(req.cookies.key2);
		if (!encryptedEmail || !encryptedToken) {
			res.redirect('/login');
			return;
		}
		// check token
		sqlAdapter.checkAuthWithToken(encryptedEmail, encryptedToken,
			function successCallback(result) {
				if (result.length !== 1) {
					res.redirect('/login');
				}
				else if (needAdminPermission == true && result[0].permission !== sqlAdapter.UserPermission.ADMIN) {
					// res.redirect('/login');
					res.locals.message = 'You do not have permission to access this page.';
					res.locals.status = 401;
					res.status(401);
					res.render('error');
				}
				else {
					res.render(sourceFile, { email: sqlAdapter.decrypte(encryptedEmail) });
				}
			},
			function errorCallback(error) {
				uilog.log(uilog.Level.ERROR, 'SQL query error');
				res.send('Server error.');
			});
	});
}

// root
router.get('/', function (req, res) {
	res.redirect('/dashboard');
});

handleClientRequest('/dashboard', 'dashboard', false);
handleClientRequest('/account/login-history', 'account/login-history', true);
handleClientRequest('/setting/connectivity', 'setting/connectivity', true);


module.exports = router;
