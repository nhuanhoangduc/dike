app
  .service('postServices', function(restfulServices) {

    var services = {

      // get event's information
      getEvent: function(type, eventId, done) {
        restfulServices.get('/post', [type, eventId], function(err, response) {
          return done(err, response);
        });
      },


      // post new comment
      postComment: function(type, id, ownUserId, userId, facebookId, comment, done) {
        var params = {
          type: type,
          eventId: id,
          ownUser: ownUserId,
          user: userId,
          comment: comment,
          facebookId: facebookId,
          created: new Date()
        };

        restfulServices.post('/comments', params, function(err, response) {
          return done(err, response);
        });
      },


      // load all comments
      getComments: function(type, id, done) {
        var params = [type, id];
        restfulServices.get('/comments', params, function(err, response) {
          return done(err, response);
        });
      }


    };

    // set services
    return services;

  });
