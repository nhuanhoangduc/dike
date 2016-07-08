var Travel = require('../models/travels');


/* create new */
var create = function(req, res, next) {
  var event = req.body;

  if (!event.startTime || !event.cost)
    return next({ message: 'Null value' });

  event.user = req.session.passport.user._id;
  event.created = new Date();
  event.commentUsers = [{ userId: req.session.passport.user._id, facebookId: req.session.passport.user.facebookId }];

  if (event.typeOfUser === 'customer') { // customer
    delete event.freeSeats;
    delete event.vehicle;
  } else { // driver

    if (!event.freeSeats || !event.vehicle)
      return next({ message: 'Null value' });

  }

  Travel.create(event, function(err, event) {
    if (err)
      return next(err);

    return res.json(event);
  });
};



module.exports = {
  create: create
};
