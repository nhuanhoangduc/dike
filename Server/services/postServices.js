var Travels = require('../models/travels');
var Studies = require('../models/study');
var Comments = require('../models/comments');

var facebook = require('../services/facebookServices');
var async = require('async');


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


var getPost = function(req, res, next) {
  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .findOne({ _id: eventId })
    .populate('user')
    .exec(function(err, event) {

      if (err)
        return next(err);

      if (!event)
        return next({ message: 'Cannot find event' });

      var finishTime = new Date(event.finishTime);
      var currentDate = new Date();
      event._doc.isFinish = finishTime < currentDate ? true : false;

      model.update({ _id: eventId }, { views: event.views + 1 }, function() {});

      return res.send(event);

    });
};


var close = function(req, res, next) {

  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;
  var user = req.user;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .update({ _id: eventId, user: user._id }, { status: 'closed' }, function(err) {

      if (err)
        return next(err);

      res.sendStatus(200);

    });

};


var join = function(req, res, next) {

  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;
  var user = req.user;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .findOne({ _id: eventId })
    .populate('user')
    .exec(function(err, event) {

      if (err)
        return next(err);

      if (!event)
        return next({ message: 'Cannot find event' });

      var index = event.join.indexOf(user._id.toString());

      if (index >= 0)
        event.join.splice(index, 1);
      else
        event.join.push(user._id);

      if (event.join.length > event.slots)
        return next({ message: 'This event has full slots' });

      model.update({ _id: event._id }, { join: event.join }, function(err) {
        if (err)
          return next(err);

        var template = user.name + ' has joined your event';

        facebook.createNotification(event.user.facebookId, template, 'http://www.google.vn', function() {});

        res.sendStatus(200);

      });

    });

};


var deletePost = function(req, res, next) {
  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .findOne({ _id: eventId })
    .populate('user')
    .exec(function(err, event) {
      if (err)
        return next(err);

      if (!event)
        return next({ message: 'Cannot find event' });

      if (event.user._id.toString() !== req.user._id)
        return next({ message: 'Only user who has created this event can delete it.' });


      async.parallel([

        function(done) {
          Comments.remove({
            eventId: eventId,
            type: type
          }, function(err) {
            console.log(err);
            return done();
          });
        },


        function(done) {
          model.remove({ _id: eventId }, function(err) {
            console.log(err);
            return done();
          });
        }

      ], function() {
        res.sendStatus(200);
      });


    });
};


var report = function(req, res, next) {

  var user = req.user;
  var type = req.params.type;
  var eventId = req.params.eventId;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .findOne({ _id: eventId })
    .exec(function(err, event) {

      if (err)
        return next(err);

      if (!event)
        return next({ message: 'Cannot find event' });

      var index = event.reports.indexOf(user._id);

      if (index >= 0)
        event.reports.splice(index, 1);
      else
        event.reports.push(user._id);

      model.update({ _id: event._id }, { reports: event.reports }, function(err) {
        if (err)
          return next(err);

        res.sendStatus(200);
      });

    });

};


var favorite = function(req, res, next) {

  var user = req.user;
  var type = req.params.type;
  var eventId = req.params.eventId;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .findOne({ _id: eventId })
    .exec(function(err, event) {

      if (err)
        return next(err);

      if (!event)
        return next({ message: 'Cannot find event' });

      var index = event.favorites.indexOf(user._id);

      if (index >= 0)
        event.favorites.splice(index, 1);
      else
        event.favorites.push(user._id);

      model.update({ _id: event._id }, { favorites: event.favorites }, function(err) {
        if (err)
          return next(err);

        res.sendStatus(200);
      });

    });

};


module.exports = {
  getPost: getPost,
  deletePost: deletePost,
  join: join,
  report: report,
  favorite: favorite,
  close: close
};
