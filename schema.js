const fs = require('fs');
const mongoose = require('mongoose');

var connectionURL;

if (process.env.NODE_ENV === 'production') {
   connectionURL = "mongodb://heroku_8vct2c3b:atgojuljt0bf8lq8n041i3o9n4@ds137759.mlab.com:37759/heroku_8vct2c3b";
} else {
   connectionURL = "mongodb://localhost/buyifyData";
}

mongoose.connect(connectionURL);

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var orderSchema = mongoose.Schema({
  orderId: Number,
  orderTotal: Number,
  orderQTY: Number
});

var productSchema = mongoose.Schema({
  productId: Number,
  name: String,
  ImageURL: String,
  Price: Number
});

var userModel = mongoose.model('userSchema', userSchema);
var orderModel = mongoose.model('orderSchema', orderSchema);
var productModel = mongoose.model('productSchema', productSchema);

productModel.remove({}, function(err) {
  console.log('productModel removed');
});

fs.readFile('product.json', function(err, products) {
  if (err) throw err;
  JSON.parse(products).forEach(function(product) {
    productModel.create({
      "productId": product.productId,
      "name": product.name,
      "ImageURL": product.ImageURL,
      "Price": product.Price
    }, function(err, newProductAdded) {
      if (err) throw err;
      console.log('new Product Added', newProductAdded);
    });
  });
});

module.exports = {
  userModel: userModel,
  orderModel: orderModel,
  productModel: productModel
};
