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

      $scope.thisFood.ndbno = $routeParams.ndbno;
    }
  })

})

.controller('displayController', function($routeParams, $scope, Foods){ 
  $scope.searchItems = [];

  Foods.displayFoods($routeParams.newFood).success(function(data, status, headers, config){
    console.log('data.list.item', data.list.item)
    if (data['errors']) {
      $scope.searchItems = [{name:'No Results'}]
    } else $scope.searchItems = data.list.item;
  })

  //allowing the 'saveFood()' on ng-click
  $scope.saveFood = Foods.saveFood; 
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
      // console.log('Success in saveFood:', data)
      $location.path("/profile");
    })
  }

  return {
    showFoodInfo: showFoodInfo, 
    displayFoods: displayFoods,
    saveFood: saveFood
  }
})


