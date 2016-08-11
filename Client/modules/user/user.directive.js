app
  .directive('eventProfile', function() {

    return {
      templateUrl: '/user/views/event.directive.html'
    };

  })
  .directive('eventJoinProfile', function() {

    return {

      templateUrl: '/user/views/eventJoin.directive.html'

    };

  })
  .directive('eventFavoriteProfile', function() {

    return {

      templateUrl: '/user/views/eventFavorite.directive.html'

    };

  });
