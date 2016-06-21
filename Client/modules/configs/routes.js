app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('home', { // home
      url: "/",
      templateUrl: '/home/views/home.html',
    })
    .state('gowithme_create', { // go with me event
      url: "/gowithme/create",
      templateUrl: '/gowithme/views/gowithmecreate.html',
      controller: 'goWithMeCreateCtrl as ctrl'
    });
});
