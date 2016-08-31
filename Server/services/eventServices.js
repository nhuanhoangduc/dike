var request = require('request');
var key = 'AIzaSyDAJenglprl19UfLIr2vXugmM1BMqWFJME';
var urlencode = require('urlencode');
var async = require('async');
var _ = require('underscore');
var polyline = require('polyline');

var Travels = require('../models/travels');
var Studies = require('../models/study');
var Users = require('../models/users');

var geolib = require('geolib');
var facebook = require('../services/facebookServices');

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

  try {
    event.slots = parseInt(event.slots);
  } catch (ex) {
    return next(ex);
  }

  if (!model)
    return next({ message: 'Invalid event type' });

  if (type === 'travel') {

    if (!event.finishTime || !event.cost)
      return next({ message: 'Null value' });

    if (event.typeOfUser === 'customer') { // customer

      delete event.slots;
      delete event.vehicle;

    } else { // driver

      if (!event.slots || !event.vehicle)
        return next({ message: 'Null value' });

    }

  }

  event.user = req.session.passport.user._id;
  event.created = new Date();
  event.commentUsers = [req.session.passport.user._id];

  var parseNumber = parseInt(event.slots, 10);
  if (!parseNumber)
    return next({ message: 'Slot is not a number!' });

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
  var type = req.params.type;
  var model = getModel(type);
  var currentDate = new Date();

  try {
    event.slots = parseInt(event.slots);
  } catch (ex) {
    return next(ex);
  }

  if (!model)
    return next({ message: 'Invalid event type' });

  if (type === 'travel') {

    if (!event.finishTime || !event.cost)
      return next({ message: 'Null value' });

    if (event.typeOfUser === 'customer') { // customer

      delete event.slots;
      delete event.vehicle;

    } else { // driver

      if (!event.slots || !event.vehicle)
        return next({ message: 'Null value' });

    }

  }


  if (!event.finishTime || (new Date(event.finishTime)) <= currentDate)
    return next({ message: 'Finish date must greater current date' });


  model
    .findOne({ _id: event._id })
    .populate('user')
    .exec(function(err, result) {

      if (err)
        return next(err);

      if (!result)
        return next({ message: 'Cannot find this event' });

      if (result.user._id.toString() !== req.user._id.toString())
        return next({ message: 'Only user who created this event can edit' });

      var joins = result.join;

      // create facebook notification
      Users
        .find({ _id: { $in: joins } })
        .lean()
        .exec(function(err, users) {

          if (err)
            return cb(err);

          async.each(users, function(user, nextUser) {

            if (user._id.toString() === result.user._id.toString())
              return;

            var template = result.user.name + ' has edited his/her post';
            facebook.createNotification(user.facebookId, template, 'http://www.google.vn', function() {
              return nextUser();
            });

          });

        });
      // end facebook notification

      model.update({ _id: event._id }, event, function(err) {

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

  var startRadius = req.params.startRadius;
  var endRadius = req.params.endRadius;

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
              $maxDistance: (startRadius * 1000 / 35) / 6371
            }
          }, {
            finishTime: {
              $gte: startTime
            }
          }, {
            status: 'available'
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
              $maxDistance: (endRadius * 1000 / 35) / 6371
            }
          }, {
            finishTime: {
              $gte: startTime
            }
          }, {
            status: 'available'
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
        var startRange = geolib.getDistance({
          latitude: req.params.startLat,
          longitude: req.params.startLng
        }, {
          latitude: start.start.lat,
          longitude: start.start.lng,
        });

        var endRange = geolib.getDistance({
          latitude: req.params.endLat,
          longitude: req.params.endLng
        }, {
          latitude: start.end.lat,
          longitude: start.end.lng,
        });

        start._doc.startRange = startRange / 1000;
        start._doc.endRange = endRange / 1000;

        results.push(start);
      }

      nextItem();

    }, function() {

      results = _.sortBy(results, 'startRange');
      res.json(results);

    });

  });

};


var search = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);
  var query = req.body.query;

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find(query, { score: { $meta: 'textScore' } })
    .lean()
    .populate('user')
    .sort({ created: -1 })
    .exec(function(err, results) {

      if (err)
        return next(err);

      res.json(results);

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
  search: search,
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
