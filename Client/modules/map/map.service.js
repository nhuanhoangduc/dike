app
  .service('mapServices', function(restfulServices, leafletBoundsHelpers, leafletData, leafletMarkerEvents) {
    var bounds = leafletBoundsHelpers.createBoundsFromArray([
      [21.022693, 105.8019441],
      [21.022693, 105.81]
    ]);

    var services = {
      // change camera to this location
      center: {
        lat: 21.022693,
        lng: 105.8019441,
        zoom: 14
      },

      // google map layers
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

      // start and end marker
      markers: {
        start: {
          lat: 21.022693,
          lng: 105.8019441,
          focus: true,
          message: "Start point",
          draggable: true,
          radius: 1000,
          icon: {
            type: "awesomeMarker",
            icon: "home",
            markerColor: "green",
            prefix: 'fa',
            spin: true
          }
        },

        end: {
          lat: 21.022693,
          lng: 105.81,
          focus: true,
          message: "Finish point",
          draggable: true,
          radius: 1000,
          icon: {
            type: "awesomeMarker",
            icon: "home",
            markerColor: "cadetblue",
            prefix: 'fa',
            spin: true
          }
        }
      },

      // variable store shapes
      paths: {

      },

      // init bound variable
      bounds: bounds,
      map: {},

      // map events
      events: {
        markers: {
          enable: leafletMarkerEvents.getAvailableEvents(),
        }
      },

      // get all events
      getEvents: function() {
        return leafletMarkerEvents.getAvailableEvents();
      },

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

      // get place information from lat lng
      geoCode: function(lat, lng, callback) {
        restfulServices.get('/map/geocode', [lat, lng], function(err, response) {
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

    // init map
    // leafletData.getMap().then(function(map) {
    //   leafletData.getLayers().then(function(baselayers) {
    //     services.map = map;
    //   });
    // });



    return services;

  });
