var config = require('../configs/webToken');

var verifyToken = function(req, res, next) {
  process.nextTick(function() {
    var token = req.body.token | req.params.token;

    jwt.decode(config, token, function(err, decode) {
      if (err) {
        return next(err);
      } else {
        return next();
      }
    });
  });
};

module.exports = {
  verifyToken: verifyToken
};
