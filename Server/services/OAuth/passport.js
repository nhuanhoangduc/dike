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

        var newUser = {
          facebookId: profile.id,
          name: profile.name.familyName + ' ' + (profile.name.middleName ? profile.name.middleName + ' ' : '') + profile.name.givenName,
          gender: profile.gender,
          image: profile.photos[0].value,
          accessToken: accessToken,
        };

        if (!user) {
          newUser.created = new Date();
          User.create(newUser, function(err, newUser) {
            if (err)
              return done(err);

            return done(null, newUser);
          });
        } else {
          newUser.phone = user.phone;
          newUser.status = user.status;
          newUser.location = user.location;

          User.update({ _id: user._id }, newUser, function(err) {
            if (err)
              return done(err);

            newUser._id = user._id;
            return done(null, newUser);
          });
        }
      });
    });
  }
));

module.exports = passport;
