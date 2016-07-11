var router = require('express').Router();
var postServices = require('../services/postServices');
var userServices = require('../services/userServices');


/* get info about a event */
router.get('/:type/:eventId', userServices.checkLogin, postServices.getPost);

// delete a post
router.delete('/:type/:eventId', userServices.checkLogin, postServices.deletePost);

module.exports = router;
