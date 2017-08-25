var express = require('express');
var morgan = require('morgan');
var path = require('path');
//this is for the database connection
var Pool = require('pg').Pool;
//configuraton for the database
var config = {
    user: 'adeepak269',
    database: 'adeepak269',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    //paswword: process.env.DB_PASSWORD
    password: 'db-adeepak269-41332'
};

var app = express();
app.use(morgan('combined'));

var count=0;
app.get('/counter', function (req, res) {
  count=count+1;    
  res.send(count.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/database', function (req, res) {
    //make a select request
    //return the rrsponse with results
    pool.query('SELECT * FROM authors',function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send(JSON.stringify(result.rowCount));
        }
    });
});

app.get('/about_us', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'home.html'));
});

app.get('/home/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});

app.get('/home/signup', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'signup.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
