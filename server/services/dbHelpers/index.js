const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '../../db.json');

// Helper functions to read/write from db.json
const readDB = () => {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};
  
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = {
    readDB,
    writeDB
}