const fs = require('fs');
const path = require('path');
const pool = require('./database');

const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    console.log('Base de données initialisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l’initialisation de la base de données :');
    console.error(error.message);
  }
};

module.exports = initDatabase;