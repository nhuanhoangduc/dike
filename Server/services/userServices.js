var loger = require('./loger');
var jwt = require('json-web-token');
var webTokenConfig = require('../configs/webToken');

var getCurrentUser = function() {
  return function(req, res, next) {
    if (req.session.passport && req.session.passport.user) {
      process.nextTick(function() {

        loger.log(req.session.passport.user._id, req.ip, req.originalUrl, 'Get current user');

        var sessionId = req.session.id;
        jwt.encode(webTokenConfig.secretKey, { sessionId: sessionId }, function(err, token) {
          if (err) {
            return next(err);
          } else {
            var user = req.session.passport.user;
            user.token = token;
            res.json(user);
          }
        });

      });
    } else {
      process.nextTick(function() {
        res.json({});
      });
    }
  };
};

var checkLogin = function(req, res, next) {
  process.nextTick(function() {
    if (req.session.passport && req.session.passport.user) {
      req.user = req.session.passport.user;
      return next();
    } else {
      return next({ status: 401, message: 'User has not logged' });
    }
  });
};


module.exports = {
  getCurrentUser: getCurrentUser,
  checkLogin: checkLogin
};
