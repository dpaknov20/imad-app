 
                 
            function loadLoginPage() {
                var loginHTML = 
                    `<h3>Login Access</h3>
                    <label><b>BOOKING ID</b></label>
                    <input type="text" placeholder="BOOKING" id="bookid" />
                    <hr/>
                    <label><b>PNR &emsp; &emsp; &emsp;</b></label>
                    <input type="password" placeholder="PNR" id="pnr" />
                    <hr/>
                    <button type="submit" id="myapp_submit" >Login</button>`;
                documtne.getElementById('login_submit').innerHTML=loginHTML;
                
                var submit=document.getElementById('myapp_submit');
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
                  var booking = document.getElementById('BOOKING').value;
                  var pnr = document.getElementById('PNR').value;
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/myapp/login', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"booking": booking, "pnr": pnr}));
            };
        }
        loadLoginPage();
        
                