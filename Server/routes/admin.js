var express = require('express');
var router = express.Router();
var userServices = require('../services/userServices');
var adminServices = require('../services/adminServices');


/* event */

router.post('/events/:type', userServices.checkAdmin, adminServices.getEvents);

router.get('/events/unblock/:type/:id', userServices.checkAdmin, adminServices.unBlockEvent);
router.get('/events/block/:type/:id', userServices.checkAdmin, adminServices.blockEvent);

/* / event */


/* user */

router.post('/users', userServices.checkAdmin, adminServices.getUsers);

router.get('/users/block/:id', userServices.checkAdmin, adminServices.blockUser);
router.get('/users/unblock/:id', userServices.checkAdmin, adminServices.unBlockUser);

router.get('/users/loadadmin', userServices.checkAdmin, adminServices.loadAdmin);
router.get('/users/assignadmin/:facebookId', userServices.checkAdmin, adminServices.assignAdmin);
router.get('/users/unassignadmin/:facebookId', userServices.checkAdmin, adminServices.unAssignAdmin);

router.get('/users/autocomplete', userServices.checkAdmin, adminServices.userAutoComplete);
router.get('/users/autocomplete/:name', userServices.checkAdmin, adminServices.userAutoComplete);

/*user */


module.exports = router;
