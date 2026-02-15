import React, { useState, useEffect } from 'react';
import '../styles/Albums.css';
import AlbumCard from '../components/AlbumCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { artistService } from '../services/api';
import { FALLBACK_ALBUMS } from '../data/fallbackAlbums';

const Albums = () => {
    const [allAlbums, setAllAlbums] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterArtist, setFilterArtist] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    // Popular artists to fetch albums from
    const artistIds = [
        { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift' },
        { id: '3TVXtAsR1Inumwj472S9r4', name: 'Drake' },
        { id: '1Xyo4u8uXC1ZmMpatF05PJ', name: 'The Weeknd' },
        { id: '66CXWjxzNUsdJxJ2JdwvnR', name: 'Ariana Grande' },
        { id: '6eUKZXaKkcviH0Ku9w2n3V', name: 'Ed Sheeran' },
        { id: '0du5cEVh5yTK9QJze8zA0C', name: 'Bruno Mars' }
    ];

    useEffect(() => {
        loadAlbums();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [searchTerm, filterArtist, sortBy, allAlbums]);

    const loadAlbums = async () => {
        setLoading(true);
        try {
            console.log('Loading albums from all artists...');

            // Load all artists in parallel for better performance
            const albumPromises = artistIds.map(async (artist) => {
                try {
                    const result = await artistService.getArtistAlbums(artist.id);
                    console.log(`Albums for ${artist.name}:`, result);

                    if (result.ok && result.data) {
                        const artistAlbums = result.data.albums || result.data;
                        if (Array.isArray(artistAlbums) && artistAlbums.length > 0) {
                            return artistAlbums;
                        }
                    }
                    return [];
                } catch (error) {
                    console.error(`Failed to load albums for ${artist.name}:`, error);
                    return [];
                }
            });

            // Wait for all requests to complete
            const results = await Promise.all(albumPromises);
            const albums = results.flat(); // Flatten array of arrays

            console.log(`Total albums loaded: ${albums.length}`);

            // Use fallback data if API returned no albums
            if (albums.length === 0) {
                console.log('No albums from API, using fallback data');
                setAllAlbums(FALLBACK_ALBUMS);
            } else {
                setAllAlbums(albums);
            }
        } catch (error) {
            console.error('Error loading albums:', error);
            // Use fallback on error
            setAllAlbums(FALLBACK_ALBUMS);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...allAlbums];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(album =>
                album.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.artist_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply artist filter
        if (filterArtist !== 'all') {
            filtered = filtered.filter(album =>
                album.artist_name?.toLowerCase() === filterArtist.toLowerCase()
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.release_date || 0) - new Date(a.release_date || 0);
                case 'artist':
                    return (a.artist_name || '').localeCompare(b.artist_name || '');
                case 'name':
                    return (a.name || '').localeCompare(b.name || '');
                default:
                    return 0;
            }
        });

        setFilteredAlbums(filtered);
    };

    const getUniqueArtists = () => {
        const artists = new Set(allAlbums.map(album => album.artist_name).filter(Boolean));
        return Array.from(artists).sort();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterArtist('all');
        setSortBy('date');
    };

    if (loading) {
        return (
            <div className="albums-page">
                <div className="albums-header">
                    <h1>Albums</h1>
                    <p className="albums-subtitle">Browse albums from popular artists</p>
                </div>
                <div className="albums-grid">
                    <SkeletonLoader type="album-card" count={18} />
                </div>
            </div>
        );
    }

    return (
        <div className="albums-page">
            <div className="albums-header">
                <h1>Albums</h1>
                <p className="albums-subtitle">Browse albums from popular artists</p>
            </div>

            <div className="albums-controls">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by album or artist..."
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
                            <option value="date">Release Date</option>
                            <option value="artist">Artist</option>
                            <option value="name">Album Name</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Artist:</label>
                        <select
                            value={filterArtist}
                            onChange={(e) => setFilterArtist(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Artists</option>
                            {getUniqueArtists().map(artist => (
                                <option key={artist} value={artist}>
                                    {artist}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(searchTerm || sortBy !== 'date' || filterArtist !== 'all') && (
                        <button
                            className="btn-clear-filters"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="albums-count">
                    Showing {filteredAlbums.length} of {allAlbums.length} albums
                </div>
            </div>

            {filteredAlbums.length > 0 ? (
                <div className="albums-grid">
                    {filteredAlbums.map((album) => (
                        <AlbumCard
                            key={album.id || album.spotify_id}
                            album={album}
                            onAlbumClick={(id) => console.log('Album clicked:', id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="🎵"
                    title={searchTerm ? "No albums found" : "No albums available"}
                    message={searchTerm ? "Try a different search term" : "Albums will appear here"}
                />
            )}
        </div>
    );
};

export default Albums;
