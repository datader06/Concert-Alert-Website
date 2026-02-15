const { getDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(email, password, username, city = null, country = null) {
    const db = getDatabase();
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    try {
      const stmt = db.prepare(`
        INSERT INTO users (email, password, username, city, country)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(email, hashedPassword, username, city, country);
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      throw new Error('User creation failed: ' + error.message);
    }
  }

  static findById(id) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByEmail(email) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findByUsername(username) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
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
    const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    try {
      const stmt = db.prepare(query);
      stmt.run(...values);
      return this.findById(id);
    } catch (error) {
      throw new Error('Update failed: ' + error.message);
    }
  }

  static getAllUsers() {
    const db = getDatabase();
    const stmt = db.prepare('SELECT id, email, username, city, country, created_at FROM users');
    return stmt.all();
  }

  static verifyPassword(user, plainPassword) {
    return bcrypt.compareSync(plainPassword, user.password);
  }

  static addFavoriteArtist(userId, artistId) {
    const db = getDatabase();
    try {
      const stmt = db.prepare(`
        INSERT INTO user_artists (user_id, artist_id)
        VALUES (?, ?)
      `);
      stmt.run(userId, artistId);
      return true;
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        return false; // Already followed
      }
      throw error;
    }
  }

  static removeFavoriteArtist(userId, artistId) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM user_artists WHERE user_id = ? AND artist_id = ?');
    const result = stmt.run(userId, artistId);
    return result.changes > 0;
  }

  static getFavoriteArtists(userId) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT a.* FROM artists a
      JOIN user_artists ua ON a.id = ua.artist_id
      WHERE ua.user_id = ?
      ORDER BY ua.followed_at DESC
    `);
    return stmt.all(userId);
  }
}

module.exports = User;
