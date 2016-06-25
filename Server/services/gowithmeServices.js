var GoWithMe = require('../models/goWithMe');


/* create new */
var create = function(req, res, next) {
  var event = req.body;

  if (!event.startTime || !event.cost)
    return next('Null value');

  event.user = req.session.passport.user._id;
  event.created = new Date();

  if (event.typeOfUser === 'customer') { // customer
    delete event.freeSeats;
    delete event.vehicle;
  } else { // driver

    if (!event.freeSeats || !event.vehicle)
      return next('Null value');

  }

  GoWithMe.create(event, function(err, event) {
    if (err)
      return next(err);

    return res.json(event);
  });
};



module.exports = {
  create: create
};
