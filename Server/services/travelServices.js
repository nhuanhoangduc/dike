var Travels = require('../models/travels');


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
var getById = function(req, res, next) {
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



module.exports = {
  create: create,
  update: update,
  getById: getById
};
