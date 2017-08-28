/*var submit=document.getElementById('myapp_submit');
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
            }; */
            function loadregister() {
                var registerHTML = 
                `<!doctype html>
                <html>
                    <head>
                        <title>Register for BagTrack</title>
                         <link href="/ui/style.css" rel="stylesheet" /> 
                    </head>
                    <body>
                        <div align="center">
                            <h3>Registration form</h3>
                            <hr/>
                            <br>
                            <label><b>Name</b></label>
                            <input type="text" placeholder="enter name" id="name" />
                            <hr/>
                            <label><b>Email</b></label>
                            <input type="text" placeholder="enter email" id="email" />
                            <hr/>
                            <label><b>Phone</b></label>
                            <input type="text" placeholder="mobile" id="contact" />
                            <hr/>
                            <label><b>Flight No.</b></label>
                            <input type="text" placeholder="fight no" id="flight" />
                            <hr/>
                            <label><b>From</b></label>
                            <input type="text" placeholder="from" id="from" />
                            <hr/>
                            <label><b>To</b></label>
                            <input type="text" placeholder="to" id="to" />
                            <hr/>
                            <label><b>Date</b></label>
                            <input type="text" placeholder="date" id="date" />
                            <hr/>
                            <label><b>Booking ID</b></label>
                            <input type="text" placeholder="booking id" id="book" />
                            <hr/>
                            <label><b>PNR</b></label>
                            <input type="text" placeholder="PNR" id="pnr" />
                            <hr/>
                            <label><b>Tag</b></label>
                            <input type="text" placeholder="enter tag" id="tag" />
                            <hr/>
                            <button type="submit" id="myapp_register">Register</button>
                            <script type="text/javascript" src="/ui/myappmain.js"></script>
                         </div>
                    </body>
                </html>
                `;
                document.getElementById('get_register').innerHTML = registerHTML;
                 var register=document.getElementById('myapp_register');
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
                  
                  var name = document.getElementById('name').value;
                  var email = document.getElementById('email').value;
                  var contact = document.getElementById('contact').value;
                  var flight_no = document.getElementById('flight').value;
                  var from = document.getElementById('from').value;
                  var to = document.getElementById('to').value;
                  var date = document.getElementById('date').value;
                  var booking_id = document.getElementById('book').value;
                  var pnr = document.getElementById('pnr').value;
                  var tag = document.getElementById('tag').value;
    
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/myapp/register', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"name": name, "email": email, "contact": contact, "flight_no": flight_no, "from": from, "to": to, "date": date, "booking_id": booking_id, "pnr": pnr, "tag": tag}));
                };
}
loadregister();