var router = require('express').Router();
var postServices = require('../services/postServices');


/* get info about a event */
router.get('/:type/:eventId', postServices.getPost);

module.exports = router;
