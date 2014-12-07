var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index');
});

var server;

server = http.createServer(app);
server.listen(3000, function(){
    console.log('Listening: 3000');
});