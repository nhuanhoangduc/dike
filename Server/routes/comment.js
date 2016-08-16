var router = require('express').Router();
var commentServices = require('../services/commentServices');
var userServices = require('../services/userServices');

/*get all*/
router.post('/getAll', userServices.checkLogin, commentServices.getAll);

router.get('/getbyuser', userServices.checkLogin, commentServices.getByUser);
router.get('/getbyusercount', userServices.checkLogin, commentServices.getByUserCount);

/* add new */
router.post('/', userServices.checkLogin, commentServices.create);

router.delete('/:id', userServices.checkLogin, commentServices.remove);


module.exports = router;
