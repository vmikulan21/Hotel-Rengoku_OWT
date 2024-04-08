var gumb = document.getElementById("gumb");
if(gumb!=null){
  gumb.addEventListener('click', function(event){
    event.preventDefault();
    provjeriPodatke();
    });
}



var datum = document.getElementById("datum");
if(datum!=null){
  datum.addEventListener('input', function() {
    vrijeme.disabled = false;
  });
}




const table = document.getElementById('cijenik');

let currentInfoBox;

function showInfo(event) {
  if (window.innerWidth > 480) return;

  const row = event.currentTarget;
  const info = row.getAttribute('data-info');

  const infoBox = document.createElement('div');
  infoBox.className = 'info-box';
  infoBox.innerText = info;

  table.parentNode.insertBefore(infoBox, table.nextSibling);

  if (currentInfoBox) {
    currentInfoBox.parentNode.removeChild(currentInfoBox);
  }

  currentInfoBox = infoBox;
}

function hideInfo(event) {
  if (window.innerWidth <= 480) return;

  if (currentInfoBox) {
    currentInfoBox.parentNode.removeChild(currentInfoBox);
    currentInfoBox = null;
  }
}

const rows = document.querySelectorAll('tr');

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const info = Array.prototype.slice
    .call(row.cells, 1)
    .map((cell) => cell.innerText)
    .join('\n');

  row.setAttribute('data-info', info);
  row.addEventListener('mouseenter', showInfo);
}

window.addEventListener('resize', hideInfo);



function provjeriPodatke() {
  
  const ime = document.getElementById("ime").value;
  const prezime = document.getElementById("prezime").value;
  const telefon = document.getElementById("telefon").value;
  const email = document.getElementById("email").value;
  const datum = document.getElementById("datum").value;
  const vrijeme = document.getElementById("vrijeme").value;
  const brojOsoba = document.getElementById("brojOsoba").value;
  const opcije = document.getElementById("opcije").selectedOptions;
  const napomena = document.getElementById("napomena").value;


  const imePolje = document.getElementById("ime");
  const prezimePolje = document.getElementById("prezime");
  const telefonPolje = document.getElementById("telefon");
  const emailPolje = document.getElementById("email");
  const napomenaPolje = document.getElementById("napomena");
  const datumPolje = document.getElementById("datum");
  const vrijemePolje = document.getElementById("vrijeme");
  const brojOsobaPolje = document.getElementById("brojOsoba");
  const opcijePolje = document.getElementById("opcije");

  
  let poruka = "";

  // Validacija imena i prezimena - ne smiju sadržavati specijalne znakove
  const reImePrezime = /^[^!#?<>]*$/;
  if (ime === "" || !reImePrezime.test(ime)) {
  poruka += "Molimo Vas da unesete ispravno ime (bez specijalnih znakova).\n";
  imePolje.style.borderColor = "red";
  }
  else {
    imePolje.style.borderColor = "";
  }

  if (prezime === "" || !reImePrezime.test(prezime)) {
  poruka += "Molimo Vas da unesete ispravno prezime (bez specijalnih znakova).\n";
  prezimePolje.style.borderColor = "red";
  }
  else {
    prezimePolje.style.borderColor = "";
  }
  
  // Validacija broja telefona
  const reTelefon = /^\d{3}-\d{3}-\d{4}$/;
  if (telefon === "") {
  poruka += "Molimo Vas da unesete broj telefona.\n";
  telefonPolje.style.borderColor = "red";
  }
 else if (!reTelefon.test(telefon)) {
  poruka += "Molimo Vas da unesete broj telefona u formatu XXX-XXX-XXXX.\n";
  telefonPolje.style.borderColor = "red";
  }
  else {
    telefonPolje.style.borderColor = "";
  }
  
  // Validacija email adrese
  const reEmail = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  if (email === "") {
  poruka += "Molimo Vas da unesete email.\n";
  emailPolje.style.borderColor = "red";
  } else if (!reEmail.test(email)) {
  poruka += "Molimo Vas da unesete ispravan email.\n";
  emailPolje.style.borderColor = "red";
  }
  else {
    emailPolje.style.borderColor = "";
  }
  
  // Validacija napomene
  const reNapomena = /^[^!#?<>\n\r]{10,1000}$/;
  if (!reNapomena.test(napomena)) {
  poruka += "Napomena mora sadržavati najmanje 10, a najviše 1000 znakova (bez specijalnih znakova).\n";
  napomenaPolje.style.borderColor = "red";
  }
  else {
    napomenaPolje.style.borderColor = "";
  }

  // Validacija odabranog datuma - ne smije biti u prošlosti
  const datumDolaska = new Date(datum);
  const danas = new Date();
  const trenutnoVrijeme = danas.getHours() + ":" + (danas.getMinutes() < 10 ? '0' : '') + danas.getMinutes();
  if (datumDolaska.getDate() === danas.getDate() && datumDolaska.getMonth() === danas.getMonth() && datumDolaska.getFullYear() === danas.getFullYear()) {
    if (vrijeme < trenutnoVrijeme) {
      poruka += "Vrijeme dolaska ne može biti manje od trenutnog vremena.\n";
      vrijemePolje.style.borderColor = "red";
    }
    else datumPolje.style.borderColor = "";
  } else if (datumDolaska < danas) {
    poruka += "Datum dolaska ne može biti u prošlosti.\n";
    datumPolje.style.borderColor = "red";
  } else if (datum === "") {
    poruka += "Datum dolaska mora biti upisan.\n";
    datumPolje.style.borderColor = "red";
  } else if (datum === "dd.mm.gggg") {
    poruka += "Morate promijeniti defaultnu vrijednost datuma dolaska.\n";
    datumPolje.style.borderColor = "red";
  } else {
    datumPolje.style.borderColor = "";
  }
  
  // Validacija odabranog vremena - ne smije biti prije 10:00 ili poslije 22:00
const reVrijeme = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
if (!reVrijeme.test(vrijeme)) {
poruka += "Molimo Vas da odaberete vrijeme u formatu HH:MM (npr. 17:30).\n";
vrijemePolje.style.borderColor = "red";
}
else {
  vrijemePolje.style.borderColor = "";
}


// Validacija odabranog broja osoba
if (brojOsoba < 1 || brojOsoba > 5) {
poruka += "Broj osoba mora biti između 1 i 5.\n";
brojOsobaPolje.style.borderColor = "red";
}
else {
  brojOsobaPolje.style.borderColor = "";
}

if (opcije.length === 0) {
  poruka += "Molimo Vas da odaberete barem jednu opciju.\n";
  opcijePolje.style.borderColor = "red";
} else {
  opcijePolje.style.borderColor = "";
}


if (poruka !== "") {
  var overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
  overlay.style.zIndex = "9999";
  document.body.appendChild(overlay);

  var div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = "translate(-50%, -50%)";
  div.style.backgroundColor = "black";
  div.style.padding = "10px";
  div.style.border = "1px solid white";
  div.style.zIndex = "9999";
  div.innerText = poruka;
  document.body.appendChild(div);
  div.addEventListener("click", ukloniDiv);
} else {
  document.getElementById("rezervacija").submit();
}

const opcijeElement = document.getElementById('opcije');
const selectedOpcija = opcijeElement.value;

const newReservation = {
  ime: ime,
  prezime: prezime,
  telefon: telefon,
  email: email,
  datum: datum,
  vrijeme: vrijeme,
  brojOsoba: brojOsoba,
  opcije: selectedOpcija,
  napomena: napomena
};


const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/rezervacije');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function () {
    if (xhr.status >=200 && xhr.status <=300 ) {
      console.log('Podaci su poslani');
    } else {
      console.error('Nevaljani podaci');
    }
  };

  xhr.send(JSON.stringify(newReservation));

}

function ukloniDiv(event) {
  var div = event.target;
  var overlay = div.previousSibling;
  document.body.removeChild(div);
  document.body.removeChild(overlay);
}


function startRotation() {
  const rotatingElement = document.getElementById('rotatingElement');
  rotatingElement.classList.add('rotated');

  setTimeout(function() {
    rotatingElement.classList.remove('rotated');
  }, 1000);
}

function startMoving() {
  const elementToMove = document.getElementById('elementToMove');
  elementToMove.classList.add('moved');

  setTimeout(function() {
    elementToMove.classList.remove('moved');
  }, 1000);
}

function changeColor() {
  const elementToColor = document.getElementById('elementToColor');
  elementToColor.classList.add('color-changed');

  setTimeout(function() {
    elementToColor.classList.remove('color-changed');
  }, 1000);
}
