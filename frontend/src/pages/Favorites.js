import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import ArtistCard from '../components/ArtistCard';
import { artistService } from '../services/api';

const Favorites = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const result = await artistService.getUserFavorites();
      if (result.ok && result.data) {
        setArtists(result.data);
      } else {
        setArtists([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="favorites-page">
      <h1>❤️ My Favorite Artists</h1>

      {loading ? (
        <div className="loading">Loading favorites...</div>
      ) : artists.length === 0 ? (
        <div className="empty-state">
          <p>You haven't added any favorite artists yet!</p>
          <a href="/discover" className="btn-primary">
            Discover Artists
          </a>
        </div>
      ) : (
        <div className="artists-grid">
          {artists.map(artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onArtistClick={(id) => {
                console.log('View artist:', id);
              }}
              onFavoriteClick={(id) => {
                console.log('Toggle favorite:', id);
              }}
              isFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
