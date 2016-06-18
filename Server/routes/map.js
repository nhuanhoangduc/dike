var router = require('express').Router();
var mapServices = require('../services/mapServices');

router.get('/autocomplete/:place', mapServices.autoComplete());


module.exports = router;
