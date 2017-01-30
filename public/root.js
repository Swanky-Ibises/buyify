var root = angular.module("root", ["productServices", "ui.router"])
  .controller("productsController", ["$scope", "getProducts", function($scope, getProducts) {

    getProducts.getProducts().then(function(products) {
      // console.log('product data', products);
      $scope.products = products;
      return products;
    });

    // console.log('scope products', $scope.products);

    $scope.addToCart = function(product, price, imageurl) {
      if (!localStorage.getItem('CART')) {
        localStorage.setItem('CART', product + "|" + price + "|" + imageurl);
      } else {
        localStorage.setItem('CART', localStorage.getItem('CART') + "," + product + "|" + price + "|" + imageurl);
      }
    };

  }]).controller("checkoutController", ["$scope", function($scope) {

    // console.log('items in cart', localStorage.getItem('CART'));

    $scope.checkoutInfo = {
      "imageURLS": [],
      "itemTotal": 0,
      "itemCount": 0
    };

    if (localStorage.getItem('CART')) {
      localStorage.getItem('CART').split(',').forEach(function(item, idx) {
        $scope.checkoutInfo["imageURLS"].push(item.split("|")[2]);
        $scope.checkoutInfo["itemTotal"] += +item.split("|")[1];
        $scope.checkoutInfo["itemCount"] += 1;
      });
    }

    $scope.BuyItems = function() {
      alert('Thanks For Your Patronage!');
      localStorage.removeItem('CART');
    };

    // console.log('checkoutInfo', $scope.checkoutInfo);
    // console.log('checkoutInfo Image URLS', $scope.checkoutInfo.imageURLS);

  }]).config(function($stateProvider) {

    var productState = {
      name: 'products',
      url: '/products',
      controller: 'productsController'
    };

    var checkoutState = {
      name: 'checkout',
      url: '/checkout',
      template: `<div class="row center-align" ng-controller="checkoutController"><div ng-hide="{{checkoutInfo.itemCount.length === 0}}" class="ng-hide">
        <ul class="collection" ng-repeat="image in checkoutInfo.imageURLS track by $index"><li><img class="productImg" ng-src="{{ image }}" /></li></ul>
        <ul><li>Item Count: {{ checkoutInfo.itemCount }}</li><li>Order Total: {{ checkoutInfo.itemTotal | currency:"$"}}</li></ul><div><a ng-click="BuyItems()" class="waves-effect waves-light btn-large">Buy</a></div></div></div>`,
      controller: 'checkoutController'
    };

    $stateProvider.state(productState);
    $stateProvider.state(checkoutState);
  });
