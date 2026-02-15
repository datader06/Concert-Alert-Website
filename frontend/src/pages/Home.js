import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages.css';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { artistService } from '../services/api';
import { FALLBACK_ALBUMS } from '../data/fallbackAlbums';

const Home = () => {
  const navigate = useNavigate();
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasesLoading, setReleasesLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  // Load albums after artists are loaded
  useEffect(() => {
    if (trendingArtists.length > 0 && !releasesLoading) {
      loadNewReleases();
    }
  }, [trendingArtists]);

  const loadContent = async () => {
    await loadTrendingArtists(); // Wait for artists to load first
    // loadNewReleases will be called after artists are set
  };

  const loadTrendingArtists = async () => {
    setLoading(true);
    try {
      // Use Spotify IDs for popular artists with complete metadata
      const popularArtistIds = [
        { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift' },
        { id: '3TVXtAsR1Inumwj472S9r4', name: 'Drake' },
        { id: '1Xyo4u8uXC1ZmMpatF05PJ', name: 'The Weeknd' },
        { id: '66CXWjxzNUsdJxJ2JdwvnR', name: 'Ariana Grande' },
        { id: '6eUKZXaKkcviH0Ku9w2n3V', name: 'Ed Sheeran' },
        { id: '0du5cEVh5yTK9QJze8zA0C', name: 'Bruno Mars' }
      ];

      const resolvedArtists = [];

      for (const artist of popularArtistIds) {
        try {
          // Use metadata endpoint with Spotify ID directly
          const result = await artistService.getArtistMetadata(artist.id, 'spotify');
          console.log(`API Response for ${artist.name}:`, result.data);
          if (result.ok && result.data) {
            // Fallback listener counts if API returns 0
            const fallbackListeners = {
              '06HL4z0CvFAxyc27GXpf02': 95000000,  // Taylor Swift
              '3TVXtAsR1Inumwj472S9r4': 78000000,  // Drake
              '1Xyo4u8uXC1ZmMpatF05PJ': 85000000,  // The Weeknd
              '66CXWjxzNUsdJxJ2JdwvnR': 82000000,  // Ariana Grande
              '6eUKZXaKkcviH0Ku9w2n3V': 88000000,  // Ed Sheeran
              '0du5cEVh5yTK9QJze8zA0C': 42000000   // Bruno Mars
            };

            resolvedArtists.push({
              id: result.data.spotifyId || result.data.id,
              name: result.data.name || artist.name,
              genre: result.data.genres?.[0] || 'Pop',
              image_url: result.data.images?.[0]?.url || '',
              listeners: result.data.followers > 0 ? result.data.followers : (fallbackListeners[artist.id] || 50000000),
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
      // Get latest releases from ALL trending artists (not just 3)
      const artistsToCheck = trendingArtists.slice(0, 6); // All 6 artists

      console.log('Loading albums for artists:', artistsToCheck.map(a => a.name));

      // Load all in parallel for better performance
      const albumPromises = artistsToCheck.map(async (artist) => {
        const artistId = artist.id || artist.spotifyData?.spotifyId;
        if (!artistId) return [];

        try {
          const result = await artistService.getLatestReleases(artistId);
          console.log(`Albums for ${artist.name}:`, result);

          if (result.ok && result.data) {
            const albums = result.data.albums || result.data;
            if (Array.isArray(albums) && albums.length > 0) {
              return albums.slice(0, 1); // Get 1 latest from each artist
            }
          }
          return [];
        } catch (error) {
          console.error(`Failed to get releases for ${artist.name}:`, error);
          return [];
        }
      });

      // Wait for all requests to complete
      const results = await Promise.all(albumPromises);
      const releases = results.flat(); // Flatten array of arrays

      console.log('Total albums loaded:', releases.length);
      setNewReleases(releases.slice(0, 6)); // Show max 6 albums
    } catch (error) {
      console.error('Error loading new releases:', error);
      // Use fallback on error
      setNewReleases(FALLBACK_ALBUMS.slice(0, 6));
    } finally {
      setReleasesLoading(false);
    }
  };

  const handleArtistClick = (artistId) => {
    console.log('Navigating to artist:', artistId);
    navigate(`/artist/${artistId}`);
  };

  const handleFavoriteToggle = async (artistId) => {
    try {
      console.log('Toggling favorite:', artistId);
      await artistService.addFavorite(artistId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAlbumClick = (album) => {
    // Albums are just for display, no action needed
    console.log('Album clicked:', album.name);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">Live the Music</span>
          <h1>Feel the Pulse<br />of the City</h1>
          <p>Discover your next favorite artist and never miss a beat.</p>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => document.querySelector('.trending-section')?.scrollIntoView({ behavior: 'smooth' })}>
            Start Listening
          </button>
        </div>
      </section>

      {/* Trending Artists Section */}
      <section className="trending-section">
        <h2 className="section-title">Trending Artists</h2>
        {loading ? (
          <div className="artists-grid">
            <SkeletonLoader type="artist-card" count={6} />
          </div>
        ) : trendingArtists.length > 0 ? (
          <div className="artists-grid">
            {trendingArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onArtistClick={handleArtistClick}
                onFavoriteClick={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🎤"
            title="No artists found"
            message="Check back later for trending artists"
          />
        )}
      </section>

      {/* New Releases Section */}
      <section className="releases-section">
        <h2 className="section-title">New Releases</h2>

        {releasesLoading ? (
          <div className="albums-grid">
            <SkeletonLoader type="album-card" count={6} />
          </div>
        ) : newReleases.length > 0 ? (
          <div className="albums-grid">
            {newReleases.map((album, index) => (
              <AlbumCard
                key={album.id || album.spotify_id || index}
                album={album}
                onAlbumClick={handleAlbumClick}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🎵"
            title="No new releases"
            message="Check back later for new music"
          />
        )}
      </section>
    </div>
  );
};

export default Home;
