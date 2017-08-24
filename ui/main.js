var cli=Document.getElementById("user");
cli.onclick=function myFunction() 
{
            var strk = document.getElementById("user");
            var str1=strk.value;
            var str2 = "dpaknov20";
            var n = str1.localeCompare(str2);
            if(n!==0)
            {
                document.getElementById("user").innerHTML="";
                alert("please enter a valid username");
            }
        };
