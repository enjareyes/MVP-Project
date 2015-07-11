//Enja's super awesome radical nutritional information app.
angular.module('app', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'landing.html',
      controller: 'loginController',
      authenticate: false
    })    
    .when('/signup', {
      templateUrl: 'signup.html',
      controller: 'loginController',
      authenticate: false
    })
    .when('/home', {
      templateUrl: 'home.html',
      controller: 'loginController',
      authenticate: true
    })
    .when('/search/:newFood', {
      templateUrl: 'list-view.html',
      controller: 'displayController',
      authenticate: true
    })
    .when('/nutrition/:ndbno', {
      templateUrl: 'nutritional-info.html',
      controller: 'nutritionalController',
      authenticate: true
    })     
    .when('/profile', {
      templateUrl: 'profile.html',
      controller: 'profileController',
      authenticate: true
    })        
    .otherwise({
      redirectTo: '/login'
    })
})

.run(function($rootScope, $location, globalAuth){
  $rootScope.$on('$routeChangeStart', function(event, next){
    $rootScope.path = $location.path();
    $rootScope.authenticate = globalAuth.checkAuth();
    var loggedIn = globalAuth.checkAuth();
    // console.log(loggedIn)

    if(!loggedIn && next.$$route.authenticate){
      console.log('!loggedin')
      $location.path('/login');
    } else if(loggedIn && $location.path() === '/home'){
      $location.path('/home'); 
    }else if(loggedIn && $location.path() === '/search:newFood'){
      $location.path('/search:newFood'); 
    }else if(loggedIn && $location.path() === '/nutrition/:ndbno'){
      $location.path('/nutrition/:ndbno'); 
    }else if(loggedIn && $location.path() === '/profile'){
      $location.path('/profile'); 
    }
  });
})

.factory('globalAuth', function(){

  var checkAuth = function(){
    //if token exists return true
    console.log('checkauth',localStorage.getItem('token'))
    return (!!localStorage.getItem('token'))  
  };

  return { checkAuth: checkAuth};
})



