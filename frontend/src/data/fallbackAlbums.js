// Fallback album data for when Spotify API returns empty results
export const FALLBACK_ALBUMS = [
    // Taylor Swift
    { id: 'ts1', spotify_id: '1NAmidJlEaVgA3MpcPFYGq', name: 'Midnights', artist_name: 'Taylor Swift', release_date: '2022-10-21', image_url: 'https://i.scdn.co/image/ab67616d0000b2732b2d2b2d2b2d2b2d2b2d2b2d', total_tracks: 13 },
    { id: 'ts2', spotify_id: '6kZ42qRrzov54LcAk4onW9', name: 'Red (Taylor\'s Version)', artist_name: 'Taylor Swift', release_date: '2021-11-12', image_url: 'https://i.scdn.co/image/ab67616d0000b273318443aab3531a0558e79a4d', total_tracks: 30 },
    { id: 'ts3', spotify_id: '2fenSS68JI1h4Fo296JfGr', name: '1989 (Taylor\'s Version)', artist_name: 'Taylor Swift', release_date: '2023-10-27', image_url: 'https://i.scdn.co/image/ab67616d0000b27396b6c4b7b3b3b3b3b3b3b3b3', total_tracks: 21 },

    // Drake
    { id: 'dr1', spotify_id: '1ATL5GLyefJaxhQzSPVrLX', name: 'For All The Dogs', artist_name: 'Drake', release_date: '2023-10-06', image_url: 'https://i.scdn.co/image/ab67616d0000b273544a6f5a5b5a5b5a5b5a5b5a', total_tracks: 23 },
    { id: 'dr2', spotify_id: '1ozwqHmOzt3ZJnHFUUXqzN', name: 'Honestly, Nevermind', artist_name: 'Drake', release_date: '2022-06-17', image_url: 'https://i.scdn.co/image/ab67616d0000b27340b3b3b3b3b3b3b3b3b3b3b3', total_tracks: 14 },
    { id: 'dr3', spotify_id: '3SpBlxme9WbeQdI9kx7KAV', name: 'Certified Lover Boy', artist_name: 'Drake', release_date: '2021-09-03', image_url: 'https://i.scdn.co/image/ab67616d0000b273cd7f9e2b2b2b2b2b2b2b2b2b', total_tracks: 21 },

    // The Weeknd
    { id: 'tw1', spotify_id: '2nLOHgzXzwFEpl62zAgCEC', name: 'After Hours', artist_name: 'The Weeknd', release_date: '2020-03-20', image_url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', total_tracks: 14 },
    { id: 'tw2', spotify_id: '4yP0hdKOZPNshxUOjY0cZj', name: 'Starboy', artist_name: 'The Weeknd', release_date: '2016-11-25', image_url: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452', total_tracks: 18 },
    { id: 'tw3', spotify_id: '2ODvWsOgouMbaA5xf0RkJe', name: 'Dawn FM', artist_name: 'The Weeknd', release_date: '2022-01-07', image_url: 'https://i.scdn.co/image/ab67616d0000b273a0b3b3b3b3b3b3b3b3b3b3b3', total_tracks: 16 },

    // Ariana Grande
    { id: 'ag1', spotify_id: '3euz4vS7ezKGnNSwgyvKcd', name: 'Positions', artist_name: 'Ariana Grande', release_date: '2020-10-30', image_url: 'https://i.scdn.co/image/ab67616d0000b273be841ba4bc24340152e3a79a', total_tracks: 14 },
    { id: 'ag2', spotify_id: '2fYhqwDWXjbpjaIJPEfKFw', name: 'thank u, next', artist_name: 'Ariana Grande', release_date: '2019-02-08', image_url: 'https://i.scdn.co/image/ab67616d0000b27356ac7b86e090f307e218e9c8', total_tracks: 12 },
    { id: 'ag3', spotify_id: '3eRvdOT8y3JqHPKKfWqLGH', name: 'eternal sunshine', artist_name: 'Ariana Grande', release_date: '2024-03-08', image_url: 'https://i.scdn.co/image/ab67616d0000b273b3b3b3b3b3b3b3b3b3b3b3b3', total_tracks: 13 },

    // Ed Sheeran
    { id: 'es1', spotify_id: '5MJN8HQxiYFPjGRAlYrtcT', name: '= (Equals)', artist_name: 'Ed Sheeran', release_date: '2021-10-29', image_url: 'https://i.scdn.co/image/ab67616d0000b273ef24c3fdbf856340d55cfbf3', total_tracks: 14 },
    { id: 'es2', spotify_id: '3T4tUhGYeRNVUGevb0wThu', name: '÷ (Divide)', artist_name: 'Ed Sheeran', release_date: '2017-03-03', image_url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', total_tracks: 16 },
    { id: 'es3', spotify_id: '7aJuG4TFXa2hmE4z1yxc3n', name: '- (Subtract)', artist_name: 'Ed Sheeran', release_date: '2023-05-05', image_url: 'https://i.scdn.co/image/ab67616d0000b273b3b3b3b3b3b3b3b3b3b3b3b3', total_tracks: 14 },

    // Bruno Mars
    { id: 'bm1', spotify_id: '4PgleR09JVnm3zY1fW3XBA', name: '24K Magic', artist_name: 'Bruno Mars', release_date: '2016-11-18', image_url: 'https://i.scdn.co/image/ab67616d0000b27312d1b6a9f3b3b3b3b3b3b3b3', total_tracks: 9 },
    { id: 'bm2', spotify_id: '58ufpQsJ1DS5kq4hhzQDiI', name: 'Unorthodox Jukebox', artist_name: 'Bruno Mars', release_date: '2012-12-07', image_url: 'https://i.scdn.co/image/ab67616d0000b27326f7f19c7f0381e56156c94a', total_tracks: 10 },
    { id: 'bm3', spotify_id: '1uyf3l2d4XYwiEqAb7t7fX', name: 'Doo-Wops & Hooligans', artist_name: 'Bruno Mars', release_date: '2010-10-04', image_url: 'https://i.scdn.co/image/ab67616d0000b273f60070a7b4f3b3b3b3b3b3b3', total_tracks: 10 }
];
