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
    .state('gowithme_edit', { // go with me edit
      url: '/gowithme/edit/:id',
      templateUrl: '/gowithme/views/gowithme_create.html',
      controller: 'goWithMeCreateCtrl as ctrl'
    })
    .state('gowithme_search', { // go with me search
      url: "/gowithme/search?id",
      templateUrl: '/gowithme/views/gowithme_search.html',
      controller: 'goWithMeSearchCtrl as ctrl'
    })
    .state('user', { // user profile
      url: "/user",
      templateUrl: '/user/views/user.html',
      controller: 'userController as ctrl'
    })
    .state('post', { // view a event post
      url: "/post/:type/:eventId",
      templateUrl: '/post/views/post.html',
      controller: 'postController as ctrl'
    });
});
