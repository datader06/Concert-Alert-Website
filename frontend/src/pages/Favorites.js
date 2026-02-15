import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages.css';
import ArtistCard from '../components/ArtistCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { artistService } from '../services/api';

const Favorites = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const result = await artistService.getUserFavorites();
      console.log('Favorites result:', result);
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

  const handleArtistClick = (id) => {
    console.log('Navigating to artist:', id);
    navigate(`/artist/${id}`);
  };

  const handleFavoriteToggle = async (id) => {
    try {
      console.log('Removing favorite:', id);
      await artistService.removeFavorite(id);
      // Reload favorites after removing
      loadFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="favorites-page">
      <h1>❤️ My Favorite Artists</h1>

      {loading ? (
        <div className="artists-grid">
          <SkeletonLoader type="artist-card" count={6} />
        </div>
      ) : artists.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="No favorite artists yet"
          message="Start adding artists to your favorites to see them here!"
        />
      ) : (
        <div className="artists-grid">
          {artists.map(artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onArtistClick={handleArtistClick}
              onFavoriteClick={handleFavoriteToggle}
              isFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
