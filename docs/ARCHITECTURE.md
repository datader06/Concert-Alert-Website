# 🏗️ System Architecture Documentation

## High-Level System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                      (Frontend)                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React Application (Port 3000)                      │   │
│  │  - Components, Pages, State Management              │   │
│  │  - API Service Layer (axios)                        │   │
│  │  - Local Storage (token, user data)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTP/HTTPS)
           REST API Calls (JSON Request/Response)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER                            │
│                  (Express.js - Port 5000)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Routes (Express Router)                            │   │
│  │  - /api/auth                                        │   │
│  │  - /api/artists                                     │   │
│  │  - /api/concerts                                    │   │
│  │  - /api/notifications                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Controllers (Business Logic)                       │   │
│  │  - authController                                  │   │
│  │  - artistController                                │   │
│  │  - concertController                               │   │
│  │  - notificationController                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Models (Database Queries)                          │   │
│  │  - User.js, Artist.js, Concert.js, Notification.js │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SQLite Database (Local)                            │   │
│  │  - Users, Artists, Concerts, Notifications         │   │
│  │  - Listening History, Relationships                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cron Jobs (Background Tasks)                       │   │
│  │  - Concert Alert Checker (Every 6 hours)            │   │
│  │  - Cache Cleanup (Every day at 2 AM)                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
           External API Calls (Async)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  ├─ Last.fm API (Artist metadata)                          │
│  ├─ Ticketmaster API (Concert/Event data)                  │
│  └─ Songkick API (Alternative concert source)              │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture - Frontend

```
App (Root)
├── Navbar (Navigation bar - always visible)
├── Sidebar (Menu - shows when authenticated)
└── Main Content (Routes)
    ├── Login (Public)
    ├── Signup (Public)
    ├── Home (Protected)
    │   └── ArtistCard (Component)
    │       └── Artist info + favorite button
    ├── Discover (Protected)
    │   ├── Search form
    │   └── ArtistCard list
    ├── Concerts (Protected)
    │   └── ConcertCard (Component)
    │       └── Concert details + ticket link
    ├── Favorites (Protected)
    │   └── ArtistCard list
    ├── Notifications (Protected)
    │   └── Notification items
    └── Profile (Protected)
        └── User info editor

Services Layer:
├── api.js (All API calls)
│   ├── authService (signup, login, profile)
│   ├── artistService (search, favorites)
│   ├── concertService (upcoming, nearby)
│   └── notificationService (alerts, marking)
└── hooks/
    └── useAuth.js (Authentication state)
```

## Data Flow - Concert Alert Feature

```
1. USER ADDS FAVORITE ARTIST
   ├─ Frontend: POST /api/artists/{id}/favorite
   ├─ Backend: User record + artist_id added to user_artists table
   └─ Database: user_artists table updated

2. CRON JOB RUNS (Every 6 hours)
   ├─ Backend: Gets all users
   ├─ For each user: Get favorite_artists
   ├─ For each artist: Call Ticketmaster API
   ├─ Query: Search for artist name + upcoming concerts
   ├─ API Response: Event names, venues, dates, locations
   └─ Process events...

3. PROCESS NEW CONCERT EVENTS
   ├─ Check: Does concert already exist in DB?
   ├─ If NO: Insert into concerts table
   ├─ If YES: Update event_date, ticket_url, etc.
   ├─ Check: concert_cache table
   ├─ If user NOT notified: Create notification record
   ├─ Add to concert_cache (prevent re-notification)
   └─ Event logged

4. USER RECEIVES NOTIFICATION
   ├─ Frontend: Polls /api/notifications?unread=true
   ├─ Displays notification in UI
   ├─ User clicks "Get Tickets"
   └─ External link opens Ticketmaster

5. USER MARKS NOTIFICATION AS READ
   ├─ Frontend: PUT /api/notifications/{id}/read
   ├─ Backend: Updates is_read flag
   └─ Notification dismissed
```

## API Flow Documentation

### 1. Authentication Flow

```
[Client] → POST /api/auth/signup
│  ├─ Body: { email, password, username, city, country }
│  └─ Returns: { token, user }
│
[Client] → localStorage.setItem('token')
│
[Client] → POST /api/auth/login
│  ├─ Body: { email, password }
│  └─ Returns: { token, user }
│
[Protected Route] → GET /api/auth/profile
│  ├─ Header: Authorization: Bearer {token}
│  └─ Returns: { id, email, username, city, country }
```

### 2. Artist Discovery Flow

```
[Client] → GET /api/artists/trending
│  └─ Returns: [ {id, name, genre, image_url, listeners}, ... ]
│
[Client] → GET /api/artists/search?query=name
│  └─ Returns: [ {id, name, genre, listeners}, ... ]
│
[Client] → GET /api/artists/:id
│  └─ Returns: { id, name, bio, genre, image_url, concerts: [] }
│
[Client] → POST /api/artists/:id/favorite
│  ├─ Header: Authorization: Bearer {token}
│  └─ Returns: { message: 'Artist added to favorites' }
│
[Client] → GET /api/artists/user/favorites
│  ├─ Header: Authorization: Bearer {token}
│  └─ Returns: [ {id, name, genre, image_url}, ... ]
```

### 3. Concert Discovery Flow

```
[Client] → GET /api/concerts
│  ├─ Query: ?limit=50
│  └─ Returns: [ {id, event_name, venue_name, city, country, event_date}, ... ]
│
[Client] → GET /api/concerts/user/favorites
│  ├─ Header: Authorization: Bearer {token}
│  ├─ Logic: Gets user's favorite artists + their concerts
│  └─ Returns: [ {concert objects}, ... ]
│
[Client] → GET /api/concerts/user/near
│  ├─ Header: Authorization: Bearer {token}
│  ├─ Logic: Filters concerts by user's country
│  └─ Returns: [ {concert objects in user's area}, ... ]
│
[Client] → GET /api/concerts/details/:id
│  └─ Returns: { ...concert_data, artist: artist_name }
```

### 4. Notification Flow

```
[Client] → GET /api/notifications
│  ├─ Header: Authorization: Bearer {token}
│  ├─ Query: ?limit=50&unread=false
│  └─ Returns: [ {id, artist_name, event_name, message, is_read}, ... ]
│
[Client] → PUT /api/notifications/:id/read
│  ├─ Header: Authorization: Bearer {token}
│  └─ Returns: { message: 'Notification marked as read' }
│
[Client] → DELETE /api/notifications/:id
│  ├─ Header: Authorization: Bearer {token}
│  └─ Returns: { message: 'Notification deleted' }
```

## Database Relationships

```
                    users
                      ↑
                      │ (1:1)
                      │
        notification_preferences
        
        
         user_artists (Junction)
            ↑         ↑
         (M:M)     (M:M)
            │         │
         users    artists ←──→ concerts
            │                    ↑
         (1:M)                 (M:M)
            │                    │
            └──→ listening_history
            
            
         notifications
            ↑       ↑
         (N:1)   (N:1)
            │       │
         users   concerts
```

## Security Considerations

### 1. Authentication
- ✅ Password hashed with bcryptjs (10 rounds)
- ✅ JWT tokens used for session management
- ✅ Token expires in 7 days
- ⚠️ TODO: Implement refresh token mechanism
- ⚠️ TODO: Add HTTPS in production

### 2. Authorization
- ✅ Protected routes check JWT token
- ✅ Users can only access their own data
- ⚠️ TODO: Add role-based access control (RBAC)
- ⚠️ TODO: Add rate limiting per user

### 3. Data Protection
- ✅ SQL Injection prevention (parameterized queries via better-sqlite3)
- ✅ CORS enabled with origin check
- ⚠️ TODO: Add input validation/sanitization
- ⚠️ TODO: Add request logging

### 4. API Security
- ✅ Environment variables for sensitive keys
- ⚠️ TODO: Add API key rotation
- ⚠️ TODO: Add request signing

## Caching Strategy

### Current Implementation
- In-memory: Cron job runs in process memory
- Database: concert_cache table for notification tracking
- Local Storage: JWT token and user data in browser

### Optimization Opportunities
- Redis cache for external API responses
- Cache invalidation on updates
- Implement HTTP caching headers
- Browser caching for static assets

## Error Handling

### Frontend
- Try-catch blocks in API calls
- User-friendly error messages
- Loading states during API calls
- Fallback UI when data unavailable

### Backend
- Middleware error handler in Express
- Validation of input data
- Proper HTTP status codes
- Error logging to console/file

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- CSS minification in build
- Browser caching enabled

### Backend
- Database indexes on frequently queried columns
- Limit API responses with pagination
- Connection pooling for database
- Cache TTL for external API calls

### Database
- Indexes on: user_id, artist_id, event_date
- Efficient JOIN queries in models
- Regular cleanup of old records

## Deployment Considerations

### Development Environment
- SQLite database (file-based)
- Single process Node.js
- Hot reload enabled (nodemon)
- Verbose logging

### Production Environment
- PostgreSQL/MongoDB (networked database)
- Multiple Node.js processes (PM2, Docker)
- Reverse proxy (Nginx)
- Environment-based configuration
- Centralized logging
- Error tracking (Sentry)

## API Rate Limiting (Future)

```
Per User Limits:
- Signup: 5 per hour per IP
- Login: 10 failed attempts = lockout
- API calls: 100 per minute
- External API: 1000 per day per service
```

## Monitoring & Logging (Future)

```
Metrics to Track:
- API response times
- Database query performance
- Cron job success/failure
- User signup/login rates
- Concert alerts created
- API external call success rates
```

---

This architecture is designed to be:
- **Scalable**: Can migrate to cloud with minimal code changes
- **Maintainable**: Clear separation of concerns
- **Secure**: Industry best practices implemented
- **User-Friendly**: Responsive UI with smooth interactions
