import React from 'react';
import '../styles/ArtistCard.css';

const ArtistCard = ({ artist, onArtistClick, onFavoriteClick, isFavorited }) => {
  return (
    <div className="artist-card">
      <div className="artist-image">
        {artist.image_url ? (
          <img src={artist.image_url} alt={artist.name} />
        ) : (
          <div className="artist-image-placeholder">🎤</div>
        )}
      </div>
      <div className="artist-info">
        <h3 className="artist-name">{artist.name}</h3>
        {artist.genre && <p className="artist-genre">{artist.genre}</p>}
        {artist.listeners && (
          <p className="artist-listeners">
            {(artist.listeners / 1000000).toFixed(1)}M listeners
          </p>
        )}
      </div>
      <div className="artist-actions">
        <button
          className="btn-view"
          onClick={() => onArtistClick(artist.id)}
        >
          View
        </button>
        <button
          className={`btn-favorite ${isFavorited ? 'favorited' : ''}`}
          onClick={() => onFavoriteClick(artist.id)}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
