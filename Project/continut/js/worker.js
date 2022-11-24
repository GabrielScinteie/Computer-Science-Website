onmessage = function(e) {
    console.log('Am primit mesaj de la cumparaturi.js: '+ e.data);
    console.log('Trimit raspuns catre cumparaturi.js');
    postMessage("actualizeazaTabel");
  }