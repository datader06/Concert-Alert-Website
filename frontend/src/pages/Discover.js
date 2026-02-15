import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages.css';
import ArtistCard from '../components/ArtistCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { artistService } from '../services/api';

const Discover = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSearched, setLastSearched] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setLastSearched(searchQuery);
    try {
      console.log('Searching for:', searchQuery);
      const result = await artistService.searchArtists(searchQuery);
      console.log('Search result:', result);

      if (result.ok && result.data) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching artists:', error);
      setSearchResults([]);
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
      console.log('Toggling favorite:', id);
      await artistService.addFavorite(id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="discover-page">
      <h1>🔍 Discover Artists</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for artists (e.g., Taylor Swift, Drake)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn-search">
          Search
        </button>
      </form>

      {loading ? (
        <div className="artists-grid">
          <SkeletonLoader type="artist-card" count={6} />
        </div>
      ) : searchResults.length > 0 ? (
        <div className="artists-grid">
          {searchResults.map(artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onArtistClick={handleArtistClick}
              onFavoriteClick={handleFavoriteToggle}
              isFavorited={false}
            />
          ))}
        </div>
      ) : lastSearched ? (
        <EmptyState
          icon="🔍"
          title="No artists found"
          message={`No results for "${lastSearched}". Try searching for popular artists like Taylor Swift, Drake, or Ariana Grande.`}
        />
      ) : (
        <EmptyState
          icon="🎵"
          title="Start discovering"
          message="Search for your favorite artists above!"
        />
      )}
    </div>
  );
};

export default Discover;
