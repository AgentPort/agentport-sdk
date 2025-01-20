// Default model settings
export const DEFAULT_MODEL = 'claude-2'
export const DEFAULT_MAX_TOKENS = 4096
export const DEFAULT_TEMPERATURE = 0.7

// API endpoints and versions
export const API_VERSION = 'v1'
export const BASE_URL = 'https://api.anthropic.com'

// Message roles
export const SYSTEM_ROLE = 'system'
export const USER_ROLE = 'user'
export const ASSISTANT_ROLE = 'assistant'

// Common status codes
export const SUCCESS_CODE = 200
export const ERROR_CODE = 400

// Rate limiting constants
export const MAX_RETRIES = 3
export const RETRY_DELAY = 1000 // milliseconds

// Anthropic specific constants
export const ANTHROPIC_MAX_TOKENS = 100000
export const ANTHROPIC_DEFAULT_MODEL = Anthropic.HUMAN_PROMPT

// Timeout settings
export const REQUEST_TIMEOUT = 30000 // milliseconds
export const STREAM_TIMEOUT = 60000 // milliseconds

// Buffer sizes
export const DEFAULT_CHUNK_SIZE = 1024
export const MAX_BUFFER_SIZE = 10485760 // 10MB
