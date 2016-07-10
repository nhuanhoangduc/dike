var express = require('express');
var router = express.Router();
var passport = require('../services/OAuth/passport');
var resources = require('../configs/resources');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { jsFiles: resources.getJsFiles });
});

module.exports = router;
