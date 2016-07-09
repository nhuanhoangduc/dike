var TravelComments = require('../models/travelComments');
var Travels = require('../models/travels');
var Users = require('../models/users');

var facebook = require('../services/facebookServices');
var async = require('async');


var getModelComment = function(type) {
  var model = null;

  switch (type) {
    case 'travel':
      model = TravelComments;
      break;
  }

  return model;
}

var getModelEvent = function(type) {
  var model = null;

  switch (type) {
    case 'travel':
      model = Travels;
      break;
  }

  return model;
}

var getAll = function(req, res, next) {
  var type = req.params.type;
  var id = req.params.eventid;
  var model = getModelComment(type);

  if (!model)
    return next({ message: 'Invalid type' });

  model
    .find({ eventId: id })
    .populate('user')
    .exec(function(err, comments) {
      if (err)
        return next(err);

      res.send(comments);
    });
};


var create = function(req, res, next) {
  var params = req.body;
  var model = getModelComment(params.type);
  var event = getModelEvent(params.type);

  if (!model)
    return next({ message: 'Invalid type' });

  model.create(params, function(err, comment) {
    if (err)
      return next(err);

    async.waterfall([

      function(cb) {
        event.findOne({
          _id: params.eventId
        }, function(err, result) {
          if (err || !result)
            return cb(err);

          return cb(null, result);
        });
      },


      function(result, cb) {
        if (result.commentUsers.indexOf(params.user) >= 0)
          return cb(null, result.commentUsers);

        result.commentUsers.push(params.user);
        event.update({ _id: params.eventId }, { commentUsers: result.commentUsers }, function(err) {});
        cb(null, result.commentUsers);
      },

      function(commentUsers, cb) {
        Users.find({ _id: { $in: commentUsers } }, function(err, users) {
          if (err)
            return cb(err);

          async.each(users, function(user, nextUser) {
            var template = user.name + ' has comment in the post';
            facebook.createNotification(user.facebookId, template, '/', function() {
              return nextUser();
            });
          });
        });
      }

    ], function() {
      console.log('done');
    });


    res.send(comment);
  });
};


module.exports = {
  create: create,
  getAll: getAll
};
