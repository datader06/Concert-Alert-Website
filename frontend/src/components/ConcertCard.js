import React from 'react';
import '../styles/ConcertCard.css';

const ConcertCard = ({ concert, onClickDetails }) => {
  const eventDate = new Date(concert.event_date);

  return (
    <div className="concert-card" onClick={() => onClickDetails(concert.id)}>
      <div className="concert-header">
        <h3 className="concert-artist">{concert.artist_name || concert.event_name}</h3>
      </div>

      <div className="concert-details">
        <div className="concert-venue">
          <span className="label">📍 Venue:</span>
          <span className="value">{concert.venue_name}</span>
        </div>

        <div className="concert-location">
          <span className="label">🌍 Location:</span>
          <span className="value">
            {concert.city}, {concert.country}
          </span>
        </div>

        <div className="concert-date">
          <span className="label">📅 Date:</span>
          <span className="value">{eventDate.toLocaleDateString()}</span>
        </div>

        <div className="concert-time">
          <span className="label">🕐 Time:</span>
          <span className="value">{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <a
        href={concert.ticket_url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-tickets"
        onClick={(e) => e.stopPropagation()}
      >
        Get Tickets
      </a>
    </div>
  );
};

export default ConcertCard;
