var router = require('express').Router();
var mapServices = require('../services/mapServices');

// suggest list of places from a name
router.get('/autocomplete', mapServices.autoComplete);
router.get('/autocomplete/:place', mapServices.autoComplete);

// get lat lng from a place
router.get('/getdetail/:placeId', mapServices.getDetail);

// get place name from lat lng
router.get('/geocode/:lat/:lng', mapServices.geoCode);

// search data
router.get('/gowithmesearch/:startLat/:startLng/:startRadius/:endLat/:endLng/:endRadius', mapServices.search_goWithMe);


module.exports = router;
