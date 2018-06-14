const express = require('express');
const app = express();
const server = require('http').createServer(app);
// HTTPs server set up
const fs = require('fs');
var sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
const httpsserver = require('https').createServer(sslOptions, app);
httpsserver.listen(8443);
const io = require('socket.io').listen(httpsserver);
const pg = require('pg');
const request = require('request');
var serveStatic = require('serve-static');  // serve static files
var easyrtc = require("./easyrtc");               // EasyRTC external module
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
  res.sendFile(__dirname + '/public/homepage/index.html')
});

app.get('/loginpage', function (req, res) {
  res.sendFile(html_dir + 'login.html');
});

// When "Login" button is clicked ...
app.post('/login', function(req, res){

    // Query database for user and password
    const query = "SELECT DISTINCT id, password FROM users WHERE id = '" + req.body.username + "'";

    pool.query(query, (accessErr, accessResult) => {
        // If username is not in database ...
        if (accessResult.rowCount == 0) {
            // ... Reload login page
            res.sendFile(html_dir + 'login.html');
        // If username and password is correct ...
      } else if (accessResult.rows[0].password === req.body.password) {
            //... Load tutor page
            const listQuery = "SELECT * FROM tutorlist";
            pool.query(listQuery, (listErr, listResult) => {
              res.render('pages/tutorList', {
                  username: req.body.username,
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

app.post('/tutorList', function(req, res) {
  const listQuery = "SELECT * FROM tutorlist";
  pool.query(listQuery, (listErr, listResult) => {
    res.render('pages/tutorList', {
        username: req.body.username,
        tutors: listResult.rows
    });
  });
});

// When "Sign Up" button is clicked ...
app.get('/signup', function(req, res) {
    res.sendFile(html_dir + 'signup.html');
});

app.post('/create_user', function(req, res) {

    // Add tutor/student to the users database
    let query = "INSERT INTO users VALUES (";
    query += "'" + req.body.email + "', ";
    query += "'" + req.body.firstname + "', ";
    query += "'" + req.body.lastname + "', ";
    query += "'" + req.body.facebook  + "', ";
    query += "'" + req.body.skype  + "', ";
    query += "'" + req.body.password  + "')";
    pool.query(query, (err, result) => {});

    // Add tutor to the tutor database
    if (req.body.tutor == 'true') {
        let query = "INSERT INTO tutorlist VALUES (";
        query += "'" + req.body.email + "', ";
        query += "'" + req.body.firstname + "', ";
        query += "'" + req.body.lastname + "', ";
        query += "'" + req.body.description + "', ";
        query += "'" + req.body.rph + "', ";
        query += "'{" + req.body.skills.split(" ") + "}', ";
        query +=  0 + ", ";
        query += "'" + req.body.facebook  + "', ";
        query += "'" + req.body.skype  + "')";

        pool.query(query, (err, result) => {
            console.log(err);
        });
    }
});

// When the name of the tutor is clicked ...
app.get('/tutor_detail', function (req, res) {
    const query = "SELECT * FROM tutorlist WHERE id='" + req.query.tutor_id + "'";
    const review_query = "SELECT * FROM tutorreviews WHERE tutorid='" + req.query.tutor_id + "'";
    pool.query(query, (err, result) => {
        pool.query(review_query, (error, review_result) => {
            res.render('pages/tutorDetails', {
                username: req.query.username,
                id: req.query.tutor_id,
                firstname: result.rows[0].first_name,
                lastname: result.rows[0].last_name,
                details: result.rows[0].details,
                skills: result.rows[0].skills,
                ratings: result.rows[0].ratings,
                reviews: review_result.rows
            });
        })
    });
});

app.post('/submit_review', function(req, res) {

    // Add review to database
    let query = "INSERT INTO tutorreviews VALUES (";
    query += "'" + req.body.tutor_id + "', ";
    query += "'" + req.body.username + "', ";
    query += "'" + req.body.ratings + "', ";
    query += "'" + req.body.review_title  + "', ";
    query += "'" + req.body.comment  + "')";
    pool.query(query, (err, result) => {});

    let rating_query = "SELECT AVG(rating) FROM tutorreviews WHERE tutorid='" + req.body.tutor_id + "'";
    pool.query(rating_query, (err, result) => {
        let update_rating_query = "UPDATE tutorlist SET ratings=" + Math.round(result.rows[0].avg * 100) / 100 + " WHERE id='" + req.body.tutor_id + "'";
        pool.query(update_rating_query, (error, res) => {});
    });


});

//When "Code Up!" button is clicked ...
app.get('/code', function(req, res) {
    res.render('pages/code', {
        tutorID: req.query.tutorID,
        username: req.query.username

    });
    //res.sendFile(html_dir + 'code.html');
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
        console.log("log in");
        socket.username = data;
        users[socket.username] = socket;
        io.sockets.emit('user_connected', Object.keys(users));
    });

    socket.on('chatbox clicked', function(data) {
      //username = data.user
      //clicked user's username = data.to
      // Query database for user and password
      const query = "SELECT * FROM chattest ORDER BY sendtime ASC";
      pool.query(query, (accessErr, accessResult) => {
        //console.log("Err: " + accessErr);
        var count = accessResult.rowCount;
        for (var i = 0; i < count; i++) {
          //msg from logged in user
          if (accessResult.rows[i].fromuser === data.user &&
            accessResult.rows[i].touser === data.to) {
              users[data.user].emit('display history', {user: data.to, pos: 'right', msg: accessResult.rows[i].msg});
            }
            //msg from clicked user
          else if (accessResult.rows[i].fromuser === data.to &&
            accessResult.rows[i].touser === data.user) {
              users[data.user].emit('display history', {user: data.to, pos: 'left', msg: accessResult.rows[i].msg});
            }
        }
      });
    });

    socket.on('to server', function(data) {
      try {
        if (data.to !== data.from) {
          users[data.to].emit('to client', {from: data.from, msg: data.msg});
        }

      } catch (error) {
        console.log(error);
      }
      var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let query = "INSERT INTO chattest VALUES (";
        query += "'" + data.to + "', ";
        query += "'" + data.from + "', ";
        query += "'" + data.msg + "', ";
        query += "'" + date  + "')";
        pool.query(query, (err, result) => {
            console.log(err);
        });
    });

    socket.on('disconnect', function() {
        // Remove the user from the online list
        delete users[socket.username];
        io.sockets.emit('user_disconnected', Object.keys(users));
    });

    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
});

// Set process name
process.title = "node-easyrtc";

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
//var app = express();
//app.use(serveStatic('static', {'index': ['index.html']}));

// Start Express http server on port 8080
//var webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
//var socketServer = socketIo.listen(webServer, {"log level":1});

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, io, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io').listen(server);
// const pg = require('pg');
// const request = require('request');
// var bodyParser = require('body-parser')
// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }));
//
// // Connect to users database
// const pool = new pg.Pool({
//     user: 'g1727138_u',
//     host: 'db.doc.ic.ac.uk',
//     database: 'g1727138_u',
//     password: 'fACG1SB1c9',
//     port: '5432'
// });
//
//
// // A dictionary of online users
// const users = {};
//
// const port = 8000;
// server.listen(port);
//
// // Specify to serve files from the public directory
// app.use(express.static(__dirname + '/public'));
//
// // set the view engine to ejs
// app.set('view engine', 'ejs');
//
// // HTML directory
// const html_dir = __dirname + '/public/html/';
//
// app.get('/', function (req, res) {
//   res.sendFile(html_dir + 'login.html')
// });
//
// // When "Login" button is clicked ...
// app.get('/login', function(req, res){
//
//     // Query database for user and password
//     const query = "SELECT DISTINCT username, password FROM users WHERE username = '" + req.query.username + "'";
//
//     pool.query(query, (accessErr, accessResult) => {
//         // If username is not in database ...
//         if (accessResult.rowCount == 0) {
//             // ... Reload login page
//             res.sendFile(html_dir + 'login.html');
//         // If username and password is correct ...
//       } else if (accessResult.rows[0].password === req.query.password) {
//             //... Load tutor page
//             const listQuery = "SELECT * FROM tutorlist";
//             pool.query(listQuery, (listErr, listResult) => {
//               res.render('pages/tutorList', {
//                   username: req.query.username,
//                   tutors: listResult.rows
//               });
//             });
//
//         // Otherwise, password is incorrect ...
//         } else {
//             // ... Reload login page
//             res.sendFile(html_dir + 'login.html');
//         }
//     });
// });
//
// //When "Code Up!" button is clicked ...
// app.get('/code', function(req, res) {
//     res.sendFile(html_dir + 'code.html');
// });
//
//
// //When "Compile" button is clicked ...
// app.post('/compile', function(req,res) {
//
//   //var data = "public class Main{ public static void main(String[] args) {System.out.println(\"abc\");}}";
//
//   var data = req.body.data;
//   var lang = req.body.lang;
//
//   if (lang == 'Java') {
//     var compile_run = require('compile-run');
//     compile_run.runJava(data, "", function (stdout, stderr, err) {
//       if(!err){
//         console.log(stdout);
//         console.log(stderr);
//         res.send(stdout + "\n" + stderr);
//         //res.send(stderr);
//       } else{
//         res.send(err);
//         console.log(err);
//       }
//     });
//   } else if (lang == 'Python') {
//     console.log("Python selected");
//     var compile_run = require('compile-run');
//     compile_run.runPython(data, "", function (stdout, stderr, err) {
//       if(!err){
//          console.log(stdout);
//          console.log(stderr);
//          res.send(stdout + "\n" + stderr);
//       } else{
//         res.send(err);
//         console.log(err);
//       }
//     });
//   }
// });
//
//
//
//
//
//
// // Code for chatbox function
// io.sockets.on('connection', function(socket) {
//     socket.on('login', function(data) {
//         socket.username = data;
//         users[socket.username] = socket;
//     });
//
//     socket.on('to server', function(data) {
//         users[data.to].emit('to client', {from: data.from, msg: data.msg});
//     });
//
//     socket.on('disconnect', function() {
//         // Remove the user from the online list
//         delete users[socket.username];
//     });
// });
