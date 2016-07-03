var config = require('./OAuth/oauth');

var Facebook = require('facebook-node-sdk');
var facebook = new Facebook({ appID: config.facebook.id, secret: config.facebook.secret });

/* post a notification to user's facebook account */
var facebookNotification = function(req, res, next) {
  var user = req.session.passport.user;

  facebook.api('/' + user.facebookId + '/notifications',
    'post', {
      access_token: config.facebook.token,
      template: "Test phát nữa đi :v", // content
      href: '/'
    },
    function(err, response) {
      if (err)
        return next(err);

      res.send(response);
    });
};

module.exports = {
  facebookNotification: facebookNotification
};
