var express = require('express');
var app = express();
var router = express.Router();

// Http request
router.get('/', function (req, res) {
	// go to signup page
	res.render('signUpPage');
});


module.exports = router;
