var express = require('express');
var router = express.Router();
var userServices = require('../services/userServices');
var adminServices = require('../services/adminServices');


/* event */

router.post('/events/:type', adminServices.getEvents);

router.get('/events/unblock/:type/:id', adminServices.unBlockEvent);
router.get('/events/block/:type/:id', adminServices.blockEvent);

/* / event */


/* user */

router.get('/users', adminServices.getUsers);
router.get('/users/block', adminServices.getBlockedUsers);

router.get('/users/block/:id', adminServices.blockUser);
router.get('/users/unblock/:id', adminServices.unBlockUser);

router.get('/users/autocomplete', adminServices.userAutoComplete);
router.get('/users/autocomplete/:name', adminServices.userAutoComplete);

/*user */


module.exports = router;
