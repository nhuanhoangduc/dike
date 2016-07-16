var router = require('express').Router();
var travelServices = require('../services/travelServices');
var userServices = require('../services/userServices');


/* create new */
router.post('/', userServices.checkLogin, travelServices.create);

/* update */
router.put('/', userServices.checkLogin, travelServices.update);

router.get('/getbyuser', userServices.checkLogin, travelServices.getByUser);
router.get('/getbyusercount', userServices.checkLogin, travelServices.getByUserCount);

/* find one */
router.get('/:id', userServices.checkLogin, travelServices.getById);


module.exports = router;
