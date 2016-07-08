var config = require('./OAuth/oauth');

var Facebook = require('facebook-node-sdk');
var facebook = new Facebook({ appID: config.facebook.id, secret: config.facebook.secret });

/* create notification */
var createNotification = function(facebookId, template, href, done) {
  facebook.api('/' + facebookId + '/notifications',
    'post', {
      access_token: config.facebook.token,
      template: template,
      href: href
    },
    function(err, response) {
      return done(err, response);
    });
};

/* post a notification to user's facebook account */
var facebookNotification = function(req, res, next) {
  var user = req.session.passport.user;
  createNotification(user.facebookId, 'Nhuan', '/', function(err, response) {
    if (err)
      return next(err);

    res.send(response);
  });
};

module.exports = {
  facebookNotification: facebookNotification,
  createNotification: createNotification
};
