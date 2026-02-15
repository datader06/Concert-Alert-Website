import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import '../styles/Concerts.css';
import ConcertCard from '../components/ConcertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { concertService } from '../services/api';

const Concerts = () => {
  const [allConcerts, setAllConcerts] = useState([]);
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, artist, location
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    loadConcerts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortBy, filterLocation, allConcerts]);

  const loadConcerts = async () => {
    setLoading(true);
    try {
      const result = await concertService.getUpcomingConcerts(50);
      if (result.ok && result.data) {
        const concertsData = result.data.concerts || result.data;
        setAllConcerts(concertsData);
      } else {
        setAllConcerts([]);
      }
    } catch (error) {
      console.error('Error loading concerts:', error);
      setAllConcerts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...allConcerts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(concert =>
        concert.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concert.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concert.venue_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concert.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply location filter
    if (filterLocation !== 'all') {
      filtered = filtered.filter(concert =>
        concert.country?.toLowerCase() === filterLocation.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.event_date) - new Date(b.event_date);
        case 'artist':
          return (a.artist_name || '').localeCompare(b.artist_name || '');
        case 'location':
          return (a.city || '').localeCompare(b.city || '');
        default:
          return 0;
      }
    });

    setFilteredConcerts(filtered);
  };

  const getUniqueCountries = () => {
    const countries = [...new Set(allConcerts.map(c => c.country).filter(Boolean))];
    return countries.sort();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('date');
    setFilterLocation('all');
  };

  return (
    <div className="concerts-page">
      <div className="concerts-header">
        <h1>🎪 Upcoming Concerts</h1>
        <p className="concerts-subtitle">
          Discover live music events from your favorite artists
        </p>
      </div>

      {/* Search and Filters */}
      <div className="concerts-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by artist, venue, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Date</option>
              <option value="artist">Artist</option>
              <option value="location">Location</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location:</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Countries</option>
              {getUniqueCountries().map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || sortBy !== 'date' || filterLocation !== 'all') && (
            <button
              className="btn-clear-filters"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="concerts-count">
          Showing {filteredConcerts.length} of {allConcerts.length} concerts
        </div>
      </div>

      {/* Concerts List */}
      {loading ? (
        <div className="concerts-loading">
          <LoadingSpinner />
          <p>Loading concerts...</p>
        </div>
      ) : filteredConcerts.length === 0 ? (
        <div className="empty-state">
          {allConcerts.length === 0 ? (
            <>
              <div className="empty-icon">🎤</div>
              <h2>No Concerts Found</h2>
              <p>Check back later for upcoming concerts!</p>
            </>
          ) : (
            <>
              <div className="empty-icon">🔍</div>
              <h2>No Results</h2>
              <p>Try adjusting your search or filters</p>
              <button className="btn-clear-filters" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="concerts-list">
          {filteredConcerts.map(concert => (
            <ConcertCard
              key={concert.id || concert.external_id}
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
