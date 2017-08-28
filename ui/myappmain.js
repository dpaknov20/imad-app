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
                  var username = document.getElementById('usr').value;
                  var password = document.getElementById('psd').value;
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/login', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"username": username, "password": password}));
            };
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
                  
                  var name = document.getElementById('bookid').value;
                  var email = document.getElementById('pnr').value;
                  var contact = document.getElementById('bookid').value;
                  var flight_no = document.getElementById('pnr').value;
                  var from = document.getElementById('bookid').value;
                  var to = document.getElementById('pnr').value;
                  var date = document.getElementById('bookid').value;
                  var booking_id = document.getElementById('bookid').value;
                  var pnr = document.getElementById('pnr').value;
                  var tag = document.getElementById('pnr').value;
    
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/myapp/register', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"name": name, "email": email, "contact": contact, "flight_no": flight_no, "from": from, "to": to, "date": date, "booking_id": booking_id, "pnr": pnr, "tag": tag}));
                };
