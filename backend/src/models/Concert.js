const { getDatabase } = require('../config/database');

class Concert {
  static create(externalId, artistId, eventName, details) {
    const db = getDatabase();
    
    try {
      // Check if concert already exists
      const existing = this.findByExternalId(externalId);
      if (existing) {
        return this.update(existing.id, details);
      }

      const stmt = db.prepare(`
        INSERT INTO concerts (
          external_id, artist_id, event_name, venue_name, 
          city, country, latitude, longitude, event_date, 
          ticket_url, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        externalId,
        artistId,
        eventName,
        details.venueName,
        details.city,
        details.country,
        details.latitude,
        details.longitude,
        details.eventDate,
        details.ticketUrl,
        details.source || 'external'
      );
      
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      throw new Error('Concert creation failed: ' + error.message);
    }
  }

  static findById(id) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM concerts WHERE id = ?');
    return stmt.get(id);
  }

  static findByExternalId(externalId) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM concerts WHERE external_id = ?');
    return stmt.get(externalId);
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
    const query = `UPDATE concerts SET ${updates.join(', ')}, last_updated = CURRENT_TIMESTAMP WHERE id = ?`;
    
    try {
      const stmt = db.prepare(query);
      stmt.run(...values);
      return this.findById(id);
    } catch (error) {
      throw new Error('Update failed: ' + error.message);
    }
  }

  static getUpcomingConcerts(limit = 50) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT c.*, a.name as artist_name FROM concerts c
      JOIN artists a ON c.artist_id = a.id
      WHERE c.event_date > CURRENT_TIMESTAMP
      ORDER BY c.event_date ASC
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  static getConcertsByArtist(artistId) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM concerts 
      WHERE artist_id = ? AND event_date > CURRENT_TIMESTAMP
      ORDER BY event_date ASC
    `);
    return stmt.all(artistId);
  }

  static getConcertsNearUser(userId, radiusKm = 100) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT c.*, a.name as artist_name FROM concerts c
      JOIN artists a ON c.artist_id = a.id
      JOIN users u ON u.id = ?
      WHERE c.event_date > CURRENT_TIMESTAMP
      AND (
        (6371 * acos(cos(radians(u.latitude)) * cos(radians(c.latitude)) * 
         cos(radians(c.longitude) - radians(u.longitude)) + 
         sin(radians(u.latitude)) * sin(radians(c.latitude)))) < ?
        OR c.country = u.country
      )
      ORDER BY c.event_date ASC
    `);
    return stmt.all(userId, radiusKm);
  }

  static deletePastConcerts() {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM concerts WHERE event_date < CURRENT_TIMESTAMP');
    const result = stmt.run();
    return result.changes;
  }
}

module.exports = Concert;
