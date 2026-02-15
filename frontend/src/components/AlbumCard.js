import React from 'react';
import './AlbumCard.css';

const AlbumCard = ({ album, onClick }) => {
    // Get the best quality image (usually first one is largest)
    const albumImage = album.images && album.images.length > 0
        ? album.images[0].url
        : null;

    // Format release date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get album type badge color
    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'album': return 'type-badge album';
            case 'single': return 'type-badge single';
            case 'compilation': return 'type-badge compilation';
            default: return 'type-badge';
        }
    };

    return (
        <div
            className="album-card"
            onClick={() => onClick && onClick(album)}
        >
            {/* Album Cover */}
            <div className="album-cover">
                {albumImage ? (
                    <img src={albumImage} alt={album.name} />
                ) : (
                    <div className="album-cover-placeholder">
                        🎵
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="album-overlay">
                    <button className="play-button">▶</button>
                </div>
            </div>

            {/* Album Info */}
            <div className="album-info">
                <div className="album-header">
                    <h3 className="album-name" title={album.name}>
                        {album.name}
                    </h3>
                    {album.type && (
                        <span className={getTypeBadgeClass(album.type)}>
                            {album.type}
                        </span>
                    )}
                </div>

                {/* Artists */}
                {album.artists && album.artists.length > 0 && (
                    <p className="album-artists">
                        {album.artists.map(a => a.name).join(', ')}
                    </p>
                )}

                {/* Release Date & Track Count */}
                <div className="album-meta">
                    {album.releaseDate && (
                        <span className="release-date">
                            📅 {formatDate(album.releaseDate)}
                        </span>
                    )}
                    {album.totalTracks && (
                        <span className="track-count">
                            {album.totalTracks} {album.totalTracks === 1 ? 'track' : 'tracks'}
                        </span>
                    )}
                </div>

                {/* Spotify Link */}
                {album.spotifyUrl && (
                    <a
                        href={album.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spotify-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Listen on Spotify →
                    </a>
                )}
            </div>
        </div>
    );
};

export default AlbumCard;
