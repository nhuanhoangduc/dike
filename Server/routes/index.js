var express = require('express');
var router = express.Router();
var passport = require('../services/OAuth/passport');

/* GET home page. */
router.get('/nhuan', function(req, res, next) {
  res.render('index');
});



module.exports = router;
