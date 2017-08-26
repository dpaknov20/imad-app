var express = require('express');
var morgan = require('morgan');
var path = require('path');
//for the encryption of the password 
var crypto = require('crypto');
//this is for the database connection
var Pool = require('pg').Pool;
//for the body parsing(using JSON method)
var bodyParser = require('body-parser');
var session = require('express-session');

//configuraton for the database
var config = {
    user: 'adeepak269',
    database: 'adeepak269',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    //paswword: process.env.DB_PASSWORD
    password: 'db-adeepak269-41332'
};

function createTemplate(data) {
    var title=data.article_name;
    var name=data.article_name;
    var date=data.issued_on;
    var content=data.content;
    var category=data.category;
    
        var htmlTemplate = `
        <html>
            <head>  
                <title>
                    ${title}
                </title>
                 
            </head>
            <body>
                <div align="center">
                    <h3>
                    ${name}</h3>
                    <hr/>
                    <div>
                        ${date.toDateString()}
                    </div>
                    <hr/>
                    <div>
                        ${content}
                    </div>
                    <hr/>
                    <div>
                        ${category}
                    </div>
                </div>
            </body>
        </html>`
        ;
        return htmlTemplate;
}

var app = express();
app.use(morgan('combined'));
//for the JSON file to load 
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue', 
    cookie: {maxAge: 1000*60*60*24*30}
}));


var count=0;
app.get('/counter', function (req, res) {
  count=count+1;    
  res.send(count.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//function for the encryption of the passsword
function hash (input,salt) {
    var hashed=crypto.pbkdf2Sync(input, salt, 100000, 512, 'sha512');
    return ["pbkdf2" , "100000" , salt , hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function (req, res) {
   var hashedString = hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
    
});

app.post('/login',function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows.length === 0)
            {
                res.status(403).send('username/password is invalid');
            }
            else
            {
                var dbstring = result.rows[0].password;
                var salt = dbstring.split('$')[2];
                var hashedPassword = hash(password , salt);
                if(hashedPassword === dbstring)
                {
                    //set the session
                    req.session.outh={userId: result.rows[0].username };
                    res.send('credentials correct !');
                }
                else
                    res.status(403).send('username/password is invalid');
            }
        }
    });
});

app.post('/home/signup/register',function(req,res) {
    //we already have a username and password for now
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.randomBytes(128).toString('hex');
    var dbstring = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1,$2)', [username,dbstring], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send('user successfully created: ' + username);
        }
    });
});

app.get('/check-login',function(req,res) {
   if(req.session && req.session.outh && req.session.outh.userId) 
        res.send('you are logged in' + req.session.outh.userId.toString());
   else
        res.send('you are not logged in');
});

app.get('/logout',function(req,res) {
   delete req.session.outh;
   res.send('logged out');
});

app.get('/articles/:articleName', function (req, res) {
  pool.query("SELECT * FROM articles WHERE article_name = $1" ,[req.params.articleName], function(err,result) {
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else 
        {
            if(result.rows.length === 0)
            {
                res.status(404).send('article not found');
            }
            else
            {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }  
  });
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
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/about_us', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.html'));
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
