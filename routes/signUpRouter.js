var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var uilog = require('../modules/uiLog')

app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
var sqlAdapter = require('../modules/sqlAdapter')
sqlAdapter.connect()

function validate(arr) {
	if (!arr) {
		return false;
	}
	for (let index = 0; index < arr.length; index++) {
		let item = arr[index];

		if (!item.type || !item.data) {
			return false;
		}
		let type = item.type.trim();
		let data = item.data.trim();
		if (!type || !data) {
			return false;
		}
		switch (type) {
			case 'name':
				if (data.match(/^([a-zA-Z0-9 ]+)$/) == null) {
					return false;
				}
				break;
			case 'email':
				if (data.match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/) == null) {
					return false;
				}
				break;
			case 'phone':
				if (data.match(/^(\+84|0)\d{9}$/) == null) {
					return false;
				}
				break;
			case 'pass':
				if (data.length < 6 || data.match(/^([a-zA-Z0-9!-~ ]+)$/) == null || data.match(/(['"`]+)/) != null) {
					return false;
				}
				break;
			case 'birthday':
				if (data.match(/^\d{4}-\d{2}-\d{2}$/) == null) {
					return false;
				}
				break;
			default:
				return false;
		}
	}
	return true;
}

// Http request
router.get('/', function (req, res) {
	// go to signup page
	res.render('signup');
});

router.post('/', function (req, res) {

	let reqData = [{ type: 'name', data: req.body.firstname.trim() },
	{ type: 'name', data: req.body.lastname.trim() },
	{ type: 'email', data: req.body.email.trim() },
	{ type: 'pass', data: req.body.pass.trim() },
	{ type: 'phone', data: req.body.phone.trim() },
	{ type: 'birthday', data: req.body.birthday.trim() }];

	if (validate(reqData) == false) {
		res.send({ response: 'deny' });  // deny request
		return
	}

	let permission = 2;

	uilog.log(uilog.Level.SYSTEM, 'Request new account registration from email "' + req.body.email.trim() + '"')

	sqlAdapter.insertToTable('userinfo', 'firstname, lastname, email, password, phone, birthday, permission',
		`'${reqData[0].data}', '${reqData[1].data}', '${reqData[2].data}', '${reqData[3].data}', '${reqData[4].data}', '${reqData[5].data}', ${permission}`,
		function successCallback(result) {
			sqlAdapter.insertToTable('event', 'time, type, data', `NOW(), ${sqlAdapter.EventType.SIGN_UP}, '${reqData[2].data}'`,
				function (result) {
					uilog.log(uilog.Level.SYSTEM, 'New account has been registered: ' + reqData[2].data);
					res.send({ response: 'accept' }); // accept
				},
				function (error) {
					uilog.log(uilog.Level.ERROR, 'SQL query error')
					res.send({ response: 'deny' }); // deny request
				});
		},
		function errorCallback(error) {
			if (error.code === 'ER_DUP_ENTRY') {
				res.send({ response: 'registered' }); // deny request
			} else {
				uilog.log(uilog.Level.ERROR, 'SQL query error')
				res.send({ response: 'deny' }); // deny request
			}
		});
});


module.exports = router;
