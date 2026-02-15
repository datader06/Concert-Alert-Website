/**
 * Add Sample Data (Artists + Concerts)
 * Run this to populate the database with test data
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'spotify_clone.db');
const db = new Database(dbPath);

console.log('📊 Adding sample data...\n');

try {
    // Step 1: Add Artists First
    console.log('1️⃣ Adding artists...');

    const artists = [
        { lastfm_id: 'ts001', name: 'Taylor Swift', genre: 'Pop', listener_count: 95000000 },
        { lastfm_id: 'ad001', name: 'Adele', genre: 'Pop/Soul', listener_count: 50000000 },
        { lastfm_id: 'cp001', name: 'Coldplay', genre: 'Alternative Rock', listener_count: 45000000 },
        { lastfm_id: 'by001', name: 'Beyoncé', genre: 'R&B/Pop', listener_count: 40000000 },
        { lastfm_id: 'rh001', name: 'Rihanna', genre: 'Pop/R&B', listener_count: 38000000 }
    ];

    const insertArtist = db.prepare(`
        INSERT OR IGNORE INTO artists (lastfm_id, name, genre, listener_count)
        VALUES (@lastfm_id, @name, @genre, @listener_count)
    `);

    for (const artist of artists) {
        insertArtist.run(artist);
        console.log(`   ✅ Added artist: ${artist.name}`);
    }

    // Step 2: Get Artist IDs
    console.log('\n2️⃣ Getting artist IDs...');
    const artistIds = {};
    for (const artist of artists) {
        const row = db.prepare('SELECT id FROM artists WHERE lastfm_id = ?').get(artist.lastfm_id);
        if (row) {
            artistIds[artist.name] = row.id;
            console.log(`   📌 ${artist.name}: ID ${row.id}`);
        }
    }

    // Step 3: Add Concerts
    console.log('\n3️⃣ Adding concerts...');

    const concerts = [
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
            ticket_url: 'https://www.ticketmaster.com/taylor-swift',
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
            ticket_url: 'https://www.ticketmaster.com/adele',
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
            ticket_url: 'https://www.ticketmaster.com/coldplay',
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
            ticket_url: 'https://www.ticketmaster.com/beyonce',
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
            ticket_url: 'https://www.ticketmaster.com/rihanna',
            source: 'ticketmaster'
        }
    ];

    const insertConcert = db.prepare(`
        INSERT OR IGNORE INTO concerts (
            external_id, artist_id, event_name, venue_name,
            city, country, latitude, longitude,
            event_date, ticket_url, source
        ) VALUES (
            @external_id, @artist_id, @event_name, @venue_name,
            @city, @country, @latitude, @longitude,
            @event_date, @ticket_url, @source
        )
    `);

    let concertsAdded = 0;
    for (const concert of concerts) {
        const artistId = artistIds[concert.artist_name];
        if (artistId) {
            insertConcert.run({
                ...concert,
                artist_id: artistId
            });
            console.log(`   ✅ Added: ${concert.event_name} - ${concert.city}`);
            concertsAdded++;
        } else {
            console.log(`   ⚠️  Skipped ${concert.event_name}: Artist not found`);
        }
    }

    // Verify
    console.log('\n4️⃣ Verification:');
    const artistCount = db.prepare('SELECT COUNT(*) as count FROM artists').get();
    const concertCount = db.prepare('SELECT COUNT(*) as count FROM concerts').get();

    console.log(`   📊 Total artists: ${artistCount.count}`);
    console.log(`   📊 Total concerts: ${concertCount.count}`);

    console.log('\n🎉 Sample data added successfully!\n');

    db.close();

} catch (error) {
    console.error('❌ Error:', error.message);
    db.close();
    process.exit(1);
}
