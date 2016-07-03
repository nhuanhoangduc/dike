app
  .service('postServices', function(restfulServices) {

    var services = {

      // get event's information
      getEvent: function(type, eventId, done) {
        restfulServices.get('/post', [type, eventId], function(err, response) {
          return done(err, response);
        });
      },


    };

    // set services
    return services;

  });
