class myStorageInterface{
    constructor(nume, cantitate){
        this.produs = new Product(nume, cantitate);
    }

    addProduct(){}
}

var n_db = 0;
class IndexDB extends myStorageInterface{
    constructor(nume, cantitate){
        super(nume, cantitate);
    }
    addProduct(){
        var numeProdus = this.produs.name;
        var cantitateProdus =  this.produs.quantity;
        var openRequest = window.indexedDB.open("BazaDeDateProduse", 1);
        openRequest.onerror = event =>{
            console.log("Eroare conectare la baza de date");
        }

        openRequest.onupgradeneeded = event=>{
             // Save the IDBDatabase interface
            var db = event.target.result;

            // Create an objectStore for this database
            if(db.objectStoreNames.contains("produse") == 0)
                var objectStore = db.createObjectStore("produse", { keyPath: "id" });

            objectStore.createIndex("id", "id", {unique:false});
            objectStore.createIndex('nume', 'nume', {unique:false});
            objectStore.createIndex('cantitate', 'cantitate', {unique:false});
        }

        openRequest.onsuccess = function(event){
            var db = openRequest.result;
            var transaction = db.transaction("produse", "readwrite");
            var produse = transaction.objectStore("produse");

            var allIds = produse.index("id");
            var allIdsRequest = allIds.getAll();
            allIdsRequest.onsuccess = function(){
                n_db = allIdsRequest.result.length;
                n_db++;
                var newProduct = new ProductForDB(n_db, numeProdus,cantitateProdus);
                var request = produse.put({
                    id: newProduct.id,
                    nume : newProduct.nume,
                    cantitate : newProduct.cantitate
                });
                request.onsuccess = function(){
                    console.log("O sa adaug un nou produs in baza de date: " + newProduct.nume + " " + newProduct.cantitate);
                    var table = document.getElementById("tabelProduse");
                    table.innerHTML = `<tr>
                    <th> Număr </th>
                    <th> Nume Produs</th>
                    <th> Cantitate </th>
                </tr>`;
                    var allIds = produse.index("id");
                    var allIdsRequest = allIds.getAll();
                    allIdsRequest.onsuccess = function(){
                        console.log("Am facut rost de toate id-urile");
                        for (var i = 1; i <= allIdsRequest.result.length; i++) {
                            var row = table.insertRow(allIdsRequest.result[i - 1].id);
                            var cell0 = row.insertCell(0);
                            var cell1 = row.insertCell(1);
                            var cell2 = row.insertCell(2);
                            cell0.innerHTML = allIdsRequest.result[i - 1].id;
                            cell1.innerHTML = allIdsRequest.result[i - 1].nume;
                            cell2.innerHTML = allIdsRequest.result[i - 1].cantitate;
                          }
                    }                
                }
                
                request.onerror = function()
                {
                  console.log("Eroare la adaugare produs.");
                }
            }
        }
    }
}

class Product {
    constructor(name, quantity) {
      this.name = name;
      this.quantity = quantity;
    }
}

class ProductForDB{
    constructor(id, name, quantity) {
        this.id = id;
        this.nume = name;
        this.cantitate = quantity;
    }
}



class LocalStorage extends myStorageInterface{
    constructor(nume, cantitate){
        super(nume, cantitate);
    }

    addProduct(){
        let n = localStorage.getItem("nr");
        if(n == null)
            n = 0;
        else
            n = parseInt(n);
    
        let p = new Product(this.produs.name, this.produs.quantity);
        n++;
        localStorage.setItem("nr", n);
        localStorage.setItem(n, JSON.stringify(p));
    
        console.log(p);
    }

    addRow() {
        let n = localStorage.getItem("nr");
        if(n == null)
            n = 0;
        else
            n = parseInt(n);
    
        var table = document.getElementById("tabelProduse");
        console.log("Am adaugat linie!!");
        var row = table.insertRow(n);
    
        var idCell = row.insertCell(0);
        var nameCell = row.insertCell(1);
        var quantityCell = row.insertCell(2);
    
        var jsonString = localStorage.getItem(n);
        var jsonObject = JSON.parse(jsonString);
        idCell.innerHTML = n;
        nameCell.innerHTML = jsonObject.name;
        quantityCell.innerHTML = jsonObject.quantity;
    }
}




function add(){
    var myWorker = new Worker('js/worker.js');
    console.log("Am trimis mesaj la worker")
    myWorker.postMessage("adauga");

    myWorker.onmessage = function(event){
        let response = event.data;
        console.log("Am primit mesaj de la worker:" + response);

        if(response == "actualizeazaTabel")
        {
            console.log("Actualizez tabelul")
        }
    };

    var local = document.getElementById("LocalStorage").checked;
    var index = document.getElementById("indexDB").checked;
    var nume = document.getElementById("nume").value;
    var cantitate = document.getElementById("cantitate").value;
    
    if(local)
    {
        let myLocalStorage = new LocalStorage(nume, cantitate);
        myLocalStorage.addProduct();
        myLocalStorage.addRow();
    }
    if(index)
    {
        let myIndexDB = new IndexDB(nume, cantitate);
        myIndexDB.addProduct();
    }
}

function incarcaTabel(){
    let n = localStorage.getItem("nr");
    if(n == null)
        n = 0;
    else
        n = parseInt(n);
    
    var table = document.getElementById("tabelProduse");
    for(let i = 1; i <= n; i++)
    {
        console.log("Am inserat in tabel randul " + i);

        let jsonString = localStorage.getItem(i);
        let jsonObject = JSON.parse(jsonString);

        let row = table.insertRow(i);
        let idCell = row.insertCell(0);
        idCell.innerHTML = i;
        let nameCell = row.insertCell(1);
        nameCell.innerHTML = jsonObject.name;
        let quantityCell = row.insertCell(2);
        quantityCell.innerHTML = jsonObject.quantity;
    }   
}













