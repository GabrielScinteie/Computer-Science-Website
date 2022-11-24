function g() {
    let e = document.getElementById("dataMea");
    e.innerHTML = "Data actuală este " + (new Date());
}

function f() {
    setInterval(g, 1000);
    versiune = document.getElementById("versiune")
    versiune.innerHTML = "Versiunea actuală este " + (navigator.userAgent);

    let canvas = document.getElementById("desen");
    const ctx = canvas.getContext('2d');
    console.log("Am ajuns la make_base")
    make_base(ctx);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("locatie").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    document.getElementById("locatie").innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

function onLoadScript()
{
    f();
    getLocation();
}

var x = null, y = null;
function d(e) {
    if (x == null) {
        x = e.offsetX;
        y = e.offsetY;
    }
    else {
        let x2 = e.offsetX;
        let y2 = e.offsetY;
        let canvas = document.getElementById("desen");
        const ctx = canvas.getContext('2d');
        let contur = document.getElementById("contur");
        ctx.strokeStyle = contur.value;
        let umplere = document.getElementById("umplere");
        ctx.fillStyle = umplere.value;
        ctx.strokeRect(x, y, x2 - x, y2 - y);
        ctx.fillRect(x, y, x2 - x, y2 - y);
        x = y = null;

    }
}

function make_base(context) {
    base_image = new Image();
    base_image.src = "imagini/logo.png";
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);
    }
}


function addRow() {
    var table = document.getElementById("myTable");
    var whichRow = document.getElementById("adaugaLinie").value;
    var color = document.getElementById("adaugaCuloare").value;

    var row = table.insertRow(whichRow);

    for (var i = 0; i < table.rows[0].cells.length; i++) {
        var myCell = row.insertCell(i);
        myCell.innerHTML = "";
        myCell.style.background = color;
    }
}

// append column to the HTML table
function appendColumn() {
    var tbl = document.getElementById('myTable'); // table reference
    var column = document.getElementById("adaugaColoana").value;
    var color = document.getElementById("adaugaCuloare").value;

    // open loop for each row and append cell
    for (var i = 0; i < tbl.rows.length; i++) {
        var myCell = tbl.rows[i].insertCell(column);
        myCell.innerHTML = "";
        myCell.style.background = color;

    }
}

function schimbaContinut(resursa, jsFisier, jsFunctie) {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        /* onreadystatechange, onload, onerror */
        xhttp.onreadystatechange =
            function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    document.getElementById("continut").innerHTML = xhttp.responseText;

                    if (jsFisier) {
                        var elementScript = document.createElement('script');
                        elementScript.onload = function () {
                            console.log("hello");
                            if (jsFunctie) {
                                window[jsFunctie]();
                            }
                        };
                        elementScript.src = jsFisier;
                        document.head.appendChild(elementScript);
                    } else {
                        if (jsFunctie) {
                            window[jsFunctie]();
                        }
                    }
                }
            }
        xhttp.open("GET", resursa + '.html', true);
        xhttp.send();
    }
}

function inregistreaza() {
    var utilizator = document.getElementById("numeUtilizator").value;
    var parola = document.getElementById("parola").value;
    var jsonString;
    var xhttp = new XMLHttpRequest();
  
    var obj = new Object();
    obj.utilizator = utilizator;
    obj.parola = parola;
    jsonString = JSON.stringify(obj);
  
    xhttp.open("POST", "/api/utilizatori", true);
    xhttp.send(jsonString);
  }