app
  .directive('menus', function() {
    return {
      templateUrl: '/menus/views/menus.html',
      controller: 'MenusCtrl as ctrl'
    };
  });
