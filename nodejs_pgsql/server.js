const express = require('express');
const app = express();
const pg = require('pg');


app.use(express.static(__dirname));

//const connectionString = 'postgres://db.doc.ic.ac.uk:5432/g1727138_u';
//const client = new pg.Client(connectionString);
//client.connect();
//const query = client.query()

/*const pool = new pg.Pool({
user: 'g1727138_u',
host: 'db.doc.ic.ac.uk',
database: 'g1727138_u',
password: 'fACG1SB1c9',
port: '5432'});
pool.query("CREATE TABLE users(username VARCHAR(40) PRIMARY KEY, password VARCHAR(40) )", (err, res) => {
console.log(err,res);
pool.end();
});*/



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.get('/process_get', function(req, res){
    response = {
        username : req.query.username,
        password : req.query.password
    };
    const pool = new pg.Pool({
user: 'g1727138_u',
host: 'db.doc.ic.ac.uk',
database: 'g1727138_u',
password: 'fACG1SB1c9',
port: '5432'});
pool.query("INSERT INTO users(username, password) VALUES('" + response.username + "', '" + response.password + "')", (err, res) => {
    console.log(err,res);
    pool.end();
});
    //const str = `${response.username} asdfjkj`;
    //console.log(str);
    //convert the response in JSON format
    res.end(JSON.stringify(response));
});

app.listen(8000, function () {
  console.log('Example app listening on port 8080!')
});
