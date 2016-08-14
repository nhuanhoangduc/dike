var Comments = require('../models/comments');
var Travels = require('../models/travels');
var Studies = require('../models/study');
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

    case 'study':
      model = Studies;
      break;
  }

  return model;

};


// get all comments with type of event and event id
var getAll = function(req, res, next) {

  var type = req.params.type;
  var id = req.params.eventid;


  Comments
    .find({ eventId: id, type: type, join: false })
    .populate('user')
    .sort({ 'created': 1 })
    .lean()
    .exec(function(err, comments) {

      if (err)
        return next(err);

      res.json(comments);

    });

};


// get all comments user has joint
var getAllJoin = function(req, res, next) {

  var type = req.params.type;
  var id = req.params.eventid;


  Comments
    .find({ eventId: id, type: type, join: true })
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
              facebook.createNotification(user.facebookId, template, 'http://www.google.vn', function() {
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


var remove = function(req, res, next) {

  Comments
    .findOne({ _id: req.params.id })
    .lean()
    .exec(function(err, comment) {

      if (err)
        return next(err);

      if (!comment)
        return next({ message: 'Cannot find this comment' });

      if (req.user._id.toString() !== comment.user.toString())
        return next({ message: 'Only user who posted this comment can delete it' });

      Comments.remove({ _id: req.params.id }, function(err) {

        if (err)
          return next(err);

        res.sendStatus(200);

      });

    });
};


var getByUser = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  Comments
    .find({ user: userId })
    .lean()
    .exec(function(err, comments) {

      if (err)
        return next(err);

      res.json(comments);

    });
};


var getByUserCount = function(req, res, next) {

  var user = req.user;
  var userId = user._id;

  Comments
    .count({ user: userId })
    .lean()
    .exec(function(err, count) {

      if (err)
        return next(err);

      res.json(count);

    });

};


module.exports = {
  create: create,
  getAll: getAll,
  remove: remove,
  getByUser: getByUser,
  getByUserCount: getByUserCount,
  getAllJoin: getAllJoin
};
