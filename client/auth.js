angular.module('app')

.controller('loginController', function($scope, Auth){ 

  $scope.login = function () {
    var email = $scope.email,
        pw = $scope.password;

    Auth.login(email, pw);
  };

  $scope.signup = function () {
    var email = $scope.email,
        pw = $scope.password;

    Auth.signup(email, pw);
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
      localStorage.setItem('email', data.email);
      // console.log('Success in signup')
      localStorage.setItem('token', data.token);
      $location.path('/home'); 
    })
  };

  var login = function (email, pw) {
    return $http.get('/login', {
      params: {email: email, password: pw}
    })
    .success(function(data, status, headers, config){
      localStorage.setItem('email', data.email);
      // console.log('Success in login', data);
      localStorage.setItem('token', data.token);
      $location.path('/home'); 

    })
  };

  var logout = function(){
    console.log('loggingout')
    //remove from local storage && redirect to login page
    localStorage.removeItem('token'); 
    localStorage.removeItem('email'); 
  }

  return {
    signup: signup,
    login: login,
    logout: logout
  }
})

