const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const model = require('./schema.js');
const session = require('express-session');
let sessionId = 0;
app.use(bodyparser.json());
app.use(cors());

app.use(session({
  id: sessionId,
  secret: 'master of my domain',
  cookie: {maxAge: 31536000000}
}));

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

app.get('/session', function(req, res) {
  var sess = req.session;
  // console.log('in session', sess.genid);
  console.log('id', sess.id)
  res.send(JSON.stringify(sess.id));
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