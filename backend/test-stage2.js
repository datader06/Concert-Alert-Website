/**
 * Test Script for Stage 2: Albums Service
 * Run this after starting the backend server
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('\n🧪 Testing Stage 2: Albums Service Endpoints\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Artist Resolution
        console.log('\n1️⃣ Testing Artist Resolution');
        console.log('GET /api/artists/resolve?name=Taylor Swift');
        const resolveRes = await axios.get(`${API_BASE}/artists/resolve?name=Taylor Swift`);
        console.log('✅ Status:', resolveRes.status);
        console.log('   Artist:', resolveRes.data.name);
        console.log('   Spotify ID:', resolveRes.data.spotifyId);
        console.log('   MBID:', resolveRes.data.mbid);

        const spotifyId = resolveRes.data.spotifyId;

        // Test 2: Artist Albums
        console.log('\n2️⃣ Testing Artist Albums');
        console.log(`GET /api/artists/${spotifyId}/albums?types=album&limit=5`);
        const albumsRes = await axios.get(`${API_BASE}/artists/${spotifyId}/albums?types=album&limit=5`);
        console.log('✅ Status:', albumsRes.status);
        console.log('   Total Albums:', albumsRes.data.total);
        if (albumsRes.data.albums.length > 0) {
            console.log('   First Album:', albumsRes.data.albums[0].name);
            console.log('   Release Date:', albumsRes.data.albums[0].releaseDate);
        }

        // Test 3: Latest Releases
        console.log('\n3️⃣ Testing Latest Releases');
        console.log(`GET /api/artists/${spotifyId}/latest-releases`);
        const latestRes = await axios.get(`${API_BASE}/artists/${spotifyId}/latest-releases`);
        console.log('✅ Status:', latestRes.status);
        console.log('   Recent Releases:', latestRes.data.total);
        if (latestRes.data.releases.length > 0) {
            console.log('   Latest:', latestRes.data.releases[0].name);
            console.log('   Date:', latestRes.data.releases[0].releaseDate);
        }

        // Test 4: Album Search
        console.log('\n4️⃣ Testing Album Search');
        console.log('GET /api/albums/search?q=1989&limit=5');
        const searchRes = await axios.get(`${API_BASE}/albums/search?q=1989&limit=5`);
        console.log('✅ Status:', searchRes.status);
        console.log('   Results Found:', searchRes.data.total);
        if (searchRes.data.albums.length > 0) {
            console.log('   First Result:', searchRes.data.albums[0].name);
            console.log('   Artist:', searchRes.data.albums[0].artists[0].name);
        }

        // Test 5: New Releases
        console.log('\n5️⃣ Testing New Releases');
        console.log('GET /api/albums/new-releases?limit=5');
        const newReleasesRes = await axios.get(`${API_BASE}/albums/new-releases?limit=5`);
        console.log('✅ Status:', newReleasesRes.status);
        console.log('   New Releases:', newReleasesRes.data.total);
        if (newReleasesRes.data.releases.length > 0) {
            console.log('   Latest:', newReleasesRes.data.releases[0].name);
            console.log('   Artist:', newReleasesRes.data.releases[0].artists[0].name);
        }

        // Test 6: Get Album Details
        if (searchRes.data.albums.length > 0) {
            const albumId = searchRes.data.albums[0].id;
            console.log('\n6️⃣ Testing Album Details');
            console.log(`GET /api/albums/${albumId}`);
            const albumRes = await axios.get(`${API_BASE}/albums/${albumId}`);
            console.log('✅ Status:', albumRes.status);
            console.log('   Album:', albumRes.data.name);
            console.log('   Tracks:', albumRes.data.totalTracks);
            console.log('   Label:', albumRes.data.label);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ All Stage 2 endpoints working correctly!');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ Test Failed:');
        console.error('   Endpoint:', error.config?.url);
        console.error('   Error:', error.response?.data || error.message);
        console.log('\n' + '='.repeat(60) + '\n');
        process.exit(1);
    }
}

// Run tests
console.log('⏳ Waiting for server to be ready...');
setTimeout(() => {
    testEndpoints().then(() => {
        console.log('✨ Stage 2 Implementation Complete!\n');
        process.exit(0);
    });
}, 2000);
