var express = require('express');
var router = express.Router();
var userServices = require('../services/userServices');
var adminServices = require('../services/adminServices');


/* event */

router.get('/events/:type', adminServices.getEvents);
router.get('/events/report/:type', adminServices.getReportedEvents);

router.get('/events/disable/:type', adminServices.getDisabledEvents);

router.get('/events/unblock/:type/:id', adminServices.unBlockEvent);
router.get('/events/block/:type/:id', adminServices.blockEvent);

/* / event */


/* user */

router.get('/users', adminServices.getUsers);
router.get('/users/block', adminServices.getBlockedUsers);

router.get('/users/block/:id', adminServices.blockUser);
router.get('/users/unblock/:id', adminServices.unBlockUser);

/*user */


module.exports = router;