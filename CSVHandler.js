const fs = require('fs');

class CSVHandler {
  constructor(filePath) {
    this.filePath = filePath;
    this.separator = ';';
  }

  readData() {
    try {
      const fileData = fs.readFileSync(this.filePath, 'utf8');
      const rows = fileData.split('\n');
      const data = rows.map(row => row.split(this.separator));
      return data;
    } catch (error) {
      console.error('Greška pri čitanju CSV:', error);
      return [];
    }
  }

  writeData(newRow) {
    try {
      const fileData = fs.readFileSync(this.filePath, 'utf8');
      const rowData = Object.values(newRow);
      const newData = fileData + rowData.map(data => String(data)).join(this.separator) + '\n';
      fs.writeFileSync(this.filePath, newData, 'utf8');
      return true;
    } catch (error) {
      console.error('Greška pri pisanju CSV:', error);
      return false;
    }
  }

  deleteData() {
    try {
      fs.unlinkSync(this.filePath);
      return true;
    } catch (error) {
      console.error('Greška brisanja CSV datoteke:', error);
      return false;
    }
  }
}

module.exports = CSVHandler;