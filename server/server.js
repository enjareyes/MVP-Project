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
      res.send({token: token, email: email})
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

      DB.collection('users').insert({email:email, password: hash, saved:[]})
      res.send({token:token, email: email, saved:[]})
    }
  })
});

app.get('/savefood', function(req,res){
  var foodInfo = req.query,
      email = req.query.email;

  // console.log('saving food in server',foodInfo)
  //save foodinfo to users favorites in DB
  DB.collection('users').update(
    // { email: email },
    { email: email, 'fooditem': {$ne: foodInfo.fooditem}}, 
    { $push: {saved: foodInfo } }
  )
  DB.collection('users').findOne({email: email}, function(err, result){
    if (result){ //found user - add the food
      console.log('found user',result.saved)
      res.send({food: result.saved})
    } 
  })
})


app.get('/getFavorites', function(req, res){
  var email = req.query.email;

  DB.collection('users').findOne({email: email}, function(err, result){
    if (result){ //found user - return saved foods
      // console.log('saved foods:',result.saved)
      res.send({food: result.saved})
    } 
  })
})



