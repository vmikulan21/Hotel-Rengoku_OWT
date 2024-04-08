const express = require("/usr/lib/node_modules/express");
const fs = require('fs');
const dirname = __dirname;
const bodyParser = require('body-parser');
const path = require("path");


const port = 12425;
const server = express();
server.use(bodyParser.json());
const CSVHandler = require('./CSVHandler');
const csvFilePath = 'podaci/rezervacije.csv';
const csvHandler = new CSVHandler(csvFilePath);

server.use(express.static('html'));
server.use('/html', express.static(path.join(dirname, 'html')));
server.use('/css', express.static(path.join(dirname, 'css')));
server.use('/jsk', express.static(path.join(dirname, 'jsk')));
server.use('/dokumenti', express.static(path.join(dirname, 'dokumenti')));
server.use(express.static('dokumentacija'));
server.use('/podaci', express.static(path.join(dirname, 'podaci')));

server.get("/akcijska1", (req, rply) => {
  rply.sendFile(path + "/html/akcijska1.html");
});
server.get("/akcijska2", (req, rply) => {
  rply.sendFile(path + "/html/akcijska2.html");
});
server.get("/akcijska3", (req, rply) => {
  rply.sendFile(path + "/html/akcijska3.html");
});
server.get("/cijenik", (req, rply) => {
  rply.sendFile(path + "/html/cijenik.html");
});
server.get("/galerija", (req, rply) => {
  rply.sendFile(path + "/html/galerija.html");
});
server.get("/", (req, rply) => {
  rply.sendFile(path + "/html/index.html");
});
server.get("/kontakt", (req, rply) => {
  rply.sendFile(path + "/html/kontakt.html");
});
server.get("/rezervacija", (req, rply) => {
  rply.sendFile(path + "/html/rezervacija.html");
});
server.get("/autor", (req, rply) => {
  rply.sendFile(path + "/dokumentacija/autor.html");
});
server.get("/dokumentacija", (req, rply) => {
  rply.sendFile(path + "/dokumentacija/dokumentacija.html");
});

server.get("/dinamicna", (req, rply) => {
  const prijeHTML = fs.readFileSync(path.join(dirname, 'podaci/prije.txt'), 'utf8');
  const nakonHTML = fs.readFileSync(path.join(dirname, 'podaci/nakon.txt'), 'utf8');
  const cjenikData = JSON.parse(fs.readFileSync(path.join(dirname, ('podaci/cijenik.json'))));

  let tableHTML = '<table id="cijenik">' +
    '<caption>Cjenik usluga</caption>' +
    '<thead>' +
    '<tr>' +
    '<th>Soba</th>' +
    '<th>Opis</th>' +
    '<th>Cijena</th>' +
    '<th>Dodatne usluge</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>';

  for (const row of cjenikData) {
    tableHTML += '<tr>' +
      `<td>${row.Soba}</td>` +
      `<td>${row.Opis}</td>` +
      `<td>${row.Cijena}</td>` +
      `<td>${row.DodatneUsluge}</td>` +
      '</tr>';
  }

  tableHTML += '</tbody>' +
    '</table>';

  const dinamicnaHTML = prijeHTML + tableHTML + nakonHTML;
  rply.send(dinamicnaHTML);
});


server.get('/api/rezervacije', (req, rply) => {
  const data = csvHandler.readData();
  rply.json(data);
});

server.post('/api/rezervacije', (req, rply) => {
  const newReservation = req.body;

  function isValidReservation(reservation) {
    if (
      reservation.hasOwnProperty('ime') &&
      reservation.hasOwnProperty('prezime') &&
      reservation.hasOwnProperty('telefon') &&
      reservation.hasOwnProperty('email') &&
      reservation.hasOwnProperty('datum') &&
      reservation.hasOwnProperty('vrijeme') &&
      reservation.hasOwnProperty('brojOsoba') &&
      reservation.hasOwnProperty('opcije') &&
      reservation.hasOwnProperty('napomena')
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  if (isValidReservation(newReservation)) {
    csvHandler.writeData(newReservation);
    rply.status(200).json({ message: 'Podaci dodani' });
  } else {
    rply.status(417).json({ error: 'Nevaljani podaci' });
  }
});

server.put('/api/rezervacije', (req, rply) => {
  rply.status(501).json({ error: 'Metoda nije implementirana' });
});

server.delete('/api/rezervacije', (req, rply) => {
  rply.status(501).json({ error: 'Metoda nije implementirana' });
});

server.get('/api/rezervacije/:id', (req, rply) => {
  const id = req.params.id;
  const data = csvHandler.readData();

  const reservation = data[id - 1];
  if (reservation) {
    rply.status(200).json(reservation);
  } else {
    rply.status(404).json({ greska: 'Nema resursa' });
  }
});

server.post('/api/rezervacije/:id', (req, rply) => {
  rply.status(405).json({ greska: 'Metoda nije dopuštena' });
});

server.put('/api/rezervacije/:id', (req, rply) => {
  rply.status(501).json({ greska: 'Metoda nije implementirana' });
});

server.delete('/api/rezervacije/:id', (req, res) => {
  const index = req.params.id - 1;
  const data = csvHandler.readData();

  if (index >= 0 && index < data.length) {
    data.splice(index, 1);

    const writer = fs.createWriteStream(csvFilePath);

    data.forEach((r) => {
      if (Object.values(r).some((value) => value.trim() !== '')) {
        writer.write(Object.values(r).join(';') + '\n');
      }
    });

    writer.end();

    res.status(200).json({ poruka: 'Podaci obrisani' });
  } else {
    res.status(404).json({ greska: 'Nevaljani podaci' });
  }
});


server.use((req, rply) => {
  rply.status(404);
  rply.send('Stranica nije pronađena! <a href="/">Klikni ovdje da se vratiš na početnu stranicu</a>');
});

server.listen(port, () => {
  console.log(`Server pokrenut na portu: ${port}`);
});
