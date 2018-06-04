const express = require('express');
const app = express();
const pg = require('pg');

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


app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
