var router = require('express').Router();
var mapServices = require('../services/mapServices');

// suggest list of places from a name
router.get('/autocomplete', mapServices.autoComplete);
router.get('/autocomplete/:place', mapServices.autoComplete);

// get lat lng from a place
router.get('/getdetail/:placeId', mapServices.getDetail);

// get place name from lat lng
router.get('/geocode/:lat/:lng', mapServices.geoCode);

// get direction
router.get('/direction/:startLat/:startLng/:endLat/:endLng', mapServices.direction);

// search data
router.get('/travelsearch/:startLat/:startLng/:startRadius/:endLat/:endLng/:endRadius/:startTime/:endTime', mapServices.travelSearch);


module.exports = router;
