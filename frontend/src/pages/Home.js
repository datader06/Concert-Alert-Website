import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { artistService, albumService } from '../services/api';

const Home = () => {
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasesLoading, setReleasesLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    await loadTrendingArtists();
    await loadNewReleases();
  };

  const loadTrendingArtists = async () => {
    setLoading(true);
    try {
      // Use Spotify IDs directly (more reliable than name resolution)
      const popularArtistIds = [
        { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift' },
        { id: '4dpARuHxo51G3z768sgnrY', name: 'Adele' },
        { id: '4gzpq5DPGxSnKTe4SA8HAU', name: 'Coldplay' },
        { id: '6vWDO969PvNqNYHIOW5v0m', name: 'Beyoncé' },
        { id: '5pKCCKE2ajJHZ9KAiaK11H', name: 'Rihanna' },
        { id: '0du5cEVh5yTK9QJze8zA0C', name: 'Bruno Mars' }
      ];

      const resolvedArtists = [];

      for (const artist of popularArtistIds) {
        try {
          // Use metadata endpoint with Spotify ID directly
          const result = await albumService.getArtistMetadata(artist.id, 'spotify');
          if (result.ok && result.data) {
            resolvedArtists.push({
              id: result.data.spotifyId,
              name: result.data.name,
              genre: result.data.genres?.[0] || 'Music',
              image_url: result.data.images?.[0]?.url || '',
              listeners: result.data.followers || 0,
              spotifyData: result.data
            });
          }
        } catch (error) {
          console.error(`Failed to load ${artist.name}:`, error);
          // Continue to next artist instead of stopping
        }
      }

      if (resolvedArtists.length > 0) {
        setTrendingArtists(resolvedArtists);
      } else {
        // Fallback to placeholder if all fail
        console.warn('All artists failed to load, using fallback data');
        setTrendingArtists([
          {
            id: '06HL4z0CvFAxyc27GXpf02',
            name: 'Taylor Swift',
            genre: 'Pop',
            image_url: '',
            listeners: 95000000
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading trending artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNewReleases = async () => {
    setReleasesLoading(true);
    try {
      // Get latest releases from first few trending artists
      const releases = [];
      const artistsToCheck = trendingArtists.slice(0, 3); // First 3 artists

      for (const artist of artistsToCheck) {
        if (artist.spotifyData?.spotifyId) {
          try {
            const result = await albumService.getLatestReleases(artist.spotifyData.spotifyId);
            if (result.ok && result.data) {
              releases.push(...result.data.slice(0, 2)); // Get 2 latest from each
            }
          } catch (error) {
            console.error(`Failed to get releases for ${artist.name}:`, error);
          }
        }
      }

      setNewReleases(releases.slice(0, 6)); // Show max 6 albums
    } catch (error) {
      console.error('Error loading new releases:', error);
    } finally {
      setReleasesLoading(false);
    }
  };

  const handleAlbumClick = (album) => {
    // Open Spotify URL or show album details
    if (album.spotifyUrl) {
      window.open(album.spotifyUrl, '_blank');
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>🎵 Discover Your Music</h1>
          <p>Find your favorite artists, explore new releases, and get concert alerts</p>
        </div>
      </section>

      {/* Trending Artists Section */}
      <section className="trending-section">
        <h2>🔥 Trending Artists</h2>

        {loading ? (
          <LoadingSpinner message="Loading trending artists..." />
        ) : trendingArtists.length === 0 ? (
          <EmptyState
            icon="🎤"
            title="No Artists Found"
            message="We couldn't find any trending artists right now. Please check back later!"
          />
        ) : (
          <div className="artists-grid">
            {trendingArtists.map(artist => (
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
        )}
      </section>

      {/* New Releases Section */}
      {newReleases.length > 0 && (
        <section className="new-releases-section">
          <h2>🎧 New Releases</h2>

          {releasesLoading ? (
            <LoadingSpinner message="Loading new releases..." />
          ) : (
            <div className="albums-grid">
              {newReleases.map((album, index) => (
                <AlbumCard
                  key={album.id || index}
                  album={album}
                  onClick={handleAlbumClick}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
