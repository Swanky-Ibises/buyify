const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(express.static('public'));
app.get('/products', function(req, res) {
  fs.readFile('product.json', function(err, data) {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(req, res) {
  console.log('listening on port: ' + 3000);
});