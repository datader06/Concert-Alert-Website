const { getDatabase } = require('../config/database');

class Notification {
  static create(userId, concertId, message) {
    const db = getDatabase();
    
    try {
      const stmt = db.prepare(`
        INSERT INTO notifications (user_id, concert_id, message, type)
        VALUES (?, ?, ?, 'concert_alert')
      `);
      
      const result = stmt.run(userId, concertId, message);
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      throw new Error('Notification creation failed: ' + error.message);
    }
  }

  static findById(id) {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM notifications WHERE id = ?');
    return stmt.get(id);
  }

  static getUserNotifications(userId, limit = 50) {
    const db = getDatabase();
    const stmt = db.prepare(`
        SELECT n.*, a.name as artist_name, c.event_name, c.event_date 
        FROM notifications n
        JOIN concerts c ON n.concert_id = c.id
        JOIN artists a ON c.artist_id = a.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
        LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static getUnreadNotifications(userId) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT n.*, c.event_name, a.name as artist_name FROM notifications n
      JOIN concerts c ON n.concert_id = c.id
      JOIN artists a ON c.artist_id = a.id
      WHERE n.user_id = ? AND n.is_read = 0
      ORDER BY n.created_at DESC
    `);
    return stmt.all(userId);
  }

  static markAsRead(notificationId) {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?');
    const result = stmt.run(notificationId);
    return result.changes > 0;
  }

  static markAllAsRead(userId) {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?');
    const result = stmt.run(userId);
    return result.changes;
  }

  static delete(notificationId) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    const result = stmt.run(notificationId);
    return result.changes > 0;
  }

  static addToConcertCache(userId, concertId) {
    const db = getDatabase();
    try {
      const stmt = db.prepare(`
        INSERT INTO concert_cache (user_id, concert_id)
        VALUES (?, ?)
      `);
      stmt.run(userId, concertId);
      return true;
    } catch (error) {
      // Already notified
      return false;
    }
  }

  static isUserNotifiedForConcert(userId, concertId) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM concert_cache
      WHERE user_id = ? AND concert_id = ?
    `);
    const result = stmt.get(userId, concertId);
    return result.count > 0;
  }
}

module.exports = Notification;
