var router = require('express').Router();
var postServices = require('../services/postServices');
var userServices = require('../services/userServices');


/* get info about a event */
router.get('/:type/:eventId', userServices.checkLogin, postServices.getPost);

// join event
router.get('/join/:type/:eventId', userServices.checkLogin, postServices.join);

// delete a post
router.delete('/:type/:eventId', userServices.checkLogin, postServices.deletePost);

module.exports = router;
