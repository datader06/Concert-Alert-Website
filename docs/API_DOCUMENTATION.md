# 🌐 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. User Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@email.com",
  "password": "securepassword",
  "username": "musiclover",
  "city": "New York",
  "country": "United States"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@email.com",
    "username": "musiclover",
    "city": "New York",
    "country": "United States"
  }
}
```

---

### 2. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@email.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@email.com",
    "username": "musiclover",
    "city": "New York",
    "country": "United States"
  }
}
```

---

### 3. Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@email.com",
  "username": "musiclover",
  "city": "New York",
  "country": "United States",
  "profile_image": null,
  "created_at": "2024-01-01T10:00:00Z"
}
```

---

### 4. Update User Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "city": "Los Angeles",
  "country": "United States",
  "profile_image": "https://..."
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@email.com",
    "username": "musiclover",
    "city": "Los Angeles",
    "country": "United States",
    "profile_image": "https://..."
  }
}
```

---

## 🎤 Artist Endpoints

### 1. Get All Artists
```http
GET /artists
```

**Response (200):**
```json
[
  {
    "id": 1,
    "lastfm_id": "abc123",
    "name": "The Weeknd",
    "genre": "Pop/R&B",
    "bio": "Canadian singer and producer...",
    "image_url": "https://...",
    "listener_count": 70000000,
    "play_count": 1000000000
  },
  ...
]
```

---

### 2. Get Trending Artists
```http
GET /artists/trending
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "The Weeknd",
    "genre": "Pop/R&B",
    "image_url": "https://...",
    "listener_count": 70000000
  },
  ...
]
```

---

### 3. Search Artists
```http
GET /artists/search?query=taylor
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search query (min 2 chars) |

**Response (200):**
```json
{
  "artists": [
    {
      "id": 2,
      "name": "Taylor Swift",
      "genre": "Pop",
      "image_url": "https://...",
      "listener_count": 65000000
    }
  ]
}
```

---

### 4. Get Artist Details
```http
GET /artists/:id
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Artist ID |

**Response (200):**
```json
{
  "id": 1,
  "lastfm_id": "abc123",
  "name": "The Weeknd",
  "genre": "Pop/R&B",
  "bio": "Canadian singer...",
  "image_url": "https://...",
  "listener_count": 70000000,
  "play_count": 1000000000,
  "concerts": [
    {
      "id": 1,
      "event_name": "After Hours Tour",
      "venue_name": "Madison Square Garden",
      "city": "New York",
      "event_date": "2024-03-15T20:00:00Z"
    }
  ]
}
```

---

### 5. Add Artist to Favorites
```http
POST /artists/:artistId/favorite
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "message": "Artist added to favorites"
}
```

---

### 6. Remove Artist from Favorites
```http
DELETE /artists/:artistId/favorite
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Artist removed from favorites"
}
```

---

### 7. Get User's Favorite Artists
```http
GET /artists/user/favorites
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "The Weeknd",
    "genre": "Pop/R&B",
    "image_url": "https://...",
    "listener_count": 70000000
  },
  {
    "id": 2,
    "name": "Taylor Swift",
    "genre": "Pop",
    "image_url": "https://...",
    "listener_count": 65000000
  }
]
```

---

## 🎪 Concert Endpoints

### 1. Get Upcoming Concerts
```http
GET /concerts?limit=50
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 50 | Maximum results to return |

**Response (200):**
```json
[
  {
    "id": 1,
    "external_id": "ticketmaster_abc123",
    "artist_id": 1,
    "event_name": "After Hours Tour - NYC",
    "venue_name": "Madison Square Garden",
    "city": "New York",
    "country": "United States",
    "latitude": 40.7505,
    "longitude": -73.9972,
    "event_date": "2024-03-15T20:00:00Z",
    "ticket_url": "https://ticketmaster.com/...",
    "source": "ticketmaster",
    "last_updated": "2024-01-10T10:00:00Z"
  },
  ...
]
```

---

### 2. Get Concerts for Specific Artist
```http
GET /concerts/artist/:artistId
```

**Response (200):**
```json
[
  {
    "id": 1,
    "event_name": "After Hours Tour - NYC",
    "venue_name": "Madison Square Garden",
    "city": "New York",
    "country": "United States",
    "event_date": "2024-03-15T20:00:00Z",
    "ticket_url": "https://ticketmaster.com/..."
  },
  ...
]
```

---

### 3. Get Concerts for User's Favorite Artists
```http
GET /concerts/user/favorites
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "event_name": "After Hours Tour - NYC",
    "venue_name": "Madison Square Garden",
    "city": "New York",
    "country": "United States",
    "event_date": "2024-03-15T20:00:00Z",
    "ticket_url": "https://ticketmaster.com/..."
  },
  ...
]
```

---

### 4. Get Concerts Near User
```http
GET /concerts/user/near
Authorization: Bearer <token>
```

**Logic:** Filters concerts by user's country (set in profile)

**Response (200):**
```json
[
  {
    "id": 1,
    "event_name": "After Hours Tour - NYC",
    "venue_name": "Madison Square Garden",
    "city": "New York",
    "country": "United States",
    "event_date": "2024-03-15T20:00:00Z",
    "ticket_url": "https://ticketmaster.com/..."
  },
  ...
]
```

---

### 5. Get Concert Details
```http
GET /concerts/details/:concertId
```

**Response (200):**
```json
{
  "id": 1,
  "external_id": "ticketmaster_abc123",
  "artist_id": 1,
  "event_name": "After Hours Tour - NYC",
  "venue_name": "Madison Square Garden",
  "city": "New York",
  "country": "United States",
  "latitude": 40.7505,
  "longitude": -73.9972,
  "event_date": "2024-03-15T20:00:00Z",
  "ticket_url": "https://ticketmaster.com/...",
  "source": "ticketmaster",
  "last_updated": "2024-01-10T10:00:00Z",
  "artist": "The Weeknd"
}
```

---

## 🔔 Notification Endpoints

### 1. Get Notifications
```http
GET /notifications?limit=50&unread=false
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 50 | Number of notifications |
| unread | boolean | false | Only unread notifications |

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "concert_id": 1,
    "type": "concert_alert",
    "message": "The Weeknd is performing at Madison Square Garden on Mar 15, 2024",
    "is_read": false,
    "created_at": "2024-01-10T10:00:00Z",
    "artist_name": "The Weeknd",
    "event_name": "After Hours Tour - NYC",
    "event_date": "2024-03-15T20:00:00Z"
  },
  ...
]
```

---

### 2. Mark Notification as Read
```http
PUT /notifications/:notificationId/read
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

### 3. Mark All Notifications as Read
```http
PUT /notifications/mark-all-read
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "25 notifications marked as read"
}
```

---

### 4. Delete Notification
```http
DELETE /notifications/:notificationId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Notification deleted"
}
```

---

## 🔍 Health Check

### Server Status
```http
GET /health
```

**Response (200):**
```json
{
  "status": "Backend is running!",
  "timestamp": "2024-01-10T10:00:00.000Z"
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "Email, password, and username are required"
}
```

### 401 - Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 - Not Found
```json
{
  "error": "Artist not found"
}
```

### 500 - Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Example API Calls

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","password":"password"}'
```

**Search Artists:**
```bash
curl "http://localhost:5000/api/artists/search?query=taylor"
```

**Get Notifications:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/notifications
```

### Using JavaScript (Fetch)

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@email.com', password: 'password' })
});
const data = await response.json();
const token = data.token;

// Get user profile
const profile = await fetch('http://localhost:5000/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const userData = await profile.json();
console.log(userData);
```

---

## Rate Limiting (Future)

Currently not implemented. Future versions will include:
- 100 requests per minute per user
- 5 signup attempts per hour per IP
- 10 failed login attempts = 15 minute lockout

---

## Pagination (Future)

Future versions will support pagination:
```
GET /artists?page=1&limit=20
```

---

## Versioning

Current API Version: **v1** (URL: `/api/`)

Future versions will support:
- `/api/v1/` (current)
- `/api/v2/` (future improvements)

---

Last Updated: January 2024
