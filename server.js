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
var pool = new Pool(config);

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

var pool = new Pool(config);
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
                    req.session.outh={userName: result.rows[0].username };
                    res.send('credentials correct !');
                }
                else
                    res.status(403).send('username/password is invalid');
            }
        }
    });
});

app.post('/register',function(req,res) {
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
   if(req.session && req.session.outh && req.session.outh.userName) 
        res.send('you are logged in as ' + req.session.outh.userName.toString());
   else
        res.status(400).send('you are not logged in');
});

app.get('/logout',function(req,res) {
   delete req.session.outh;
   res.send('<html><body style="padding-top : 50";><div align="center">Logged out!<br/><br/><a href="/">Back to home</a></div></body></html>');
});

app.post('/myapp/login',function(req,res) {
    var booking = req.body.booking;
    var pnr = req.body.pnr;
    pool.query('SELECT booking,pnr FROM customer WHERE booking = $1', [booking], function(err,result) {
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
                var user1 = result.rows[0].pnr;
                if(user1 === pnr)
                {
                    //set the session
                    req.session.auth={bookid: result.rows[0].booking };
                    res.send('credentials correct !');
                }
                else
                    res.status(403).send('username/password is invalid');
            }
        }
    });
});

app.get('/myapp/checklogin', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.bookid) {
       // Load the user object
       pool.query('SELECT * FROM customer WHERE booking = ($1)', [req.session.auth.bookid], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].name);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/getdetails', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM customer WHERE booking = ($1)', [req.session.auth.bookid], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.status(200).send(JSON.stringify(result.rows[0]));
      }
   });
});

app.get('/customer/:bookingid', function (req, res) {
  pool.query('SELECT * FROM customer WHERE booking = $1', [req.params.bookingid], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('customer booking_id not found');
        } else {
            var custData = result.rows[0];
            res.send(custData);
            res.send(makeTemplate(custData));
        }
    }
  });
});

function makeTemplate(data) {
    var name=data.name;
    var email=data.email;
    var contact=data.contact;
    var flight=data.flight;
    var fromcity=data.fromcity;
    var tocity=data.tocity;
    var date=data.date;
    var booking=data.booking;
    var pnr=data.pnr;
    var tagid=data.tagid;
        var bookTemplate = `
        <html>
            <head>  
                <title>
                    ${name}
                </title>
            </head>
            <body>
                <div align="center">
                    <h2>
                    ${booking}</h2>
                    <h2>
                    ${pnr}</h2>
                    <h2>
                    ${tag}</h2>
                    <hr/>
                    <h4>${name}</h4>
                    <hr/>
                    <h4>
                    ${contact}</h4>
                    <hr/>
                    <h4>
                    ${fly}</h4>
                    <p>${flight}</p>
                    <hr/>
                    <p>
                    ${fromcity}</p> 
                    <p>
                    ${tocity}</p>
                    <p>${date}</p>
                </div>
            </body>
        </html>`
        ;
        return bookTemplate;
}

app.post('/registration',function(req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var flight = req.body.flight;
    var fromcity = req.body.fromcity;
    var tocity = req.body.tocity;
    var date = req.body.date;
    var booking = req.body.booking;
    var pnr = req.body.pnr;
    var tagid = req.body.tagid;
    pool.query('INSERT INTO customer (name,email,contact,flight,fromcity,tocity,date,booking,pnr,tagid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [name, email, contact, flight, fromcity, tocity, date, booking, pnr, tagid], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send('user successfully registered: ' + booking);
        }
    });
});

app.get('/myapp/logout',function(req,res) {
   delete req.session.outh;
   res.send('<html><body style="padding-top : 50";><div align="center">Logged out!<br/><br/><a href="/myapp">Back to home</a></div></body></html>');
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

app.get('/myapp/database', function (req, res) {
    //make a select request
    //return the rrsponse with results
    pool.query('SELECT * FROM customer',function(err,result) {
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

app.get('/ui/main.js', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/myapp', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'myapp.html'));
});

app.get('/ui/myappmain.js', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'myappmain.js'));
});

app.get('/ui/myappregister.js', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'myappregister.js'));
});

app.get('/myappregister', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'myappregister.html'));
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
