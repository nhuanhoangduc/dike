var request = require('request');
var key = 'AIzaSyDAJenglprl19UfLIr2vXugmM1BMqWFJME';
var urlencode = require('urlencode');
var Travels = require('../models/travels');
var async = require('async');
var _ = require('underscore');
var polyline = require('polyline');


/* get by user */
var getByUser = function(req, res, next) {
  var user = req.user;
  var userId = user._id;

  Travels
    .find({
      user: userId
    })
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

  Travels
    .count({
      user: userId
    })
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

  if (!event.startTime || !event.cost)
    return next({ message: 'Null value' });

  event.user = req.session.passport.user._id;
  event.created = new Date();
  event.commentUsers = [req.session.passport.user._id];

  if (event.typeOfUser === 'customer') { // customer
    delete event.freeSeats;
    delete event.vehicle;
  } else { // driver

    if (!event.freeSeats || !event.vehicle)
      return next({ message: 'Null value' });

  }

  Travels.create(event, function(err, event) {
    if (err)
      return next(err);

    return res.json(event);
  });
};


/* update */
var update = function(req, res, next) {
  var event = req.body;

  if (!event.startTime || !event.cost)
    return next({ message: 'Start time or cost is null value' });

  event.user = req.session.passport.user._id;
  event.created = new Date();
  event.commentUsers = [req.session.passport.user._id];

  if (event.typeOfUser === 'customer') { // customer
    delete event.freeSeats;
    delete event.vehicle;
  } else { // driver

    if (!event.freeSeats || !event.vehicle)
      return next({ message: 'FreeSeats or vehicle is null value' });

  }

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

    })

};


// find a travel event with id
var getById_login = function(req, res, next) {
  Travels
    .findOne({ _id: req.params.id })
    .lean()
    .exec(function(err, travel) {
      if (err)
        return next(err);

      if (travel.user.toString() !== req.user._id.toString())
        return next({ message: 'Only user who created this event can edit' });

      res.json(travel);
    });
};

// find a travel event with id
var getById = function(req, res, next) {
  Travels
    .findOne({ _id: req.params.id })
    .lean()
    .exec(function(err, travel) {
      if (err)
        return next(err);

      res.json(travel);
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
            startTime: {
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
            startTime: {
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



module.exports = {
  create: create,
  update: update,
  getById: getById,
  getByUser: getByUser,
  getByUserCount: getByUserCount,
  getById_login: getById_login,
  searchNearBy: searchNearBy
};
