var express = require('express');
    app = express(),
    server  = require('http').createServer(app),
    request = require('request');


app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log('Node app running on port', app.get('port')) });
app.use(express.static('./client'));


// exports = module.exports = app;

// app.get('/searchresults', function(ndbo){
//   request({
//     url: 'http://api.nal.usda.gov/usda/ndb/reports/?ndbno=' + ndbno +'&type=b&format=json&api_key=kKJ078H1u9KjuD4DLAJK3nPUgFX4SoN2awG94IeR',
//   },
//   function(err,resp,body) {
//     console.log(body)
//     // var data = JSON.parse(body).map(function (repo) {
//     //   return {name: repo.full_name, id: repo.id};
//     // })
//     res.status(200).json(data)
//   });
// })

