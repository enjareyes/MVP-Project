angular.module('app')

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

  Foods.displayFoods($routeParams.newFood).success(function(data, status, headers, config){
    // console.log('data.list.item', data.list.item)
    $scope.searchItems = data.list.item;
  })

  //allowing the 'saveFood()' on ng-click
  $scope.saveFood = Foods.saveFood; 
})


.controller('profileController', function($scope, Foods){
  $scope.favorites = [];

  //call Foods.getFavorites and access saved data
  Foods.getFavorites().success(function(data, status, headers, config){
    //save data to $scope.favorites to display on profile page
    $scope.favorites = data.food;
    console.log('favs', $scope.favorites)
  })
})

.factory('Foods', function($http, $location){
  var foodInfo = {};

  //will displayfood items that have same name as users search
  var displayFoods = function(foodName){ 
    return $http.get('/searchfood', {
      params: {food: foodName}
    })
    .success(function(data, status, headers, config){
      // console.log('Success in displayFoods')
      return data
    })
  }

  //after they've selected food item, will display nutritional info
  var showFoodInfo = function(ndbno) { 
    return $http.get('/foodinfo', {
      params: {ndbno: ndbno}
    })
    .success(function(data, status, headers, config){
      return data
    })
  };

  var saveFood = function(foodObj){
    foodObj['email'] = localStorage.getItem('email')

    //send saved food to server to save in DB
    return $http.get('/savefood', {
      params: foodObj 
    })
    .success(function(data, status, headers, config){
      console.log('Success in saveFood:', data)
      $location.path("/profile");
    })
  }

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

  return {
    showFoodInfo: showFoodInfo, 
    displayFoods: displayFoods,
    saveFood: saveFood,
    getFavorites: getFavorites
  }
})


