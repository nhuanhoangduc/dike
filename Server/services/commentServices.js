var Comments = require('../models/comments');
var Travels = require('../models/travels');
var Users = require('../models/users');

var facebook = require('../services/facebookServices');
var async = require('async');


// get model event depend type of event
var getModelEvent = function(type) {
  var model = null;

  switch (type) {
    case 'travel':
      model = Travels;
      break;
  }

  return model;
};


// get all comments with type of event and event id
var getAll = function(req, res, next) {
  var type = req.params.type;
  var id = req.params.eventid;


  Comments
    .find({ eventId: id, type: type })
    .populate('user')
    .sort({ 'created': -1 })
    .lean()
    .exec(function(err, comments) {
      if (err)
        return next(err);

      res.json(comments);
    });
};


// create new event with type of event and event id
var create = function(req, res, next) {
  var params = req.body;
  var event = getModelEvent(params.type);


  Comments.create(params, function(err, comment) {
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
        Users
          .find({ _id: { $in: commentUsers } })
          .lean()
          .exec(function(err, users) {
            if (err)
              return cb(err);

            async.each(users, function(user, nextUser) {
              if (user._id.toString() === params.user.toString())
                return;

              var template = params.name + ' has comment in the post';
              facebook.createNotification(user.facebookId, template, '/', function() {
                return nextUser();
              });
            });
          });
      }

    ], function() {
      console.log('done');
    });


    res.json(comment);
  });
};


module.exports = {
  create: create,
  getAll: getAll
};
