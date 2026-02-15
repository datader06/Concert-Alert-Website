/**
 * Test Script for Songkick Integration
 * Tests if Songkick API works without a key
 */

const songkickService = require('./src/services/songkickService');
const concertAggregation = require('./src/services/concertAggregationService');

async function testSongkick() {
    console.log('\n🧪 Testing Songkick Integration\n');
    console.log('='.repeat(60));

    // Test 1: Songkick Artist Search
    console.log('\n1️⃣ Testing Songkick Artist Search');
    console.log('-'.repeat(60));
    try {
        const artist = await songkickService.searchArtist('Coldplay');
        console.log('✅ Artist found:', artist.name);
        console.log('   Artist ID:', artist.id);
        console.log('   On tour until:', artist.onTourUntil || 'Not specified');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n⚠️  Songkick requires an API key!');
        console.log('   Get one from: https://www.songkick.com/api_key_requests/new');
        console.log('\n   For now, falling back to Ticketmaster only...\n');
        return false;
    }

    // Test 2: Songkick Events
    console.log('\n2️⃣ Testing Songkick Events');
    console.log('-'.repeat(60));
    try {
        const events = await songkickService.getArtistEvents('Coldplay');
        console.log(`✅ Found ${events.length} events from Songkick`);
        if (events.length > 0) {
            console.log('\n   First event:');
            console.log('   -', events[0].eventName);
            console.log('   -', events[0].venue.name);
            console.log('   -', events[0].venue.city, ',', events[0].venue.country);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Test 3: Concert Aggregation
    console.log('\n3️⃣ Testing Concert Aggregation (Songkick + Ticketmaster)');
    console.log('-'.repeat(60));
    try {
        const aggregated = await concertAggregation.getArtistConcerts('Taylor Swift');
        console.log(`✅ Aggregated ${aggregated.length} total events`);

        const songkickCount = aggregated.filter(e => e.source === 'songkick').length;
        const ticketmasterCount = aggregated.filter(e => e.source === 'ticketmaster').length;

        console.log(`   📊 Songkick: ${songkickCount} events`);
        console.log(`   📊 Ticketmaster: ${ticketmasterCount} events`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Songkick Testing Complete!\n');
    return true;
}

// Run tests
testSongkick().then(success => {
    if (!success) {
        console.log('💡 Recommendation: Use Ticketmaster only for now');
        console.log('   Your system will work with just Ticketmaster!\n');
    }
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
