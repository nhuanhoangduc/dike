var Travels = require('../models/travels');
var Comments = require('../models/comments');
var async = require('async');


var getPost = function(req, res, next) {
  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;

  if (type === 'travel')
    model = Travels;

  if (!model)
    return next({ message: 'Type is incorrect' });

  model
    .findOne({ _id: eventId })
    .populate('user')
    .exec(function(err, event) {
      if (err)
        return next(err);

      res.json(event);
    });
};


var join = function(req, res, next) {

  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;
  var user = req.user;

  if (type === 'travel')
    model = Travels;

  if (!model)
    return next({ message: 'Type is incorrect' });

  model
    .findOne({ _id: eventId })
    .populate('user')
    .exec(function(err, event) {

      if (err)
        return next(err);

      var index = event.join.indexOf(user._id);

      if (index >= 0)
        event.join.splice(index, 1);
      else
        event.join.push(user._id);

      model.update({ _id: event._id }, { join: event.join }, function(err) {
        if (err)
          return next(err);

        res.sendStatus(200);
      });

    });

};


var deletePost = function(req, res, next) {
  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;

  if (type === 'travel')
    model = Travels;

  if (!model)
    return next({ message: 'Type is incorrect' });

  model
    .findOne({ _id: eventId })
    .populate('user')
    .exec(function(err, event) {
      if (err)
        return next(err);

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


module.exports = {
  getPost: getPost,
  deletePost: deletePost,
  join: join
};
