const cron = require('node-cron');
const Artist = require('../models/Artist');
const Concert = require('../models/Concert');
const User = require('../models/User');
const Notification = require('../models/Notification');
const concertAggregation = require('../services/concertAggregationService');

// Run every 6 hours to check for new concerts (0, 6, 12, 18 hours)
const concertAlertCronJob = cron.schedule('0 */6 * * *', async () => {
  console.log('🎤 Running concert alert cron job at', new Date().toISOString());

  try {
    // Get all users with favorite artists
    const users = User.getAllUsers();
    let totalNotifications = 0;

    for (const user of users) {
      const favoriteArtists = User.getFavoriteArtists(user.id);

      for (const artist of favoriteArtists) {
        try {
          // Use aggregation service to get concerts from all sources
          console.log(`🔍 Checking concerts for ${artist.name}...`);
          const newEvents = await concertAggregation.getArtistConcerts(artist.name);

          for (const event of newEvents) {
            try {
              // Create or update concert
              let concert = Concert.findByExternalId(event.externalId);

              if (!concert) {
                concert = Concert.create(
                  event.externalId,
                  artist.id,
                  event.eventName,
                  event
                );
                console.log(`  ✨ New concert added: ${event.eventName}`);
              }

              // Check if user already notified for this concert
              const alreadyNotified = Notification.isUserNotifiedForConcert(
                user.id,
                concert.id
              );

              if (!alreadyNotified) {
                // Create notification
                const message = `${artist.name} is performing at ${event.venueName} on ${new Date(
                  event.eventDate
                ).toLocaleDateString()}`;

                Notification.create(user.id, concert.id, message);
                Notification.addToConcertCache(user.id, concert.id);
                totalNotifications++;

                console.log(
                  `  ✅ Notification created for ${user.email}: ${artist.name} concert`
                );
              }
            } catch (eventError) {
              console.error(`  ❌ Error processing event for ${artist.name}:`, eventError.message);
            }
          }
        } catch (artistError) {
          console.error(`❌ Error fetching concerts for ${artist.name}:`, artistError.message);
        }
      }
    }

    // Clean up past concerts
    const deletedCount = Concert.deletePastConcerts();
    console.log(`🗑️  Deleted ${deletedCount} past concerts`);
    console.log(`📬 Created ${totalNotifications} new notifications`);
  } catch (error) {
    console.error('❌ Error in concert alert cron job:', error.message);
  }
});

// Run every day at 2 AM to clear cache for old notifications (prevent memory leak)
const cacheCleanupJob = cron.schedule('0 2 * * *', () => {
  console.log('🧹 Running cache cleanup job at', new Date().toISOString());
  // In a real app, would clean up old entries from concert_cache table
  // For now, this is a placeholder
});

function startCronJobs() {
  console.log('⏰ Cron jobs initialized');
  console.log('   - Concert alert check: Every 6 hours');
  console.log('   - Cache cleanup: Every day at 2 AM');
}

function stopCronJobs() {
  concertAlertCronJob.stop();
  cacheCleanupJob.stop();
  console.log('⏹️  Cron jobs stopped');
}

module.exports = {
  startCronJobs,
  stopCronJobs
};
