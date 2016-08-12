var router = require('express').Router();
var eventServices = require('../services/eventServices');
var userServices = require('../services/userServices');


/* create new */
router.post('/:type', userServices.checkLogin, eventServices.create);

/* update */
router.put('/:type', userServices.checkLogin, eventServices.update);


/* user profile */
router.get('/:type/getbyuser', userServices.checkLogin, eventServices.getByUser);
router.get('/:type/getbyusercount', userServices.checkLogin, eventServices.getByUserCount);

router.get('/:type/join/getbyuser', userServices.checkLogin, eventServices.getByUserJoin);
router.get('/:type/join/getbyusercount', userServices.checkLogin, eventServices.getByUserCountJoin);

router.get('/:type/favorite/getbyuser', userServices.checkLogin, eventServices.getByUserFavorite);
router.get('/:type/favorite/getbyusercount', userServices.checkLogin, eventServices.getByUserCountFavorite);
/* finish user profile */

/* find one */
router.get('/:type/:id', userServices.checkLogin, eventServices.getById_login);
router.get('/:type/public/:id', eventServices.getById);

router.get('/travel/nearby/:startLat/:startLng/:endLat/:endLng', eventServices.searchNearBy);


module.exports = router;
