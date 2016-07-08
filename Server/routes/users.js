var express = require('express');
var router = express.Router();
var passport = require('../services/OAuth/passport');
var userServices = require('../services/userServices');

// get current users
router.get('/currentUser',
  userServices.getCurrentUser());

// route for facebook authen
router.get('/login/facebook',
  passport.authenticate('facebook'));

// facebook authen callback
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));


module.exports = router;
