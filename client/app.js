//Enja's super awesome radical nutritional information app.
angular.module('app', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'landing.html',
      // controller: 'loginController'
    })    
    .when('/signup', {
      templateUrl: 'signup.html',
      // controller: 'loginController'
    })
    .when('/home', {
      templateUrl: 'home.html'
    })
    .when('/search/:newFood', {
      templateUrl: 'list-view.html',
      controller: 'displayController'
    })
    .when('/nutrition/:ndbno', {
      templateUrl: 'nutritional-info.html',
      controller: 'nutritionalController'
    })        
    .otherwise({
      redirectTo: '/login'
    });
})


.controller('nutritionalController', function($scope, Foods, $routeParams){ 
  $scope.thisFood = {}

  Foods.showFoodInfo($routeParams.ndbno).success(function(data){
    var nutrients = data.report.food.nutrients //array of objects
    
    for (var i = 0; i <nutrients.length; i++){
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


.controller('loginController', function($scope, $routeParams){ 

})



