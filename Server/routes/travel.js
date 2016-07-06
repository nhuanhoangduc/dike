var router = require('express').Router();
var travelServices = require('../services/travelServices');
var userServices = require('../services/userServices');


/* create new */
router.post('/', userServices.checkLogin, travelServices.create);

module.exports = router;
