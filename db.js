/** Database for lunchly */

const { Client } = require('pg');

const db = new Client({
  connectionString: "postgresql:///lunchly"
});

db.connect();

module.exports = db;

