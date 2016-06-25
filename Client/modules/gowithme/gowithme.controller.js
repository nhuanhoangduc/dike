app
  .controller('goWithMeCreateCtrl', function(mapServices, restfulServices, leafletData) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.request = {};

    this.autoComplete = function(place) {
      place = this.convertString(place);

      _this.map.autoComplete(place, function(err, response) {
        _this.places = response.data;
      });
    };

    this.convertString = function(str) {
      str = str.toLowerCase();

      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ  |ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ  |ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");

      return str;
    };

    this.placeSelected = function(marker) {
      _this.map.getLocation(marker.place.placeId, function(err, response) {
        var lat = response.data.lat;
        var lng = response.data.lng;

        marker.lat = lat;
        marker.lng = lng;

        // bound to markers
        _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);
      });
    };


    /* date picker popup */
    // date format
    this.dateFormat = 'dd-MM-yyyy';

    // user input
    this.altInputFormats = ['dd-MM-yyyy'];

    /* submit data */
    this.submit = function() {
      restfulServices.post('/gowithme', _this.request, function(err, response) {
        if (err)
          console.log(err);

        console.log(response);
      });
    };

  })
  .controller('goWithMeSearchCtrl', function(mapServices, restfulServices) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.request = {};

    this.autoComplete = function(place) {
      place = this.convertString(place);

      _this.map.autoComplete(place, function(err, response) {
        _this.places = response.data;
      });
    };

    this.convertString = function(str) {
      str = str.toLowerCase();

      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ  |ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ  |ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");

      return str;
    };

    this.placeSelected = function(marker) {
      _this.map.getLocation(marker.place.placeId, function(err, response) {
        var lat = response.data.lat;
        var lng = response.data.lng;

        marker.lat = lat;
        marker.lng = lng;

        // bound to markers
        _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);
      });
    };


    /* date picker popup */
    // date format
    this.dateFormat = 'dd-MM-yyyy';

    // user input
    this.altInputFormats = ['dd-MM-yyyy'];

    /* submit data */
    this.submit = function() {
      restfulServices.post('/gowithme', _this.request, function(err, response) {
        if (err)
          console.log(err);

        console.log(response);
      });
    };
  });
