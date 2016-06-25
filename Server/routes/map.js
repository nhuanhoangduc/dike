var router = require('express').Router();
var mapServices = require('../services/mapServices');

router.get('/autocomplete', mapServices.autoComplete);
router.get('/autocomplete/:place', mapServices.autoComplete);

router.get('/getdetail/:placeId', mapServices.getDetail);


module.exports = router;
