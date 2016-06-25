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
    .state('gowithme_create', { // go with me create
      url: "/gowithme/create",
      templateUrl: '/gowithme/views/gowithme_create.html',
      controller: 'goWithMeCreateCtrl as ctrl'
    })
    .state('gowithme_search', { // go with me search
      url: "/gowithme/search",
      templateUrl: '/gowithme/views/gowithme_search.html',
      controller: 'goWithMeSearchCtrl as ctrl'
    });
});
