import React, { useState, useEffect } from 'react';
import '../styles/Albums.css';
import AlbumCard from '../components/AlbumCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { artistService } from '../services/api';
import { FALLBACK_ALBUMS } from '../data/fallbackAlbums';
import { useToast } from '../context/ToastContext';

const Albums = () => {
    const { addToast } = useToast();
    const [allAlbums, setAllAlbums] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterArtist, setFilterArtist] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [loadedCount, setLoadedCount] = useState(0);

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
        setLoadedCount(0);

        // 1. Check cache first
        const CACHE_KEY = 'albums_cache';
        const CACHE_DURATION = 3600000; // 1 hour
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    console.log('📦 Loaded albums from cache');
                    setAllAlbums(data);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                console.error('Error parsing cache:', e);
                localStorage.removeItem(CACHE_KEY);
            }
        }

        setAllAlbums([]); // Start with empty array
        const TIMEOUT_MS = 30000; // 30 seconds per artist

        console.log('🚀 Loading albums progressively from all 6 artists...');

        let totalLoaded = 0;
        let currentAlbums = [];

        // Load artists sequentially but show results immediately
        for (let i = 0; i < artistIds.length; i++) {
            const artist = artistIds[i];
            setLoadedCount(i + 1); // Update progress

            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.warn(`⏱️ Timeout for ${artist.name} after ${TIMEOUT_MS}ms`);
                controller.abort();
            }, TIMEOUT_MS);

            try {
                const result = await artistService.getArtistAlbums(artist.id, {
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (result.ok && result.data) {
                    const artistAlbums = result.data.albums || result.data;
                    if (Array.isArray(artistAlbums) && artistAlbums.length > 0) {
                        console.log(`✅ ${artist.name}: ${artistAlbums.length} albums`);
                        totalLoaded += artistAlbums.length;

                        // Add albums immediately as they load
                        const newAlbums = [...currentAlbums, ...artistAlbums];
                        currentAlbums = newAlbums;
                        setAllAlbums(newAlbums);
                    } else {
                        console.log(`⚠️ ${artist.name}: No albums found, using fallback`);
                        // Fallback logic for THIS artist
                        const fallbackForArtist = FALLBACK_ALBUMS.filter(a => a.artist_name === artist.name);
                        const newAlbums = [...currentAlbums, ...fallbackForArtist];
                        currentAlbums = newAlbums;
                        setAllAlbums(newAlbums);
                    }
                } else {
                    console.log(`⚠️ ${artist.name}: API returned no data, using fallback`);
                    const fallbackForArtist = FALLBACK_ALBUMS.filter(a => a.artist_name === artist.name);
                    const newAlbums = [...currentAlbums, ...fallbackForArtist];
                    currentAlbums = newAlbums;
                    setAllAlbums(newAlbums);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                console.error(`❌ ${artist.name} failed:`, error.message);

                // On error, use fallback for THIS artist
                const fallbackForArtist = FALLBACK_ALBUMS.filter(a => a.artist_name === artist.name);
                if (fallbackForArtist.length > 0) {
                    addToast(`Loaded offline data for ${artist.name}`, 'info', 3000);
                    const newAlbums = [...currentAlbums, ...fallbackForArtist];
                    currentAlbums = newAlbums;
                    setAllAlbums(newAlbums);
                } else {
                    addToast(`Failed to load ${artist.name}`, 'error', 3000);
                }
            }
        }

        console.log(`📊 Total albums loaded: ${currentAlbums.length}`); // Use currentAlbums.length as totalLoaded accumulator logic was slightly flawed with fallbacks

        // Cache the results if we have data
        if (currentAlbums.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: currentAlbums,
                timestamp: Date.now()
            }));

            if (!cached) {
                addToast(`Successfully loaded albums`, 'success');
            }
        }

        // Final fallback if EVERYTHING failed
        if (currentAlbums.length === 0) {
            setAllAlbums(FALLBACK_ALBUMS);
        }

        setLoading(false);
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

    if (loading && allAlbums.length === 0) {
        return (
            <div className="albums-page">
                <div className="albums-header">
                    <h1>Albums</h1>
                    <p className="albums-subtitle">
                        Loading {artistIds[loadedCount - 1]?.name || 'artists'}...
                        ({loadedCount}/{artistIds.length})
                    </p>
                    <div className="loading-progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(loadedCount / artistIds.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className="albums-grid">
                    <SkeletonLoader type="album-card" count={12} />
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
