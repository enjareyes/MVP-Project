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
    .otherwise({
      redirectTo: '/login'
    })
})

.run(function($rootScope, $location, globalAuth){
  $rootScope.$on('$routeChangeStart', function(event, next){
    $rootScope.path = $location.path();
    $rootScope.authenticate = globalAuth.checkAuth();
    var loggedIn = globalAuth.checkAuth();
    console.log(loggedIn)

    if(!loggedIn && next.$$route.authenticate){
      console.log('!loggedin')
      $location.path('/login');
    } else if(loggedIn && $location.path() === '/home'){
      console.log('loggedin')
      $location.path('/home'); 
    }else if(loggedIn && $location.path() === '/search:newFood'){
      console.log('loggedin')
      $location.path('/search:newFood'); 
    }else if(loggedIn && $location.path() === '/nutrition/:ndbno'){
      console.log('loggedin')
      $location.path('/nutrition/:ndbno'); 
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


.controller('nutritionalController', function($scope, Foods, $routeParams){ 
  $scope.thisFood = {}

  Foods.showFoodInfo($routeParams.ndbno).success(function(data){
    var nutrients = data.report.food.nutrients //array of objects
    
    for (var i = 0; i < nutrients.length; i++){
      var current = nutrients[i]
      $scope.thisFood.measures = current.measures[0].qty +" "+ current.measures[0].label
      $scope.thisFood.fooditem = data.report.food.name
      
      if (current.name === 'Energy'){
        $scope.thisFood.calories = current.value + current.unit
      }
      if (nutrients[i].name === 'Total lipid (fat)'){
        $scope.thisFood.fat = current.value + current.unit
      } 
      if (nutrients[i].name === 'Sugars, total'){
        $scope.thisFood.sugar = current.value + current.unit
      } 
      if (nutrients[i].name === 'Protein'){
        $scope.thisFood.protein = current.value + current.unit
      }    
      if (nutrients[i].name === 'Carbohydrate, by difference'){
        $scope.thisFood.carbs = current.value + current.unit
      }   
      if (nutrients[i].name === 'Fiber, total dietary'){
        $scope.thisFood.fiber = current.value + current.unit
      }
    }
  })
})


.controller('displayController', function($routeParams, $scope, Foods){ 
  $scope.searchItems = [];
  console.log($routeParams.newFood);
  Foods.displayFoods($routeParams.newFood).success(function(data, status, headers, config){
    // console.log('data.list.item', data.list.item)
    $scope.searchItems = data.list.item;
    console.log($scope.searchItems);
  })
})


.factory('Foods', function($http){
  //will displayfood items that have same name as users search
  var displayFoods = function(foodName){ 
    return $http.get('/searchfood', {
      params: {food: foodName}
    })
    .success(function(data, status, headers, config){
      console.log('Success in displayFoods')
      return data
    })
  }

  //after they've selected food item, will display nutritional info
  var showFoodInfo = function(ndbno) { 
    return $http.get('/foodinfo', {
      params: {ndbno: ndbno}
    })
    .success(function(data, status, headers, config){
      console.log('Success in displayFoods')
      return data
    })
  };

  return {
    showFoodInfo: showFoodInfo, 
    displayFoods: displayFoods 
  }
})


.controller('loginController', function($scope, Auth){ 

  $scope.login = function () {
    var email = $scope.email,
        pw = $scope.password;

    Auth.login(email, pw);

    //only redirect if user token is there.
  };

  $scope.signup = function () {
    var email = $scope.email,
        pw = $scope.password;

    Auth.signup(email, pw);

    //only redirect if user token is there.
  };

  $scope.logout = function(){
    Auth.logout();
  }

})


.factory('Auth', function($http, $location){

  var signup = function (email, pw) {
    return $http.get('/signup', {
      params: {email: email, password: pw}
    })
    .success(function(data, status, headers, config){
      console.log('Success in signup')
      localStorage.setItem('token', data.token);
      $location.path('/home'); 
    })
  };

  var login = function (email, pw) {
    return $http.get('/login', {
      params: {email: email, password: pw}
    })
    .success(function(data, status, headers, config){
      console.log('Success in login', data);
      localStorage.setItem('token', data.token);
      $location.path('/home'); 

    })
  };

  var logout = function(){
    console.log('loggingout')
    //remove from local storage && redirect to login page
    localStorage.removeItem('token'); 
  }

  return {
    signup: signup,
    login: login,
    logout: logout
  }
})





