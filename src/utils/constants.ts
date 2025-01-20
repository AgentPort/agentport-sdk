// API Endpoints
export const API_BASE_URL = 'https://api.agentport.fun';
export const API_VERSION = 'v1';

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Request Headers
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept'
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  TEXT: 'text/plain'
} as const;

// Default Request Timeout (in milliseconds)
export const DEFAULT_TIMEOUT = 30000;

// Rate Limiting
export const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  TIME_WINDOW: 60000 // 1 minute in milliseconds
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timed out',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid API token',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded'
} as const;

// SDK Version
export const SDK_VERSION = '1.0.0';

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 30 * 60 * 1000,  // 30 minutes
  LONG: 60 * 60 * 1000     // 1 hour
} as const;
