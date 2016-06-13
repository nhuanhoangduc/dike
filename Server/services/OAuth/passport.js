var passport = require('passport');
var config = require('./oauth');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/users');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// config local user
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username);

    return done(null, { id: '123' });
  }
));

// config facebook 
passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'name', 'picture.type(large)', 'displayName', 'about', 'gender'],
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ facebookId: profile.id }, function(err, user) {
      if (err)
        return done(err);

      if (!user) {
        var user = {
          facebookId: profile.id,
          name: profile.name.familyName + ' ' + (profile.name.middleName ? profile.name.middleName + ' ' : '') + profile.name.givenName,
          gender: profile.gender,
          image: profile.photos[0].value
        };

        User.create(user, function(err, user) {
          if (err)
            return done(err);

          return done(null, user);
        });

      } else {

        return done(null, user);
      }
    });
  }
));

module.exports = passport;
