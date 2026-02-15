import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ArtistDetail.css';
import AlbumCard from '../components/AlbumCard';
import ConcertCard from '../components/ConcertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { artistService, albumService, concertService } from '../services/api';

const ArtistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        loadArtistData();
    }, [id]);

    const loadArtistData = async () => {
        setLoading(true);
        setError(null);

        // Safety timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        try {
            // Race between fetch and timeout
            const loadPromise = async () => {
                // Fetch artist details
                const artistResult = await artistService.getArtistMetadata(id, 'spotify');

                if (!artistResult.ok || !artistResult.data) {
                    throw new Error('Artist not found');
                }

                const artistData = {
                    id: artistResult.data.spotifyId || id,
                    name: artistResult.data.name,
                    genre: artistResult.data.genres?.[0] || 'Music',
                    image_url: artistResult.data.images?.[0]?.url || '',
                    listeners: artistResult.data.followers || 0,
                    bio: artistResult.data.bio || `${artistResult.data.name} is a popular artist.`,
                    spotifyData: artistResult.data
                };

                setArtist(artistData);

                // Fetch albums (non-blocking for main display)
                artistService.getArtistAlbums(id).then(albumsResult => {
                    if (albumsResult.ok && albumsResult.data) {
                        setAlbums(albumsResult.data.albums || []);
                    }
                });

                // Fetch concerts (non-blocking)
                concertService.getArtistConcerts(id, artistData.name).then(concertsResult => {
                    if (concertsResult.ok && concertsResult.data) {
                        const concertsData = concertsResult.data.concerts || concertsResult.data;
                        setConcerts(Array.isArray(concertsData) ? concertsData : []);
                    }
                });
            };

            await Promise.race([loadPromise(), timeoutPromise]);

        } catch (err) {
            console.error('Error loading artist data:', err);
            if (err.message === 'Timeout') {
                // Try one last desperate fallback on timeout if we have an ID
                const fallback = await artistService.getArtist(id); // Use simpler endpoint
                if (fallback.ok && fallback.data) {
                    setArtist(fallback.data);
                } else {
                    setError('Artist data timed out. Please try again.');
                }
            } else {
                setError('Failed to load artist data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = async () => {
        try {
            if (isFavorited) {
                await artistService.removeFavorite(artist.id);
                setIsFavorited(false);
            } else {
                await artistService.addFavorite(artist.id);
                setIsFavorited(true);
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="artist-detail-loading">
                <LoadingSpinner />
                <p>Loading artist...</p>
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="artist-detail-error">
                <h2>😕 {error || 'Artist not found'}</h2>
                <button onClick={handleBack} className="btn-back">
                    ← Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="artist-detail-page">
            {/* Back Button */}
            <button onClick={handleBack} className="btn-back-top">
                ← Back
            </button>

            {/* Artist Hero Section */}
            <div className="artist-hero">
                <div className="artist-hero-image">
                    {artist.image_url ? (
                        <img src={artist.image_url} alt={artist.name} />
                    ) : (
                        <div className="artist-image-placeholder">🎤</div>
                    )}
                </div>
                <div className="artist-hero-info">
                    <h1 className="artist-name">{artist.name}</h1>
                    <p className="artist-genre">{artist.genre}</p>
                    <p className="artist-listeners">
                        {(artist.listeners / 1000000).toFixed(1)}M followers
                    </p>
                    <button
                        className={`btn-favorite-large ${isFavorited ? 'favorited' : ''}`}
                        onClick={handleFavoriteToggle}
                    >
                        {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
                    </button>
                </div>
            </div>

            {/* Biography Section */}
            {artist.bio && (
                <section className="artist-bio-section">
                    <h2>About</h2>
                    <p className="artist-bio">{artist.bio}</p>
                </section>
            )}

            {/* Albums Section */}
            <section className="artist-albums-section">
                <h2>Albums</h2>
                {albums.length > 0 ? (
                    <div className="albums-grid">
                        {albums.map((album) => (
                            <AlbumCard
                                key={album.id}
                                album={album}
                                onAlbumClick={(albumId) => console.log('Album clicked:', albumId)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No albums found</p>
                )}
            </section>

            {/* Concerts Section */}
            <section className="artist-concerts-section">
                <h2>Upcoming Concerts</h2>
                {concerts.length > 0 ? (
                    <div className="concerts-list">
                        {concerts.map((concert) => (
                            <ConcertCard
                                key={concert.id || concert.external_id}
                                concert={concert}
                                onClickDetails={(id) => console.log('Concert details:', id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No upcoming concerts</p>
                )}
            </section>
        </div>
    );
};

export default ArtistDetail;
