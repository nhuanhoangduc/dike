var request = require('request');
var key = 'AIzaSyDAJenglprl19UfLIr2vXugmM1BMqWFJME';
var urlencode = require('urlencode');
var async = require('async');
var _ = require('underscore');
var polyline = require('polyline');

var Travels = require('../models/travels');
var Studies = require('../models/study');

/* events */
var getModel = function(type) {

  var model = null;

  switch (type) {

    case 'travel':
      model = Travels;
      break;

    case 'study':
      model = Studies;
      break;

  }

  return model;

};


/* get by user */
var getByUser = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find({
      user: userId
    })
    .populate('user')
    .lean()
    .exec(function(err, travels) {

      if (err)
        return next(err);

      res.json(travels);

    });
};


var getByUserCount = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .count({
      user: userId
    })
    .populate('user')
    .lean()
    .exec(function(err, travels) {

      if (err)
        return next(err);

      res.json(travels);

    });
};


var getByUserJoin = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find({
      join: userId
    })
    .populate('user')
    .lean()
    .exec(function(err, travels) {

      if (err)
        return next(err);

      res.json(travels);

    });
};


var getByUserCountJoin = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .count({
      join: userId
    })
    .populate('user')
    .lean()
    .exec(function(err, travels) {

      if (err)
        return next(err);

      res.json(travels);

    });
};


var getByUserFavorite = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find({
      favorites: userId
    })
    .populate('user')
    .lean()
    .exec(function(err, travels) {

      if (err)
        return next(err);

      res.json(travels);

    });
};


var getByUserCountFavorite = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .count({
      favorites: userId
    })
    .populate('user')
    .lean()
    .exec(function(err, travels) {

      if (err)
        return next(err);

      res.json(travels);

    });
};


/* create new */
var create = function(req, res, next) {

  var event = req.body;
  var type = req.params.type;
  var model = getModel(type);
  var currentDate = new Date();

  if (!model)
    return next({ message: 'Invalid event type' });

  if (type === 'travel') {

    if (!event.finishTime || !event.cost)
      return next({ message: 'Null value' });

    if (event.typeOfUser === 'customer') { // customer

      delete event.freeSeats;
      delete event.vehicle;

    } else { // driver

      if (!event.freeSeats || !event.vehicle)
        return next({ message: 'Null value' });

    }

  }

  event.user = req.session.passport.user._id;
  event.created = new Date();
  event.commentUsers = [req.session.passport.user._id];


  if (!event.finishTime || (new Date(event.finishTime)) <= currentDate)
    return next({ message: 'Finish date must greater current date' });

  model.create(event, function(err, event) {

    if (err)
      return next(err);

    return res.json(event);

  });

};


/* update */
var update = function(req, res, next) {

  var event = req.body;

  if (!event.finishTime || !event.cost)
    return next({ message: 'Start time or cost is null value' });



  if (event.typeOfUser === 'customer') { // customer

    delete event.freeSeats;
    delete event.vehicle;

  } else { // driver

    if (!event.freeSeats || !event.vehicle)
      return next({ message: 'FreeSeats or vehicle is null value' });

  }

  event.user = req.session.passport.user._id;
  event.created = new Date();
  event.commentUsers = [req.session.passport.user._id];

  Travels
    .findOne({ _id: event._id })
    .lean()
    .exec(function(err, travel) {

      if (err)
        return next(err);

      if (!travel)
        return next({ message: 'Cannot find travel event' });

      if (travel.user.toString() !== req.user._id.toString())
        return next({ message: 'Only user who created this event can edit' });

      Travels.update({ _id: event._id }, event, function(err) {

        if (err)
          return next(err);

        return res.sendStatus(200);

      });

    });

};


// find a travel event with id
var getById_login = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);
  var user = req.user;

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .findOne({ _id: req.params.id })
    .lean()
    .exec(function(err, event) {

      if (err)
        return next(err);

      if (!event)
        return next({ message: 'Cannot find event' });

      if (event.user.toString() !== req.user._id.toString())
        return next({ message: 'Only user who created this event can edit' });

      res.json(event);

    });
};

// find a travel event with id
var getById = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .findOne({ _id: req.params.id })
    .populate('user')
    .lean()
    .exec(function(err, event) {

      if (err)
        return next(err);

      if (!event)
        return next({ message: 'Cannot find event' });

      res.json(event);

    });
};


/* Search near by location */
var searchNearBy = function(req, res, next) {

  // request params
  var startParams = [req.params.startLat, req.params.startLng];
  var endParams = [req.params.endLat, req.params.endLng];

  var startTime = new Date();

  var typeOfUser = req.params.typeOfUser;

  var search = {};


  // find data 
  async.parallel([

    // search start point
    function(done) {
      Travels
        .find({
          $and: [{
            start: {
              $near: startParams,
              $maxDistance: (3000 / 35) / 6371
            }
          }, {
            finishTime: {
              $gte: startTime
            }
          }]
        })
        .populate('user')
        .exec(function(err, startResults) {

          if (err)
            return done(err);

          search.start = startResults;
          done();

        });
    },

    // search end point
    function(done) {
      Travels
        .find({
          $and: [{
            end: {
              $near: endParams,
              $maxDistance: (3000 / 35) / 6371
            }
          }, {
            finishTime: {
              $gte: startTime
            }
          }]
        }, function(err, endResults) {

          if (err)
            return done(err);

          search.end = endResults;
          return done();

        });
    }

  ], function(err) {

    if (err)
      return next(err);

    if (search.start.length === 0 || search.end.length === 0)
      return res.json([]);

    var results = [];
    search.end = _.sortBy(search.end, '_id');

    async.each(search.start, function(start, nextItem) {

      var id = start._id;
      var index = _.sortedIndex(search.end, { _id: id }, '_id');

      if (index >= search.end.length)
        return nextItem();

      if (id.toString() === search.end[index]._id.toString()) {
        results.push(start);
      }

      nextItem();

    }, function() {

      res.json(results);

    });

  });

};


var getAll = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find({
      status: 'available'
    })
    .lean()
    .populate('user')
    .sort({ created: -1 })
    .exec(function(err, results) {

      if (err)
        return next(err);

      res.json(results);

    });

};



module.exports = {
  create: create,
  update: update,
  getById: getById,
  getByUser: getByUser,
  getByUserCount: getByUserCount,
  getByUserJoin: getByUserJoin,
  getByUserCountJoin: getByUserCountJoin,
  getById_login: getById_login,
  searchNearBy: searchNearBy,
  getByUserFavorite: getByUserFavorite,
  getByUserCountFavorite: getByUserCountFavorite,
  getAll: getAll
};
