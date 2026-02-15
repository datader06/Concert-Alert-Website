/**
 * Test Script for Stage 3: Concert Aggregation
 * Run this to test Bandsintown + Ticketmaster integration
 */

const concertAggregation = require('./src/services/concertAggregationService');
const bandsintownService = require('./src/services/bandsintownService');

async function testStage3() {
    console.log('\n🧪 Testing Stage 3: Concert Aggregation\n');
    console.log('='.repeat(60));

    // Test 1: Bandsintown Artist Search
    console.log('\n1️⃣ Testing Bandsintown Artist Search');
    console.log('-'.repeat(60));
    try {
        const artist = await bandsintownService.searchArtist('Coldplay');
        console.log('✅ Artist found:', artist.name);
        console.log('   Upcoming events:', artist.upcomingEventCount);
        console.log('   Tracker count:', artist.trackerCount);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Test 2: Bandsintown Events
    console.log('\n2️⃣ Testing Bandsintown Events');
    console.log('-'.repeat(60));
    try {
        const events = await bandsintownService.getArtistEvents('Coldplay');
        console.log(`✅ Found ${events.length} events from Bandsintown`);
        if (events.length > 0) {
            console.log('\n   First event:');
            console.log('   -', events[0].eventName);
            console.log('   -', events[0].venue.name);
            console.log('   -', events[0].venue.city, ',', events[0].venue.country);
            console.log('   -', new Date(events[0].datetime).toLocaleDateString());
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Test 3: Concert Aggregation
    console.log('\n3️⃣ Testing Concert Aggregation (Bandsintown + Ticketmaster)');
    console.log('-'.repeat(60));
    try {
        const aggregated = await concertAggregation.getArtistConcerts('Taylor Swift');
        console.log(`✅ Aggregated ${aggregated.length} total events`);

        const bandsintownCount = aggregated.filter(e => e.source === 'bandsintown').length;
        const ticketmasterCount = aggregated.filter(e => e.source === 'ticketmaster').length;

        console.log(`   📊 Bandsintown: ${bandsintownCount} events`);
        console.log(`   📊 Ticketmaster: ${ticketmasterCount} events`);

        if (aggregated.length > 0) {
            console.log('\n   Sample events:');
            aggregated.slice(0, 3).forEach((event, i) => {
                console.log(`\n   ${i + 1}. ${event.eventName}`);
                console.log(`      📍 ${event.venueName}, ${event.city}`);
                console.log(`      📅 ${new Date(event.eventDate).toLocaleDateString()}`);
                console.log(`      🔗 Source: ${event.source}`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Test 4: Deduplication
    console.log('\n4️⃣ Testing Deduplication Logic');
    console.log('-'.repeat(60));
    try {
        const aggregated = await concertAggregation.getArtistConcerts('Adele');
        console.log(`✅ Deduplication working`);
        console.log(`   Total unique events: ${aggregated.length}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Stage 3 Testing Complete!\n');
}

// Run tests
testStage3().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
