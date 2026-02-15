const Database = require('better-sqlite3');
const path = require('path');

let db = null;

function getDatabase() {
  if (!db) {
    const dbPath = path.join(__dirname, '../../db/spotify_clone.db');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  getDatabase,
  closeDatabase
};
