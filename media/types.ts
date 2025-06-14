/**
 * @fileoverview Type definitions for NB Scraper
 * @author ErRickow
 * @version 1.1.0
 */

/**
 * Standard response structure for all scraper functions
 * @template T - The type of the data property
 */
export interface NBScraperResponse<T = unknown> {
  /** The creator/author of this scraper */
  creator: string;
  /** Whether the operation was successful */
  status: boolean;
  /** The scraped data (only present when status is true) */
  data?: T;
  /** Error message (only present when status is false) */
  error?: string;
}

/**
 * Configuration options for HTTP requests
 */
export interface RequestConfig {
	timeout ? : number | undefined;
	headers ? : Record < string, string > | undefined;
	retries ? : number | undefined;
	retryDelay ? : number | undefined;
}

/**
 * Error types that can occur during scraping
 */
export enum ScraperErrorType {
  /** Network-related errors (connection, timeout, etc.) */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Invalid or malformed input parameters */
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  INVALID_INPUT = 'INVALID_INPUT',
  /** API returned an unexpected response format */
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  /** Rate limiting or quota exceeded */
  RATE_LIMITED = 'RATE_LIMITED',
  /** Service is temporarily unavailable */
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  /** Authentication or authorization failed */
  AUTH_ERROR = 'AUTH_ERROR',
  /** Error parsing response data */
  PARSE_ERROR = 'PARSE_ERROR',
  /** Error during image generation */
  IMAGE_GENERATION_ERROR = 'IMAGE_GENERATION_ERROR',
  /** Error calling external API */
  API_ERROR = 'API_ERROR',
  DOWNLOAD_ERROR = 'DOWNLOAD_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  QUALITY_NOT_AVAILABLE = 'QUALITY_NOT_AVAILABLE',
  /** Unknown or unexpected error */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Detailed error information
 */
export interface ScraperError {
  /** The type of error that occurred */
  type: ScraperErrorType;
  /** Human-readable error message */
  message: string;
  /** Original error object (if available) */
  originalError?: Error;
  /** Additional context about the error */
  context?: Record<string, unknown>;
}

/* ==================== Scraper-Specific Types ==================== */

/**
 * Pollinations AI Image Generation Types
 */
export interface PollinationsOptions {
  prompt: string;
  nologo ? : boolean;
  [key: string]: unknown; // index signature
}

export interface PollinationsData {
  /** URL of the generated image on Catbox.moe */
  url: string;
  /** Direct Pollinations image URL */
  directUrl: string;
}

/**
 * Pinterest Scraper Types
 */
export interface PinterestData {
  /** Array of image URLs */
  result: string[];
}

export interface FacebookDownloadLink {
  quality: string;
  format: 'mp4' | 'unknown';
  link: string;
}

export interface FacebookVideoData {
  title: string;
  duration: string;
  thumbnail: string;
  links: FacebookDownloadLink[];
}

export interface FacebookDownloaderAPI {
  (url: string): Promise < NBScraperResponse < FacebookVideoData >> ;
}

/**
 * SoundCloud Scraper Types
 */
export interface SoundCloudTrack {
  id: number;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
  author: {
    name: string;
    url: string;
  };
  like_count: string;
  download_count: string;
  play_count: string;
  release_date: string | null;
}

export interface SoundCloudApiResponse {
  collection: SoundCloudApiTrack[];
}

export interface SoundCloudApiTrack {
  id: number;
  title: string;
  permalink_url: string;
  duration: number;
  artwork_url: string;
  user: {
    username: string;
    permalink_url: string;
  };
  likes_count: number;
  download_count: number;
  playback_count: number;
  created_at: string;
  release_date ? : string;
}

export interface SoundCloudSearchOptions {
  query: string;
  limit?: number;
  [key: string]: unknown;
}

export interface SoundCloudData {
  tracks: SoundCloudTrack[];
}

export interface SoundCloudCache {
  version: string;
  id: string;
}

/**
 * ExomlAPI AI Text Completion Types
 */
export interface ExomlAPIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ExomlAPIOptions extends Record<string, unknown> {
  messages: ExomlAPIMessage[];
  systemPrompt?: string;
  model?: string;

}

export interface ExomlAPIData {
  content: string;
}

export interface ExomlAPIRandomData {
  id: string;
  chatId: string;
  userId: string;
  antiBotId: string;
}

export interface CharSetOptions {
  lowerCase ? : boolean;
  upperCase ? : boolean;
  symbol ? : boolean;
  number ? : boolean;
}

/**
 * DeepInfra AI Chat Types
 */
export interface DeepInfraAIOptions extends Record<string, unknown> {
  prompt: string;
  model?: DeepInfraAIModel;
}

export type DeepInfraAIModel = 
  | 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
  | 'deepseek-ai/DeepSeek-R1'
  | 'Qwen/Qwen2.5-72B-Instruct'
  | string; // Allow custom models

export interface DeepInfraAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  parts: Array<{
    type: 'text' | string;
    text: string;
  }>;
}

export interface DeepInfraAIRequest {
  id: string;
  selectedModel: DeepInfraAIModel;
  messages: DeepInfraAIMessage[];
}

export interface DeepInfraAIResponse {
  /** Generated text */
  g?: string | string[];
  /** Follow-up text */
  f?: string | string[];
  /** Primary response */
  '0'?: string | string[];
  [key: string]: unknown; // Allow other properties
}

export interface DeepInfraAIData {
  response: string;
}

/**
 * DreamAnalysis Types
 */
export interface DreamAnalysisOptions {
  text: string;
  isPremium?: boolean;
  [key: string]: unknown; // index signature
}

export interface DreamAnalysisData {
  analysis?: string;
  interpretation?: string;
  symbols?: {
    name: string;
    meaning: string;
    relevance: number;
  }[];
  emotions?: string[];
  themes?: string[];
  /** Additional metadata from analysis */
  metadata?: Record<string, unknown>;
}

/**
 * BlackBox AI Types
 */
export interface BlackBoxAIData {
  /** The AI's response text */
  response: string;
  /** Array of sources used by the AI */
  source: BlackBoxSource[];
}

export interface BlackBoxSource {
  /** URL of the source */
  link: string;
  /** Title of the source */
  title: string;
  /** Text snippet from the source */
  snippet: string;
  /** Position/ranking of the source */
  position: number;
}

export interface BlackBoxAIOptions extends RequestConfig {
  /** Maximum number of tokens in the response */
  maxTokens?: number;
  /** Temperature for response generation (0-1) */
  temperature?: number;
  /** Whether to enable web search mode */
  webSearchMode?: boolean;
  /** Whether to enable memory/context */
  memoryEnabled?: boolean;
  [key: string]: unknown;
}

/**
 * Threads Scraper Types
 */
export interface ThreadsMediaData {
  /** Array of image URLs */
  image_urls: string[];
  /** Array of video URLs */
  video_urls: string[];
}

export interface ThreadsOptions extends RequestConfig {
  /** Whether to include only images */
  imagesOnly?: boolean;
  /** Whether to include only videos */
  videosOnly?: boolean;
  [key: string]: unknown;
}

export interface AnimeIndoSearchResult {
  title: string;
  link: string;
  image: string;
  year: string;
  description: string;
  rating?: string;
  status?: string;
}

export interface AnimeIndoEpisode {
  episode: string;
  link: string;
  date?: string;
  downloadLinks?: {
    server: string;
    url: string;
  }[];
}

export interface AnimeIndoDetail {
  title: string;
  image: string;
  genres: string[];
  description: string;
  episodes: AnimeIndoEpisode[];
  rating?: string;
  status?: string;
  duration?: string;
  studio?: string;
}

export interface AnimeIndoDownloadInfo {
  title: string;
  description: string;
  videoLinks: Array<{
    label: string;
    videoUrl: string;
    quality?: string;
  }>;
  gdriveHdLink: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  mimetype: string;
  thumbnail?: string;
  duration?: string;
  subtitles?: {
    language: string;
    url: string;
  }[];
}

export interface AnimeIndoAPI {
  search(query: string): Promise<NBScraperResponse<AnimeIndoSearchResult[]>>;
  detail(url: string): Promise<NBScraperResponse<AnimeIndoDetail>>;
  download(episodeUrl: string): Promise<NBScraperResponse<AnimeIndoDownloadInfo>>;
}

/**
 * Global configuration for the scraper library
 */
export interface NBScraperConfig {
  /** Default timeout for all requests */
  defaultTimeout: number;
  /** Default number of retries */
  defaultRetries: number;
  /** Default retry delay */
  defaultRetryDelay: number;
  /** Whether to log detailed error information */
  verboseErrors: boolean;
  /** Custom user agent string */
  userAgent: string;
}