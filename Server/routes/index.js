var express = require('express');
var router = express.Router();
var passport = require('../services/OAuth/passport');
var resources = require('../configs/resources');

/* GET home page. */
router.get('/', function(req, res, next) {
  resources.getJsFiles(function(files) {
    res.render('index', { jsFiles: files });
  });
});

module.exports = router;
