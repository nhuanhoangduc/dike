var router = require('express').Router();
var commentServices = require('../services/commentServices');

/*get all*/
router.get('/:type/:eventid', commentServices.getAll);

/* add new */
router.post('/', commentServices.create);


module.exports = router;
