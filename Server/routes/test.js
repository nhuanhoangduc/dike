var router = require('express')
  .Router();

var Tests = require('../models/test');

/*get all*/
router.get('/', function(req, res, next) {

  Tests
    .find()
    .lean()
    .exec(function(err, tests) {

      if (err)
        return next(err);

      res.json(tests);

    });

});


router.post('/', function(req, res, next) {

  Tests
    .create(req.body, function(err) {

      if (err)
        return next(err);

      return res.sendStatus(200);

    });

});


router.put('/', function(req, res, next) {

  Tests
    .update({
      _id: req.body._id
    }, req.body, function(err) {

      if (err)
        return next(err);

      return res.sendStatus(200);

    });

});


router.delete('/:id', function(req, res, next) {

  Tests
    .remove({
      _id: req.params.id
    }, function(err) {

      if (err)
        return next(err);

      return res.sendStatus(200);

    });

});



module.exports = router;
