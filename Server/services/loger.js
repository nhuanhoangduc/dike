var Log = require('../models/logs');

var log = function(user, ip, url, action) {
  var date = new Date();

  Log.create({
    user: user,
    ip: ip,
    action: action,
    url: url,
    date: date
  }, function(err, log) {
    if (err)
      console.log('error');
  });
};

module.exports = {
  log: log
};
