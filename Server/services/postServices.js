var GoWithMe = require('../models/goWithMe');


var getPost = function(req, res, next) {
  var model = null;
  var type = req.params.type;
  var eventId = req.params.eventId;

  if (type === 'gowithme')
    model = GoWithMe;

  if (!model)
    return next({ message: 'Type is incorrect' });

  model
    .findOne({ _id: eventId })
    .populate('user')
    .exec(function(err, event) {
      if (err)
        return next(err);

      res.send(event);
    });
};


module.exports = {
  getPost: getPost
};
