var request = require('request');
var express = require('express');
var app = express();

//app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.set('view options', { layout: false });
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { data: 'hello world' });
});

app.get('/proxy', function(req, res) {
  request.get(req.param('url')).pipe(res);
});

app.listen(3000);
console.log('Listening on port 3000');