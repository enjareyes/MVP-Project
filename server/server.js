if (!process.env.MONGOLAB_URI) var keys = require('../keys.js')

var express = require('express'),
    app = express(),
    server  = require('http').createServer(app),
    request = require('request'),
    mongo = require('mongodb'),
    MongoClient = require('mongodb').MongoClient, 
    assert = require('assert'),
    bcrypt = require('bcrypt'),
    JWT = require('jwt-simple'),
    DB;
     
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log('Node app running on port', app.get('port')) });
app.use(express.static('./client'));

var url = process.env.MONGOLAB_URI || keys.MONGOLAB_URI 
//mongodb://localhost:3000/honestFood

MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  DB = db;
});

// exports = module.exports = app;

app.get('/searchfood',function(req,res){
  var foodName = req.query.food,
      url = 'http://api.nal.usda.gov/usda/ndb/search/?format=json&q=' + foodName + '&sort=n&max=25&offset=0&api_key=kKJ078H1u9KjuD4DLAJK3nPUgFX4SoN2awG94IeR'
  
  request( url, function(err, response, body){
    if (err) console.log('Error in /searchFood');
    else {
      res.set('Content-Type', 'application/json')
      res.status(200).send(body)
    }
  })
})

app.get('/foodinfo',function(req,res){
  var ndbno = req.query.ndbno,
      url = 'http://api.nal.usda.gov/usda/ndb/reports/?ndbno=' + ndbno +'&type=b&format=json&api_key=kKJ078H1u9KjuD4DLAJK3nPUgFX4SoN2awG94IeR'
  
  request( url, function(err, response, body){
    if (err) console.log('Error in /foodinfo');
    else {
      res.set('Content-Type', 'application/json')
      res.status(200).send(body)
    }
  })
})

app.get('/login',function(req,res){
  var email = req.query.email,
      password = req.query.password,
      payload = { email: email },
      secret = 'eatgoodfood',
      token = JWT.encode(payload, secret);

  DB.collection('users').findOne({email: email}, function(err, result){
    if (result){ //user exists - log them in
      res.send({token: token})
    } else {
      //user must sign up
      //redirect to signup page or show pop up and redirect
    } 
  })
})

app.get('/signup',function(req,res){
  var email = req.query.email,
      password = req.query.password,
      payload = { email: email },
      secret = 'eatgoodfood',
      token = JWT.encode(payload, secret);

  //check db - if email doesn't exist then add it
  DB.collection('users').findOne({email: email}, function(err, result){
    if (result){ //user exists - log them in
      console.log('user exists- logging them in')
      res.send({token: token})
    } else { 
      console.log('creating new user') //add user to db
      var salt = bcrypt.genSaltSync(10),
          hash = bcrypt.hashSync(password, salt);

      DB.collection('users').insert({email:email, password: hash})
      res.send({token:token})
    }
  })
});








