const express = require('express');
const app = express();
const pg = require('pg');
const request = require('request');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Connect to users database
const pool = new pg.Pool({
    user: 'g1727138_u',
    host: 'db.doc.ic.ac.uk',
    database: 'g1727138_u',
    password: 'fACG1SB1c9',
    port: '5432'
});

const port = 8000;

// Specify to serve files from the public directory
app.use(express.static(__dirname + '/public'));

// HTML directory
const html_dir = __dirname + '/public/html/';

app.get('/', function (req, res) {
  res.sendFile(html_dir + 'login.html')
});

// When "Login" button is clicked ...
app.get('/login', function(req, res){

    // Query database for user and password
    const query = "SELECT DISTINCT username, password FROM users WHERE username = '" + req.query.username + "'";

    pool.query(query, (err, result) => {
        // If username is not in database ...
        if (result.rowCount == 0) {
            // ... Reload login page
            res.sendFile(html_dir + 'login.html');
        // If username and password is correct ...
        } else if (result.rows[0].password === req.query.password) {
            // ... Load tutor page
            res.sendFile(html_dir + 'tutorList.html');
        // Otherwise, password is incorrect ...
        } else {
            // ... Reload login page
            res.sendFile(html_dir + 'login.html');
        }
    });
});

//When "Code Up!" button is clicked ...
app.get('/code', function(req, res) {
    res.sendFile(html_dir + 'code.html');
});

app.post('/compile', function(req,res) {

  //var data = "public class Main{ public static void main(String[] args) {System.out.println(\"abc\");}}";

  var data = req.body.data;

  var compile_run = require('compile-run');
  compile_run.runJava(data, "", function (stdout, stderr, err) {
    if(!err){
      console.log(stdout);
      console.log(stderr);
      res.send(stdout + "\n" + stderr);
      //res.send(stderr);
    } else{
      res.send(err);
      console.log(err);
    }
  });
//   var clientSecretKey = 'eb44c5dfc51c2cfe344014db15b69b2a931393b8';
//   //var api = new HackerEarthAPI(clientSecretKey);
//   //var data = "print 'Hello World'";
//   console.log('passed to server');
//
//   var source = "print 'Hello World'";
//   var run_url = 'https://api.hackerearth.com/v3/code/run/';
//   var clientSecretKey = 'eb44c5dfc51c2cfe344014db15b69b2a931393b8';
//   // var myText = document.getElementById('output-box1').value = '\u{1F4A9}';
//   var data = {
//     'client_secret': clientSecretKey,
//     'async': 0,
//     'source': source,
//     'lang': "PYTHON",
//     'time_limit': 5,
//     'memory_limit': 262144,
//   }
//
//   var options = {
//     uri : 'https://api.hackerearth.com/v3/code/run/',
//     method : 'POST',
//     headers : { 'Content-Type' : 'application/json' },
//     form : data
//   };
//
//   request(options, function (error, response, body) {
//     var parsedResponse;
//
//     try {
//       //parsedResponse = JSON.parse(body);
//       console.log('requested');
//       console.log('body' + body + '\n');
//       console.log('response: \n' + response);
//     } catch (error) {
//       console.log('error');
//       console.log(error);
//     }
//
//     // if (response.statusCode != 200 || parsedResponse.errors) {
//     //   console.log('Status code: ' + response.statusCode);
//     //   console.log(parsedResponse.errors);
//     // }
  // });

  // api.compile({ source: data, lang: 'PYTHON' }, function (err, data) {
  //   if (err) {
  //     console.log("Oh no");
  //     console.log(err.message);
  //   } else {
  //     console.log("Yeah");
  //     res.contentType('application/json');
  //     res.send(JSON.stringify(data));
  //     console.log(JSON.stringify(data)); // Do something with your data
  //   }
  // });
  //
  // api.run({ source: data, lang: 'PYTHON', time_limit: 1 }, function (err, data) {
  //   if (err) {
  //     console.log(err.message);
  //   } else {
  //     res.contentType('application/json');
  //     res.send(JSON.stringify(data));
  //     console.log(JSON.stringify(data)); // Do something with your data
  //   }
  // });
});


//When "Compile" button is clicked ...



app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
