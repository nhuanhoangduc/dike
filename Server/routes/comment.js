var router = require('express').Router();
var commentServices = require('../services/commentServices');
var userServices = require('../services/userServices');

/*get all*/
router.get('/:type/:eventid', userServices.checkLogin, commentServices.getAll);
router.get('/join/:type/:eventid', userServices.checkLogin, commentServices.getAllJoin);

router.get('/getbyuser', userServices.checkLogin, commentServices.getByUser);
router.get('/getbyusercount', userServices.checkLogin, commentServices.getByUserCount);

/* add new */
router.post('/', userServices.checkLogin, commentServices.create);

router.delete('/:id', userServices.checkLogin, commentServices.remove);


module.exports = router;
