import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Pages.css';
import ArtistCard from '../components/ArtistCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { artistService } from '../services/api';

const Discover = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSearched, setLastSearched] = useState('');

  // Handle incoming search from Navbar
  useEffect(() => {
    if (location.state?.searchQuery) {
      const query = location.state.searchQuery;
      setSearchQuery(query);
      setLastSearched(query);
      performSearch(query);
      // Clear state so it doesn't persist on refresh/back if undesired,
      // but usually keeping it is fine.
      // navigate(location.pathname, { replace: true, state: {} });
    } else {
      // Only load recommendations if NO search query
      loadRecommendations();
    }
  }, [location.state]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      console.log('Searching for:', query);
      const result = await artistService.searchArtists(query);
      if (result.ok && result.data) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Use the trending endpoint as default discovery
      const result = await artistService.getTrendingArtists();
      if (result.ok && result.data) {
        setSearchResults(result.data);
      }
    } catch (error) {
      console.error("Error loading recommendations", error);
    } finally {
      setLoading(false);
    }
  };

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
      // We don't check isFavorited state here easily without complex state management,
      // but api.js now handles the toggle (add/remove) via localStorage or API
      await artistService.addFavorite(id);
      // Optional: Add toast or visual feedback here
      alert("Added to favorites!");
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

      {!loading && !lastSearched && searchResults.length > 0 && (
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Recommended for You</h2>
      )}

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
              isFavorited={false} // Would need real state check here
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
