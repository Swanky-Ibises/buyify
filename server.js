const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const model = require('./schema.js');

app.use(bodyparser.json());
app.use(cors());

app.use(express.static('public'));

app.get('/users', function(req, res) {
  model.userModel.find({}, function(err, users) {
    res.send(users);
  });
});

app.get('/orders', function(req, res) {
  model.orderModel.find({}, function(err, orders) {
    res.send(orders);
  });
});

//The products endpoint is the only endpoint we are using for to populate UI
//The remaining endpoints can be built out as you see fit

app.get('/products', function(req, res) {
  model.productModel.find({}, function(err, products) {
    res.send(products);
  });
});

app.post('/product', function(req, res) {
  console.log('request body', req.body);
  model.productModel.create({
  "productId": req.body.productId,
  "name": req.body.name,
  "ImageURL": req.body.ImageURL,
  "Price": req.body.Price
  }, function(err, newProductAdded) {
    res.send(newProductAdded);
  });
});

app.post('/order', function(req, res) {
  model.pageViewModel.create({
   orderId: req.body.orderId,
   orderTotal: req.body.orderTotal,
   orderQTY: req.body.orderQTY,
  }, function(err, newOrder) {
    res.send(newOrder);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function(req, res) {
  console.log('listening on port: ' + 3000);
});