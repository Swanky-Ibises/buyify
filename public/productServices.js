angular.module("productServices", [])
  .factory("getProducts", ["$http", function($http) {
    var getProducts = function() {
      var envURL = location.href.indexOf('herokuapp') === -1 ? 'http://localhost:3000/products' : 'https://buyify.herokuapp.com/products';
      return $http({
        method: 'GET',
        url: envURL || 'http://localhost:3000/products'
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
