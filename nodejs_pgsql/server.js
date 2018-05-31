const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.get('/process_get', function(req, res){
    response = {
        username : req.query.username,
        password : req.query.password
    };

    //convert the response in JSON format
    res.end(JSON.stringify(response));
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
