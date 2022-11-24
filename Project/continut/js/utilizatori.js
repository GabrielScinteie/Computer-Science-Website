function verificaLogin(){
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        /* onreadystatechange, onload, onerror */
        xhttp.onreadystatechange =
            function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    //document.getElementById("continut").innerHTML = JSON.Parse;
                    var object = JSON.parse(this.responseText);
                    var utilizator = document.getElementById("utilizator").value;
                    var parola = document.getElementById("parola").value;

                    let found = false
                    for(var i = 0; i < object.length; i++)
                    {
                        if(object[i].utilizator == utilizator && object[i].parola == parola)
                            found = true;
                    }

                    if(found == true)
                    {
                        document.getElementById("rezultat").innerHTML = "Logare cu succes!";
                        document.getElementById("rezultat").style.color = "green";
                    }
                    else
                    {
                        document.getElementById("rezultat").innerHTML = "Numele sau parola sunt gresite!";
                        document.getElementById("rezultat").style.color = "red";
                    }

                    
                }
            }

        xhttp.open("GET","resurse/utilizatori.json", true);
       
        xhttp.send();
    }
}