var passport = require('passport');
var config = require('./oauth');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/users');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  process.nextTick(function() {
    return done(null, user);
  });
});
passport.deserializeUser(function(obj, done) {
  process.nextTick(function() {
    return done(null, obj);
  });
});

// config facebook 
passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'name', 'picture.type(large)', 'displayName', 'about', 'gender'],
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return User.findOne({ facebookId: profile.id }, function(err, user) {
        if (err)
          return done(err);

        if (!user) {
          var newUser = {
            facebookId: profile.id,
            name: profile.name.familyName + ' ' + (profile.name.middleName ? profile.name.middleName + ' ' : '') + profile.name.givenName,
            gender: profile.gender,
            image: profile.photos[0].value,
            accessToken: accessToken
          };

          User.create(newUser, function(err, newUser) {
            if (err)
              return done(err);

            return done(null, newUser);
          });

        } else {

          return done(null, user);
        }
      });
    });
  }
));

module.exports = passport;
