# Socket.IO WebRTC MERN Project API Documentation

## Table of Contents
1. [Authentication APIs](#1-authentication-apis)
2. [Room Management APIs](#2-room-management-apis)
3. [Socket.IO Events](#3-socketio-events)
4. [Friend Management APIs](#4-friend-management-apis)
5. [Error Responses](#5-error-responses)
6. [WebSocket Connection](#6-websocket-connection)
7. [Security](#7-security)

## 1. Authentication APIs

### Login
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "string",
  "userDetails": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### Register
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "string",
  "userDetails": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

## 2. Room Management APIs

### Create Room
```http
POST /api/rooms/create
```
**Headers:**
```
Authorization: Bearer <token>
```
**Response:**
```json
{
  "roomId": "string",
  "ownerId": "string",
  "createdAt": "timestamp"
}
```

### Join Room
```http
POST /api/rooms/join
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "roomId": "string"
}
```
**Response:**
```json
{
  "success": true,
  "roomDetails": {
    "roomId": "string",
    "participants": ["string"],
    "ownerId": "string"
  }
}
```

### Leave Room
```http
POST /api/rooms/leave
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "roomId": "string"
}
```
**Response:**
```json
{
  "success": true
}
```

## 3. Socket.IO Events

### Room Events

#### Room Creation
```javascript
// Emit
socket.emit('room-create', { userId: string });

// Listen
socket.on('room-created', (data) => {
  roomId: string,
  ownerId: string
});
```

#### Room Join
```javascript
// Emit
socket.emit('room-join', { 
  roomId: string,
  userId: string 
});

// Listen
socket.on('room-joined', (data) => {
  roomId: string,
  participants: [string],
  ownerId: string
});
```

#### Room Leave
```javascript
// Emit
socket.emit('room-leave', { 
  roomId: string,
  userId: string 
});

// Listen
socket.on('user-left', (data) => {
  userId: string,
  roomId: string
});
```

### WebRTC Events

#### Offer
```javascript
// Emit
socket.emit('webrtc-offer', {
  calleeId: string,
  offer: RTCSessionDescription
});

// Listen
socket.on('webrtc-offer', (data) => {
  callerId: string,
  offer: RTCSessionDescription
});
```

#### Answer
```javascript
// Emit
socket.emit('webrtc-answer', {
  callerId: string,
  answer: RTCSessionDescription
});

// Listen
socket.on('webrtc-answer', (data) => {
  calleeId: string,
  answer: RTCSessionDescription
});
```

#### ICE Candidate
```javascript
// Emit
socket.emit('webrtc-ice-candidate', {
  calleeId: string,
  candidate: RTCIceCandidate
});

// Listen
socket.on('webrtc-ice-candidate', (data) => {
  callerId: string,
  candidate: RTCIceCandidate
});
```

## 4. Friend Management APIs

### Send Friend Request
```http
POST /api/friends/request
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "receiverId": "string"
}
```
**Response:**
```json
{
  "success": true,
  "requestId": "string"
}
```

### Accept Friend Request
```http
POST /api/friends/accept
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "requestId": "string"
}
```
**Response:**
```json
{
  "success": true
}
```

### Get Friends List
```http
GET /api/friends/list
```
**Headers:**
```
Authorization: Bearer <token>
```
**Response:**
```json
{
  "friends": [
    {
      "id": "string",
      "username": "string",
      "status": "online|offline"
    }
  ]
}
```

## 5. Error Responses

All APIs return errors in the following format:
```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Common error codes:
- `AUTH_ERROR`: Authentication related errors
- `ROOM_ERROR`: Room management errors
- `FRIEND_ERROR`: Friend management errors
- `VALIDATION_ERROR`: Input validation errors
- `SERVER_ERROR`: Server-side errors

## 6. WebSocket Connection

### Connection URL
```
ws://your-domain/socket.io
```

### Connection Parameters
```javascript
const socket = io('ws://your-domain', {
  auth: {
    token: 'your-jwt-token'
  },
  transports: ['websocket']
});
```

### Connection Events
```javascript
// Connection established
socket.on('connect', () => {
  console.log('Connected to server');
});

// Connection error
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Disconnected
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

## 7. Security

### Authentication
- All API endpoints (except login/register) require JWT token
- Token should be included in Authorization header
- Token format: `Bearer <token>`

### WebSocket Security
- Socket connections require valid JWT token
- Token is validated on connection
- Unauthorized connections are rejected

### Rate Limiting
- API endpoints are rate-limited
- Default limit: 100 requests per minute
- WebSocket connections: 5 per IP

---

## Project Architecture

### Frontend Structure
```
react_frontend/
├── src/
│   ├── Dashboard/
│   │   ├── Room/
│   │   │   ├── RoomButtons/
│   │   │   └── VideoContainer.js
│   │   ├── AppBar/
│   │   ├── FriendsSideBar/
│   │   └── Messenger/
│   ├── store/
│   ├── realtimeCommunication/
│   └── authPages/
```

### Backend Structure
```
node_backend/
├── socketServer.js
├── routes/
│   ├── auth.js
│   ├── rooms.js
│   └── friends.js
└── models/
    ├── User.js
    └── Room.js
```

### Data Flow
1. User Authentication
   - JWT Token → Redux Store
2. Room Creation/Joining
   - Socket Event → Backend → Room Creation → Frontend Update
3. WebRTC Connection
   - Local Stream → Peer Connection → Remote Stream
4. Real-time Communication
   - Message → Socket → Backend → Broadcast → Frontend

### State Management
- Redux for global state
- Local state for component-specific data
- Socket.IO for real-time updates
- WebRTC for peer-to-peer communication

---

## Development Guidelines

### Code Style
- Use ES6+ features
- Follow React best practices
- Implement proper error handling
- Use TypeScript where possible

### Testing
- Unit tests for components
- Integration tests for API endpoints
- Socket.IO event testing
- WebRTC connection testing

### Deployment
- Frontend: Static hosting (e.g., Netlify, Vercel)
- Backend: Node.js hosting (e.g., Heroku, AWS)
- WebSocket: Requires WebSocket support
- Database: MongoDB hosting (e.g., MongoDB Atlas)

---

## Troubleshooting

### Common Issues
1. Socket Connection Failed
   - Check network connectivity
   - Verify WebSocket support
   - Validate JWT token

2. WebRTC Connection Issues
   - Check browser compatibility
   - Verify STUN/TURN servers
   - Check firewall settings

3. Authentication Errors
   - Validate token expiration
   - Check token format
   - Verify user credentials

### Debugging Tools
- Browser DevTools
- Socket.IO Debug
- WebRTC Internals
- Network Monitor

---

## Support

For issues and feature requests, please create an issue in the project repository.

## License

This project is licensed under the MIT License. 