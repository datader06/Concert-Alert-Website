import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import ConcertCard from '../components/ConcertCard';
import { concertService } from '../services/api';

const Concerts = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConcerts();
  }, []);

  const loadConcerts = async () => {
    setLoading(true);
    try {
      const result = await concertService.getUpcomingConcerts(50);
      if (result.ok && result.data) {
        // API now returns {concerts: [...], count: N}
        const concertsData = result.data.concerts || result.data;
        setConcerts(concertsData);
      } else {
        // Fallback to placeholder if API fails
        setConcerts([
          {
            id: 1,
            artist_name: 'The Weeknd',
            event_name: 'After Hours Tour',
            venue_name: 'Madison Square Garden',
            city: 'New York',
            country: 'United States',
            event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            ticket_url: '#'
          },
          {
            id: 2,
            artist_name: 'Taylor Swift',
            event_name: 'Eras Tour',
            venue_name: 'SoFi Stadium',
            city: 'Inglewood',
            country: 'United States',
            event_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            ticket_url: '#'
          },
          {
            id: 3,
            artist_name: 'Drake',
            event_name: 'Scorpion Tour',
            venue_name: 'Air Canada Centre',
            city: 'Toronto',
            country: 'Canada',
            event_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            ticket_url: '#'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading concerts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="concerts-page">
      <h1>🎪 Upcoming Concerts</h1>

      {loading ? (
        <div className="loading">Loading concerts...</div>
      ) : concerts.length === 0 ? (
        <div className="empty-state">
          <p>No concerts found</p>
        </div>
      ) : (
        <div className="concerts-list">
          {concerts.map(concert => (
            <ConcertCard
              key={concert.id}
              concert={concert}
              onClickDetails={(id) => {
                console.log('View concert details:', id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Concerts;
