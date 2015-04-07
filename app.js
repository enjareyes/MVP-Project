//Enja's super awesome radical nutritional information app.
angular.module('app', [])

// Using Angular. Yup, just Angular. No server, bro.
// .config(function($routeProvider, $httpProvider) {
//   $routeProvider
//     .when('/searchresults', {
//       templateUrl: 'list-view.html',
//       controller: 'MainController'
//     })
//     .when('/nutrition', {
//       templateUrl: 'nutritional-info.html',
//       controller: 'MainController'
//     })
//     .otherwise({
//       redirectTo: '/'
//     });
// })

.controller('MainController', function($scope, Foods){
  
  $scope.displayFoods = function(foodName){ 
    Foods.displayFoods(foodName).success(function(data, status, headers, config){
      $scope.searchItems = data.list.item;
      console.log($scope.searchItems); 
    })
  }

  $scope.click = false;
  $scope.checkClick = function(){
    if ($scope.click === false) {
      $scope.click = true;
    } else {
      $scope.click= false;
    }
    return $scope.click;
  }

  $scope.showFoodInfo = function(ndbno){
    Foods.showFoodInfo(ndbno).success(function(data, status, headers, config){
      var nutrients = data.report.food.nutrients //array of objects
      console.log(nutrients)
      $scope.thisFood = {}

      for (var i = 0; i <nutrients.length; i++){
        var current = nutrients[i]
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
  }
})

.factory('Foods', function($http){

  var searchItems = []; //array of objects containing food item/info

  //will displayfood items that have same name as users search
  var displayFoods = function(foodName){ 
    return $http.get('http://api.nal.usda.gov/usda/ndb/search/?format=json&q=' + foodName + '&sort=n&max=25&offset=0&api_key=kKJ078H1u9KjuD4DLAJK3nPUgFX4SoN2awG94IeR')
  }

  //after they've selected food item, will display nutritional info
  var showFoodInfo = function(ndbno) { 
    return $http.get('http://api.nal.usda.gov/usda/ndb/reports/?ndbno=' + ndbno +'&type=b&format=json&api_key=kKJ078H1u9KjuD4DLAJK3nPUgFX4SoN2awG94IeR')
  };



  return {showFoodInfo: showFoodInfo, 
    displayFoods: displayFoods, 
    searchItems: searchItems,
  }
})

//In order for our service to get the proper information for the desired food, we must first locate the ndbno number of the food item.
//NOTE: The ndbno number is a number that each food item in the USDA database is assigned. Think of it as a PLU code for each item in the supermarket.



//To accomplish this, we must search on the usda api for a list of food items that have a name equal to (or similar to) the user's search.
//This call will return a list of items that match the search term 'butter'

//We will display these results to the user and allow them to select the proper item they are searching for.
//Upon selection, we will make another call to the USDA api with the specfied ndbno number to get all of the nutritional information.

//Call 1:
// Replace {butter} in the URL with the user's search term
//http://api.nal.usda.gov/usda/ndb/search/?format=json&q={butter}&sort=n&max=25&offset=0&api_key=DEMO_KEY 

//Call 2:
//Replace {11987} with the ndbno number of the food the user wants nutritional information on.
//http://api.nal.usda.gov/usda/ndb/reports/?ndbno={11987}&type=b&format=fjson&api_key=DEMO_KEY
