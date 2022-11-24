function incarcaPersoane()
{
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        /* onreadystatechange, onload, onerror */
        xhttp.onreadystatechange =
            function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    //document.getElementById("continut").innerHTML = xhttp.responseText;
                    makeTable(this);
                }
            }

        xhttp.open("GET","resurse/persoane.xml", true);
       
        xhttp.send();
    }
}

function makeTable(xml)
{
    var i;
    var xmlDoc = xml.responseXML;
    document.getElementById("continut").innerHTML = xml.responseXML;
    var description = `<p style = "margin-top: 10px; margin-bottom: 10px;"> Acestea sunt datele de contact ale administratorilor site-ului:</p>`;
    var table = description + `<table id ="tabelPersoane" style = "color: green; border: 1px solid blue;"> 
        <tr><th>Nume</th> 
        <th>Prenume</th> 
        <th>Vârstă</th> 
        <th> Strada </th> 
        <th> Număr </th> 
        <th> Localitate </th> 
        <th> Județ </th>
        <th> Țară </th></tr>`;

    var x = xmlDoc.getElementsByTagName("persoana");

    // Start to fetch the data by using TagName 
    for (i = 0; i < x.length; i++) {
        table += "<tr> <td>" +
            x[i].getElementsByTagName("nume")[0]
            .childNodes[0].nodeValue + "</td><td>" +

            x[i].getElementsByTagName("prenume")[0]
            .childNodes[0].nodeValue + "</td><td>" +

            x[i].getElementsByTagName("varsta")[0]
            .childNodes[0].nodeValue + "</td><td>" +

            x[i].getElementsByTagName("adresa")[0]
            .getElementsByTagName("strada")[0]
            .childNodes[0].nodeValue + "</td><td>" +

            x[i].getElementsByTagName("adresa")[0]
            .getElementsByTagName("numar")[0]
            .childNodes[0].nodeValue + "</td><td>" +

            x[i].getElementsByTagName("adresa")[0]
            .getElementsByTagName("localitate")[0]
            .childNodes[0].nodeValue + "</td><td>" +

            x[i].getElementsByTagName("adresa")[0]
            .getElementsByTagName("judet")[0]
            .childNodes[0].nodeValue + "</td><td>" +

            x[i].getElementsByTagName("adresa")[0]
            .getElementsByTagName("tara")[0]
            .childNodes[0].nodeValue + "</td></tr>";
        }

    // Print the xml data in table form
    table += "</table>";
    document.getElementById("continut").innerHTML = table;
}


