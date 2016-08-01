var Travels = require('../models/travels');
var Users = require('../models/users');


/* events */
var getModel = function(type) {

  var model = null;

  switch (type) {

    case 'travel':
      model = Travels;
      break;

  }

  return model;

};

var getEvents = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find({ disable: false })
    .lean()
    .populate('user')
    .sort({ created: -1 })
    .exec(function(err, events) {

      if (err)
        return next(err);

      return res.json(events);

    });

};


var getReportedEvents = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find()
    .lean()
    .populate('user')
    .sort({ reports: -1 })
    .exec(function(err, events) {

      if (err)
        return next(err);

      return res.json(events);

    });

};


var getDisabledEvents = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find({ disable: true })
    .lean()
    .populate('user')
    .sort({ created: -1 })
    .exec(function(err, events) {

      if (err)
        return next(err);

      return res.json(events);

    });

};


var blockEvent = function(req, res, next) {

  var type = req.params.type;
  var id = req.params.id;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .update({ _id: id }, { disable: true }, function(err) {

      if (err)
        return next(err);

      res.sendStatus(200);

    });

};


var unBlockEvent = function(req, res, next) {

  var type = req.params.type;
  var id = req.params.id;
  var model = getModel(type);

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .update({ _id: id }, { disable: false }, function(err) {

      if (err)
        return next(err);

      res.sendStatus(200);

    });

};
/* events */


/* user */

var getUsers = function(req, res, next) {

  Users
    .find()
    .lean()
    .exec(function(err, users) {

      if (err)
        return next(err);

      res.json(users);

    });

};

var getBlockedUsers = function(req, res, next) {

  Users
    .find({ disable: true })
    .lean()
    .exec(function(err, users) {

      if (err)
        return next(err);

      res.json(users);

    });

};

var blockUser = function(req, res, next) {

  var userId = req.params.id;

  Users
    .update({ _id: userId }, { disable: true }, function(err) {

      if (err)
        return next(err);

      res.sendStatus(200);

    });

};

var unBlockUser = function(req, res, next) {

  var userId = req.params.id;

  Users
    .update({ _id: userId }, { disable: false }, function(err) {

      if (err)
        return next(err);

      res.sendStatus(200);

    });

};

/* user */



module.exports = {
  getEvents: getEvents,
  getReportedEvents: getReportedEvents,
  getDisabledEvents: getDisabledEvents,

  unBlockEvent: unBlockEvent,
  blockEvent: blockEvent,

  getUsers: getUsers,
  getBlockedUsers: getBlockedUsers,
  unBlockUser: unBlockUser,
  blockUser: blockUser
};
