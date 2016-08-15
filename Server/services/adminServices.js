var Travels = require('../models/travels');
var Studies = require('../models/study');
var Users = require('../models/users');


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

var getEvents = function(req, res, next) {

  var type = req.params.type;
  var model = getModel(type);
  var query = req.body.query;
  var sort = req.body.sort;
  var populate = req.body.populate;

  if (!model)
    return next({ message: 'Invalid event type' });

  model
    .find(query)
    .lean()
    .populate(populate)
    .sort(sort)
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
    .update({ _id: id }, { status: 'blocked' }, function(err) {

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
    .update({ _id: id }, { status: 'available' }, function(err) {

      if (err)
        return next(err);

      res.sendStatus(200);

    });

};
/* events */


/* user */

var userAutoComplete = function(req, res, next) {

  var name = req.params.name || '';

  Users
    .find({ $text: { $search: name } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .exec(function(err, users) {

      if (err)
        return next(err);

      res.json(users);

    });

};

var getUsers = function(req, res, next) {

  Users
    .find({ disable: false })
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
  unBlockEvent: unBlockEvent,
  blockEvent: blockEvent,

  getUsers: getUsers,
  getBlockedUsers: getBlockedUsers,
  unBlockUser: unBlockUser,
  blockUser: blockUser,
  userAutoComplete: userAutoComplete
};
