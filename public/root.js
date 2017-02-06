var root = angular.module("root", ["productServices", "ui.router"])
  .controller("productsController", ["$scope", "getProducts", function($scope, getProducts) {

    //populating products from products endpoint.
    getProducts.getProducts().then(function(products) {
      // console.log('product data', products);
      $scope.products = products;
      return products;
    });

    // console.log('scope products', $scope.products);

    $scope.addToCart = function(product, price, imageurl) {

      //Using local storage to simulate an add to cart experience
      console.log('addToCart');
      if (!localStorage.getItem('CART')) {
        localStorage.setItem('CART', product + "|" + price + "|" + imageurl);
      } else {
        localStorage.setItem('CART', localStorage.getItem('CART') + "," + product + "|" + price + "|" + imageurl);
      }
      Materialize.toast('Added to Cart!', 1000);
    };

  }]).controller("checkoutController", ["$scope", function($scope) {

    //Using local storage to simulate a checkout experience

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

    //This routing is using UI router

    var productState = {
      name: 'products',
      url: '/products',
      controller: 'productsController'
    };

    var checkoutState = {
      name: 'checkout',
      url: '/checkout',
      template: `<div class="white" style="opacity:50%;"><div class="row center-align" ng-controller="checkoutController" style="padding:5px;"><div ng-hide="{{checkoutInfo.itemCount.length === 0}}" class="ng-hide"><br>
        Item Count: {{ checkoutInfo.itemCount }}<br>
        Order Total: {{ checkoutInfo.itemTotal | currency:"$"}}<br>
        <a ng-click="BuyItems()" class="waves-effect waves-light btn-large">Buy</a>
         <div ng-repeat="image in checkoutInfo.imageURLS track by $index"><div class="collection"><img class="productImg" ng-src="{{ image }}" /></div>
          </div>
        </div>`,
      controller: 'checkoutController'
    };

    $stateProvider.state(productState);
    $stateProvider.state(checkoutState);
  });