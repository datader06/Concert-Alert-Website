const { getDatabase } = require('../config/database');

class Artist {
  static create(lastfmId, name, genre = null, bio = null, imageUrl = null) {
    const db = getDatabase();
    
    try {
      // Check if artist already exists
      const existing = this.findByLastFmId(lastfmId);
      if (existing) return existing;

      const stmt = db.prepare(`
        INSERT INTO artists (lastfm_id, name, genre, bio, image_url)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(lastfmId, name, genre, bio, imageUrl);
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      throw new Error('Artist creation failed: ' + error.message);
    }
  }

  static findById(id) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM artists WHERE id = ?');
    return stmt.get(id);
  }

  static findByLastFmId(lastfmId) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM artists WHERE lastfm_id = ?');
    return stmt.get(lastfmId);
  }

  static findByName(name) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM artists WHERE LOWER(name) LIKE ?');
    return stmt.all(`%${name.toLowerCase()}%`);
  }

  static update(id, data) {
    const db = getDatabase();
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);
    const query = `UPDATE artists SET ${updates.join(', ')} WHERE id = ?`;
    
    try {
      const stmt = db.prepare(query);
      stmt.run(...values);
      return this.findById(id);
    } catch (error) {
      throw new Error('Update failed: ' + error.message);
    }
  }

  static getTopArtistsByListeners() {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM artists 
      ORDER BY listener_count DESC
      LIMIT 50
    `);
    return stmt.all();
  }

  static getArtistConcerts(artistId) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM concerts 
      WHERE artist_id = ? 
      ORDER BY event_date ASC
    `);
    return stmt.all(artistId);
  }

  static searchArtists(query) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM artists 
      WHERE LOWER(name) LIKE ? OR LOWER(genre) LIKE ?
      LIMIT 20
    `);
    return stmt.all(`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`);
  }
}

module.exports = Artist;
