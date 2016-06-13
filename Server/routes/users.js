var express = require('express');
var router = express.Router();
var passport = require('../services/OAuth/passport');

// route for facebook authen
router.get('/login/facebook',
  passport.authenticate('facebook'),
  function(req, res, next) {
    console.log("ok");
  });

// facebook authen callback
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/users/login',
    failureRedirect: '/nhuan'
  }));



module.exports = router;
