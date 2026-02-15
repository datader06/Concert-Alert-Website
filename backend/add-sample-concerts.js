/**
 * Add Sample Concert Data
 * Run this to populate the concerts database with test data
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'spotify_clone.db');
const db = new Database(dbPath);

console.log('📊 Adding sample concert data...\n');

// Sample concerts for testing (without artist_id since artists table is empty)
const sampleConcerts = [
    {
        external_id: 'TM001',
        artist_name: 'Taylor Swift',
        event_name: 'Taylor Swift - The Eras Tour',
        venue_name: 'SoFi Stadium',
        city: 'Inglewood',
        country: 'United States',
        latitude: 33.9534,
        longitude: -118.3390,
        event_date: '2026-06-15',
        ticket_url: 'https://www.ticketmaster.com/taylor-swift-tickets/artist/1234',
        source: 'ticketmaster'
    },
    {
        external_id: 'TM002',
        artist_name: 'Adele',
        event_name: 'Adele Live 2026',
        venue_name: 'Madison Square Garden',
        city: 'New York',
        country: 'United States',
        latitude: 40.7505,
        longitude: -73.9934,
        event_date: '2026-07-20',
        ticket_url: 'https://www.ticketmaster.com/adele-tickets/artist/5678',
        source: 'ticketmaster'
    },
    {
        external_id: 'TM003',
        artist_name: 'Coldplay',
        event_name: 'Coldplay - Music of the Spheres',
        venue_name: 'Wembley Stadium',
        city: 'London',
        country: 'United Kingdom',
        latitude: 51.5560,
        longitude: -0.2795,
        event_date: '2026-08-10',
        ticket_url: 'https://www.ticketmaster.com/coldplay-tickets/artist/9012',
        source: 'ticketmaster'
    },
    {
        external_id: 'TM004',
        artist_name: 'Beyoncé',
        event_name: 'Beyoncé - Renaissance World Tour',
        venue_name: 'MetLife Stadium',
        city: 'East Rutherford',
        country: 'United States',
        latitude: 40.8128,
        longitude: -74.0742,
        event_date: '2026-09-05',
        ticket_url: 'https://www.ticketmaster.com/beyonce-tickets/artist/3456',
        source: 'ticketmaster'
    },
    {
        external_id: 'TM005',
        artist_name: 'Rihanna',
        event_name: 'Rihanna - Anti World Tour',
        venue_name: 'Rogers Centre',
        city: 'Toronto',
        country: 'Canada',
        latitude: 43.6426,
        longitude: -79.3892,
        event_date: '2026-10-12',
        ticket_url: 'https://www.ticketmaster.com/rihanna-tickets/artist/7890',
        source: 'ticketmaster'
    }
];

try {
    // First, check if concerts table exists
    const tableExists = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='concerts'
    `).get();

    if (!tableExists) {
        console.log('❌ Concerts table does not exist. Run initDb.js first!');
        process.exit(1);
    }

    // Clear existing concerts (optional)
    const clearStmt = db.prepare('DELETE FROM concerts');
    const cleared = clearStmt.run();
    console.log(`🗑️  Cleared ${cleared.changes} existing concerts\n`);

    // Insert sample concerts
    const insertStmt = db.prepare(`
        INSERT INTO concerts (
            external_id, artist_name, event_name, venue_name, 
            city, country, latitude, longitude, 
            event_date, ticket_url, source
        ) VALUES (
            @external_id, @artist_name, @event_name, @venue_name,
            @city, @country, @latitude, @longitude,
            @event_date, @ticket_url, @source
        )
    `);

    let inserted = 0;
    for (const concert of sampleConcerts) {
        try {
            insertStmt.run(concert);
            inserted++;
            console.log(`✅ Added: ${concert.event_name} - ${concert.city}`);
        } catch (error) {
            console.error(`❌ Failed to add ${concert.event_name}:`, error.message);
        }
    }

    console.log(`\n🎉 Successfully added ${inserted} concerts!\n`);

    // Verify
    const count = db.prepare('SELECT COUNT(*) as count FROM concerts').get();
    console.log(`📊 Total concerts in database: ${count.count}\n`);

    db.close();

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
