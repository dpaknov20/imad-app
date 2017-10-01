function myfirstlogin() {
    var loginhtml= `
    <h3>Login Access</h3>
            <label><b>Username</b></label>
            <input type="text" placeholder="Username" id="usr" />
            <hr/>
            
            <label><b>Password</b></label>
            <input type="password" placeholder="Password" id="psd" />
            <hr/>
            
            <button type="submit" id="submit_btn" >Login</button>
            <button type="submit" id="register_btn" >Register</button> `;
            document.getElementById('valid').innerHTML=loginhtml;
            
            var submit=document.getElementById('submit_btn');
                 submit.onclick = function() {
                  //create a request
                  var request = new XMLHttpRequest();
                  //capture the response and store it in the variable
                  
                  request.onreadystatechange = function() {
                    if(request.readyState === XMLHttpRequest.DONE)  {
                        if(request.status === 200)
                        {
                            alert('logged in successfully');
                        }
                        else if(request.status === 500)
                        {
                            alert('something went wrong on the server');
                        }
                        else if(request.status === 403)
                        {
                            alert('username/password is incorrect');
                        }
                        else if(request.status === 404)
                        {
                            alert('file not found');
                        }
                    }
                  };
                  var username = document.getElementById('usr').value;
                  var password = document.getElementById('psd').value;
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/login', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"username": username, "password": password}));
            };
                 var register=document.getElementById('register_btn');
                 register.onclick = function() {
                  //create a request
                  var request = new XMLHttpRequest();
                  //capture the response and store it in the variable
                  
                  request.onreadystatechange = function() {
                    if(request.readyState === XMLHttpRequest.DONE)  {
                        if(request.status === 200)
                        {
                            alert('registered successfully');
                        }
                        else if(request.status === 500)
                        {
                            alert('something went wrong on the server');
                        }
                        else if(request.status === 403)
                        {
                            alert('forbidden request');
                        }
                        else if(request.status === 404)
                        {
                            alert('file not found');
                        }
                    }
                  };
                  var username = document.getElementById('usr').value;
                  var password = document.getElementById('psd').value;
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/register', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"username": username, "password": password}));
                };
}

function myfirstloadLogin() {
            // Check if the user is already logged in
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        LoggedInUser(this.responseText);
                    } else {
                        myfirstlogin();
                    }
                }
            };
            request.open('GET', '/check-login', true);
            request.send(null);
        }
        
         function LoggedInUser(username) {
            var loginarena = document.getElementById('valid');
            loginarena.innerHTML = 
                `<h3> Hi! <i>${username}</i></h3>
                <a href="/logout"><button>Logout</button></a><br/><br/>`;
        }
        
         function details() {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                        if(request.status === 200 )
                        {
                            var detaildata = JSON.parse(this.responseText);
                            var content = 
                            `<h3>To view your details: </h3>
                            <a href="/author/${detaildata[0].username}">${detaildata[0].username} DETAILS</a><br/><br/>
                            <div><h3> 
                            To view all the articles:</h3> 
                            <a href="/myfirstapp/articles">click here</a></div>
                            <div>
                            <input type="text" id="search" /><button>search</button></div>
                            `;
                            document.getElementById('variable').innerHTML=content;
                            
                        }
                    }
                };
            request.open('GET', '/getdetails', true);
            request.send(null);
        }

        myfirstloadLogin();
        details();
        
        
                
