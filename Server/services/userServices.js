var loger = require('./loger');
var jwt = require('json-web-token');
var webTokenConfig = require('../configs/webToken');
var Users = require('../models/users');


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


var checkAdmin = function(req, res, next) {

  if (req.session.passport && req.session.passport.user && req.session.passport.user.isAdmin) {
    req.user = req.session.passport.user;
    return next();
  } else {
    return next({ status: 401, message: 'User has not logged' });
  }

};


var logout = function(req, res, next) {
  req.session.destroy();
  res.sendStatus(200);
};


var update = function(req, res, next) {
  console.log(req.body);
  if (req.user._id !== req.body._id)
    return next({ message: 'Undefined user' });

  Users.update({ _id: req.body._id }, req.body, function(err) {
    if (err)
      return next(err);

    req.session.passport.user = req.body;
    res.sendStatus(200);
  });
};


module.exports = {
  getCurrentUser: getCurrentUser,
  checkLogin: checkLogin,
  logout: logout,
  update: update,
  checkAdmin: checkAdmin
};
