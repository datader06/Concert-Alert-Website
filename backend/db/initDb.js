const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create db directory if it doesn't exist
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(__dirname, 'spotify_clone.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Initializing database...');

// Create tables
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    city TEXT,
    country TEXT,
    profile_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Artists table
  CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lastfm_id TEXT UNIQUE,
    name TEXT NOT NULL,
    genre TEXT,
    bio TEXT,
    image_url TEXT,
    listener_count INTEGER,
    play_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- User-Artist relationships (favorites/follows)
  CREATE TABLE IF NOT EXISTS user_artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    followed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    UNIQUE(user_id, artist_id)
  );

  -- Listening history
  CREATE TABLE IF NOT EXISTS listening_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    track_name TEXT,
    album_name TEXT,
    listened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
  );

  -- Concerts/Events
  CREATE TABLE IF NOT EXISTS concerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE,
    artist_id INTEGER NOT NULL,
    event_name TEXT NOT NULL,
    venue_name TEXT,
    city TEXT,
    country TEXT,
    latitude REAL,
    longitude REAL,
    event_date DATETIME,
    ticket_url TEXT,
    source TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
  );

  -- Notifications
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    concert_id INTEGER NOT NULL,
    type TEXT DEFAULT 'concert_alert',
    message TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (concert_id) REFERENCES concerts(id) ON DELETE CASCADE
  );

  -- Concert cache (to avoid duplicate alerts)
  CREATE TABLE IF NOT EXISTS concert_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    concert_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    notified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (concert_id) REFERENCES concerts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(concert_id, user_id)
  );

  -- Notification preferences
  CREATE TABLE IF NOT EXISTS notification_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    email_alerts BOOLEAN DEFAULT 1,
    in_app_alerts BOOLEAN DEFAULT 1,
    distance_radius_km INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_user_artists_user_id ON user_artists(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_artists_artist_id ON user_artists(artist_id);
  CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
  CREATE INDEX IF NOT EXISTS idx_listening_history_artist_id ON listening_history(artist_id);
  CREATE INDEX IF NOT EXISTS idx_concerts_artist_id ON concerts(artist_id);
  CREATE INDEX IF NOT EXISTS idx_concerts_event_date ON concerts(event_date);
  CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
`);

console.log('✅ Database initialization complete!');
console.log(`📁 Database file created at: ${dbPath}`);

db.close();
