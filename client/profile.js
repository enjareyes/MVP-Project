angular.module('app')

.controller('profileController', function($scope, Profile, $window){
  $scope.favorites = [];

  //call Profile.getFavorites and access saved data
  Profile.getFavorites().success(function(data, status, headers, config){
    //save data to $scope.favorites to display on profile page
    $scope.favorites = data.food;
  })

  $scope.remove = function(food){
    Profile.remove(food.ndbno);
  }

  $scope.reloadRoute = function() {
    $window.location.reload();
  }
})


.factory('Profile', function($http){

  var getFavorites = function(){
    var email = localStorage.getItem('email')
    return $http.get('/getFavorites', {
      params: {email: email}
    })
    .success(function(data, status, headers, config){
      // console.log('Success in getFavorites:')
      return data;
    })
  }

  var remove = function(id){
    console.log('removing',id);
    var email = localStorage.getItem('email')

    return $http.get('/removeFavorite', {
      params: {email: email, id: id}
    })
    .success(function(data, status, headers, config){
      console.log('Success in removefood')
      // $location.path("/profile");
    })
  }

  return {
    getFavorites: getFavorites,
    remove: remove
  }

})