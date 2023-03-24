var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()

// Http request
router.get('/', function (req, res) {
	// go to signup page
	res.render('signUpPage');
});

router.post('/', function (req, res) {
	let firstname = sqlAdapter.removeSpecialCharacter(req.body.firstname);
	let lastname = sqlAdapter.removeSpecialCharacter(req.body.lastname);
	let phone = sqlAdapter.removeSpecialCharacter(req.body.phone);
	let birthday = sqlAdapter.removeSpecialCharacter(req.body.birthday);
	let email = sqlAdapter.removeSpecialCharacter(req.body.email);
	let password = sqlAdapter.removeSpecialCharacter(req.body.pass);
	if (!firstname || !lastname || !phone || !birthday || !email || !password) {
		// deny request
		res.send({ response: 'deny' });
		return
	}

	let permission = 2;

	sqlAdapter.query(`SELECT email FROM userinfo WHERE email='${email}'`,
		function (success, result) {
			if (success === false) {
				// deny request
				res.send({ response: 'deny' });
				return
			}
			else if (result.length !== 0) {
				// deny request
				res.send({ response: 'registered' });
				return;
			}
			else {
				sqlAdapter.query(`INSERT INTO userinfo (firstname, lastname, email, password, phone, birthday, permission) VALUES ('${firstname}', '${lastname}', '${email}', '${password}', '${phone}', '${birthday}', ${permission})`,
					function (success, result) {
						if (success === false || result.length !== 1) {
							// deny request
							res.send({ response: 'deny' });
							return;
						}
						else {
							res.send({ response: 'accept' });
							return;
						}
					});
			}
		});
});


module.exports = router;
