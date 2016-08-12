app
  .directive('menus', function() {
    return {
      templateUrl: '/menus/views/menu.directive.html',
      controller: 'MenusCtrl as ctrl'
    };
  });
