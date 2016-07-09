var router = require('express').Router();
var commentServices = require('../services/commentServices');
var userServices = require('../services/userServices');

/*get all*/
router.get('/:type/:eventid', userServices.checkLogin, commentServices.getAll);

/* add new */
router.post('/', userServices.checkLogin, commentServices.create);


module.exports = router;
