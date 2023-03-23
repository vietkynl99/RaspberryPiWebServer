var express = require('express');
var app = express();
var router = express.Router();

// Http request
router.get('/', function (req, res) {
	res.redirect('/home');
});

module.exports = router;
