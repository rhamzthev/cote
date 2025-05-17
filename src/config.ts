const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  baseUrl: isDevelopment 
    ? 'http://localhost:8080'  // Development HTTP
    : 'https://api.cote.rhamzthev.com',  // Production HTTPS
  wsUrl: isDevelopment
    ? 'ws://localhost:8080'  // Development WebSocket
    : 'wss://api.cote.rhamzthev.com',  // Production WebSocket
}; 