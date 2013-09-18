var request = require('request');
var express = require('express');
var app = express();
var driver = require('./led_driver');

app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { data: 'hello world' });
});

app.post('/update_driver', function(req, res){
  driver.updateGenerator(req.body.code);
  res.json({ msg: 'Driver updated' });
});

app.get('/proxy', function(req, res) {
  request.get(req.param('url')).pipe(res);
});

app.listen(5000);
console.log('Listening on port 5000');
