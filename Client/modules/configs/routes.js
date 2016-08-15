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
      controller: 'HomeCtrl as ctrl'
    })
    .state('gowithme', { // go with me create
      url: "/gowithme?startLat&startLng&endLat&endLng&startRadius&endRadius",
      templateUrl: '/gowithme/views/gowithme.html',
      controller: 'GoWithMeCtrl as ctrl'
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
      url: "/user?menu&type",
      templateUrl: '/user/views/user.html',
      controller: 'userController as ctrl'
    })
    .state('post', { // view a event post
      url: "/post/:type/:eventId",
      templateUrl: '/post/views/post.html',
      controller: 'postController as ctrl'
    })
    .state('admin', { // admin home
      url: "/admin",
      templateUrl: '/admin/views/admin.html'
    })
    .state('admin_event', { // event management
      url: "/admin/event",
      templateUrl: '/admin/views/event.admin.html',
      controller: 'AdminEventCtrl as ctrl'
    })
    .state('admin_user', { // user management
      url: "/admin/user",
      templateUrl: '/admin/views/user.admin.html',
      controller: 'AdminUserCtrl as ctrl'
    })
    .state('study_list', { // study list all
      url: "/study",
      templateUrl: '/study/views/study.list.html',
      controller: 'StudyListCtrl as ctrl'
    })
    .state('study_edit', { // study list all
      url: "/study/edit?id",
      templateUrl: '/study/views/study.add.html',
      controller: 'StudyAddCtrl as ctrl'
    });
});
