var router = require('Express').Router();
var gowithmeServices = require('../services/gowithmeServices');
var userServices = require('../services/userServices');


/* create new */
router.post('/', userServices.checkLogin, gowithmeServices.create);

module.exports = router;