app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states

  /* home page */
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: '/home/views/home.html',
    })
});
