var submit=document.getElementById('submit_btn');
submit.onclick = function() {
  //create a request
  var request = new XMLHttpRequest();
  //capture the response and store it in the variable
  
  request.onreadystatechange = function() {
    if(request.readyState === XMLHttpRequest.DONE)  {
        if(request.status===200)
        {
            console.log('user logged in');
            alert('logged in successfully');
        }
        else if(request.status===500)
        {
            alert('something went wrong on the server');
        }
        else if(request.status===403)
        {
            alert('username/password is incorrect');
        }
    }
  };
  var username = document.getElementById('user').value;
  var password = document.getElementById('psw').value;
  request.open('POST','http://adeepak269.imad.hasura-app.io/home/login/submit',true);
  request.setRequestHeader('Content-Type','application/json');
  request.send(JSON.stringify({username: username,password: password}));
};
