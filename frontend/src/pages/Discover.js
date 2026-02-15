import React, { useState } from 'react';
import '../styles/Pages.css';
import ArtistCard from '../components/ArtistCard';
import { artistService } from '../services/api';

const Discover = () => {
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
      const result = await artistService.searchArtists(searchQuery);
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

  return (
    <div className="discover-page">
      <h1>🔍 Discover Artists</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for artists, genres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn-search">
          Search
        </button>
      </form>

      {loading ? (
        <div className="loading">Searching...</div>
      ) : searchResults.length > 0 ? (
        <div className="artists-grid">
          {searchResults.map(artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onArtistClick={(id) => {
                console.log('View artist:', id);
              }}
              onFavoriteClick={(id) => {
                console.log('Toggle favorite:', id);
              }}
              isFavorited={false}
            />
          ))}
        </div>
      ) : lastSearched ? (
        <div className="empty-state">
          <p>No artists found for "{lastSearched}"</p>
        </div>
      ) : (
        <div className="empty-state">
          <p>Start typing to search for artists!</p>
        </div>
      )}
    </div>
  );
};

export default Discover;
