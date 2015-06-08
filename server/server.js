if (!process.env.MONGOLAB_URI) var keys = require('../keys.js')

var express = require('express');
    app = express(),
    server  = require('http').createServer(app),
    request = require('request'),
    mongo = require('mongodb'),
    MongoClient = require('mongodb').MongoClient, 
    assert = require('assert');
     

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log('Node app running on port', app.get('port')) });
app.use(express.static('./client'));

var url = process.env.MONGOLAB_URI || keys.MONGOLAB_URI //mongodb://localhost:3000/honestFood
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db.close();
});


exports = module.exports = app;

