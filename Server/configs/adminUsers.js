var Admins = require('../models/admins');
var async = require('async');
var error = null;


var listFacebookId = [
  '670461163095171'
];


async.each(listFacebookId, function(facebookId, nextId) {

  Admins
    .findOne({ facebookId: facebookId })
    .lean()
    .exec(function(err, user) {

      if (err) {
        error = err;
        return;
      }

      if (user)
        return nextId();

      Admins
        .create({ facebookId: facebookId }, function(err) {

          if (err) {
            error = err;
            return;
          }

          nextId();

        });

    });

}, function() {

  console.log("Loaded admin users");

});
