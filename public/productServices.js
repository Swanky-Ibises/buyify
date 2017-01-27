angular.module("productServices", [])
  .factory("getProducts", ["$http", function($http) {
    var getProducts = function() {
      return $http({
        method: 'GET',
        url: 'http://localhost:3000/products'
      }).then(function successCallback(response) {
        console.log('response', response);
        return response.data;
      }, function errorCallback(response) {
        console.log('error', response);
      });
    };
    return {
      getProducts: getProducts
    };
  }]);
