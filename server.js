const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
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


// A dictionary of online users
const users = {};

const port = 8000;
server.listen(port);

// Specify to serve files from the public directory
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// HTML directory
const html_dir = __dirname + '/public/html/';

app.get('/', function (req, res) {
  res.sendFile(html_dir + 'login.html')
});

// When "Login" button is clicked ...
app.get('/login', function(req, res){

    // Query database for user and password
    const query = "SELECT DISTINCT username, password FROM users WHERE username = '" + req.query.username + "'";

    pool.query(query, (accessErr, accessResult) => {
        // If username is not in database ...
        if (accessResult.rowCount == 0) {
            // ... Reload login page
            res.sendFile(html_dir + 'login.html');
        // If username and password is correct ...
      } else if (accessResult.rows[0].password === req.query.password) {
            //... Load tutor page
            const listQuery = "SELECT * FROM tutorlist";
            pool.query(listQuery, (listErr, listResult) => {
              res.render('pages/tutorList', {
                  username: req.query.username,
                  tutors: listResult.rows
              });
            });

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


//When "Compile" button is clicked ...
app.post('/compile', function(req,res) {

  //var data = "public class Main{ public static void main(String[] args) {System.out.println(\"abc\");}}";

  var data = req.body.data;
  var lang = req.body.lang;

  if (lang == 'Java') {
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
  } else if (lang == 'Python') {
    console.log("Python selected");
    var compile_run = require('compile-run');
    compile_run.runPython(data, "", function (stdout, stderr, err) {
      if(!err){
         console.log(stdout);
         console.log(stderr);
         res.send(stdout + "\n" + stderr);
      } else{
        res.send(err);
        console.log(err);
      }
    });
  }
});






// Code for chatbox function
io.sockets.on('connection', function(socket) {
    socket.on('login', function(data) {
        socket.username = data;
        users[socket.username] = socket;
    });

    socket.on('to server', function(data) {
        users[data.to].emit('to client', {from: data.from, msg: data.msg});
    });

    socket.on('disconnect', function() {
        // Remove the user from the online list
        delete users[socket.username];
    });
});
