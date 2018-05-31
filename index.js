var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/frontend'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/frontend/HTML/index.html');
});

app.get('/TutorList.html', function(req, res) {
	res.sendFile(__dirname + '/frontend/HTML/TutorList.html');
});

app.get('/code.html', function(req, res) {
	res.sendFile(__dirname + '/frontend/HTML/code.html');
});

http.listen(8080, function() {
	console.log('listening on: 8080');
});
