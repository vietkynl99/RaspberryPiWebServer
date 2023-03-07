var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.render('loginPage', { title: 'Express' });
  res.render('loginPage');
});

module.exports = router;
