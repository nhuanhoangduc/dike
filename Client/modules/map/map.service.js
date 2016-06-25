app
  .service('mapServices', function(restfulServices, leafletBoundsHelpers) {
    var bounds = leafletBoundsHelpers.createBoundsFromArray([
      [21.022693, 105.8019441],
      [21.022693, 105.81]
    ]);

    var services = {
      center: {
        lat: 21.022693,
        lng: 105.8019441,
        zoom: 14
      },

      layers: {
        baselayers: {
          googleRoadmap: {
            name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
          },
          googleTerrain: {
            name: 'Google Terrain',
            layerType: 'TERRAIN',
            type: 'google'
          },
          googleHybrid: {
            name: 'Google Hybrid',
            layerType: 'HYBRID',
            type: 'google'
          }
        }
      },

      markers: {
        start: {
          lat: 21.022693,
          lng: 105.8019441,
          focus: true,
          message: "Hey, drag me if you want",
          draggable: true
        },

        end: {
          lat: 21.022693,
          lng: 105.81,
          focus: true,
          message: "Hey, drag me if you want",
          draggable: true
        }
      },

      bounds: bounds,

      // auto complete
      autoComplete: function(place, callback) {
        restfulServices.get('/map/autocomplete', [place], function(err, response) {
          return callback(err, response);
        });
      },

      // get location from a place 
      getLocation: function(placeId, callback) {
        restfulServices.get('/map/getdetail', [placeId], function(err, response) {
          return callback(err, response);
        });
      },

      // bound to markers
      boundMarkers: function(start, end) {
        services.bounds.northEast = {
          lat: start.lat,
          lng: start.lng
        };

        services.bounds.southWest = {
          lat: end.lat,
          lng: end.lng
        };
      },

      // find path between two markers
      findPath: function(start, end) {

      }

    };

    return services;

  });
