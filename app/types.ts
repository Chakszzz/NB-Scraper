/**
 * @fileoverview Type definitions for NB Scraper
 * @author ErRickow
 * @version 1.1.5
 */

/**
 * Standard response structure for all scraper functions
 * @template T - The type of the data property
 * @interface NBScraperResponse
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
 * @interface RequestConfig
 */
export interface RequestConfig {
	timeout ? : number | undefined;
	headers ? : Record < string, string > | undefined;
	retries ? : number | undefined;
	retryDelay ? : number | undefined;
}

export interface AnyDownloadMedia {
  url: string;
  quality: string;
  extension: string;
  size: number;
  formattedSize: string;
  videoAvailable: boolean;
  audioAvailable: boolean;
  chunked: boolean;
  cached: boolean;
}

export interface AnyDownloadResult {
  title: string;
  duration: string | null;
  thumbnail: string;
  downloadUrls: AnyDownloadMedia[];
}

export interface AnyDownloadResponse {
  input_url: string;
  source: string;
  result: AnyDownloadResult;
  error: string | null;
}

export interface AnyDownloaderAPI {
  (url: string): Promise<NBScraperResponse<AnyDownloadResponse>>;
}

export interface YouTubeDownloadResult {
  title: string;
  downloadUrl: string;
  thumbnail?: string;
  quality?: string;
  type: 'mp3' | 'mp4';
  duration?: string;
}

export interface YouTubeMP3Response {
  link: string;
  filename: string;
}

export interface YouTubeVideoResponse {
  progress_url: string;
  info?: {
    image: string;
    title: string;
  };
}

export interface YouTubeProgressResponse {
  progress: number;
  download_url: string;
}

export interface YouTubeDownloaderAPI {
  youtubeMp3(url: string): Promise<NBScraperResponse<YouTubeDownloadResult>>;
  ytdl(url: string, quality?: string): Promise<NBScraperResponse<YouTubeDownloadResult>>;
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
 * @interface ScraperError
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
 * Unaimytext Scraper Types
 */
export type UnaimytextLevel = 'standard' | 'enhanced' | 'aggressive';

export interface UnaimytextSettings {
  removeUnicode?: boolean;
  dashesToCommas?: boolean;
  removeDashes?: boolean;
  transformQuotes?: boolean;
  removeWhitespace?: boolean;
  removeEmDash?: boolean;
  keyboardOnly?: boolean;
}

export interface UnaimytextOptions {
  text: string;
  level?: UnaimytextLevel;
  settings?: UnaimytextSettings;
}

export interface UnaimytextData {
  humanizedText: string;
  level: UnaimytextLevel;
  originalLength: number;
  transformedLength: number;
  reductionPercentage: string;
}

export interface UnaimytextAPI {
    (options: UnaimytextOptions): Promise<NBScraperResponse<UnaimytextData>>;
}

/**
 * BacaKomik Scraper Types
 */
export interface BacaKomikSearchResult {
  title: string;
  url: string;
  image: string;
  type: string;
  score: number;
  genres: string[];
  chapter: string;
}

export interface BacaKomikLatestResult {
  title: string;
  url: string;
  image: string;
  type: string;
  views: number;
  score: number;
  status: string;
  colorized: boolean;
  latestChapter: {
    chapter: string;
    url: string;
    time: string;
  };
}

export interface BacaKomikRecommendationResult {
    title: string;
    url: string;
    image: string;
    type: string;
    score: number;
    status: string;
    recommendedChapter: {
        chapter: string;
        url: string;
        time: string;
    };
}

export interface BacaKomikFilterOptions {
    type?: string;
    status?: string;
    genre?: string[];
    content?: string[];
    demographic?: string[];
    theme?: string[];
}

export interface BacaKomikDetailData {
    id: string;
    title: string;
    synopsis: string;
    score: number;
    status: string;
    cover: string;
    thumbnail: string;
    author: string[];
    genre: string[];
    theme: string[];
    content: string[];
    demographic: string[];
    chapters: {
        chapter: string;
        url: string;
        download: string;
    }[];
}

export interface BacaKomikChapterData {
    id: string;
    title: string;
    chapter: string;
    next: string; // ID for the next chapter
    thumbnail: string;
    readerLink: string;
    adsLink: string;
    images: string[];
}

// API Interfaces
export interface BacaKomikAPI {
  searchComics(keyword: string, page?: number): Promise<NBScraperResponse<{ query: string; paged: number; total: number; data: BacaKomikSearchResult[] }>>;
  getLatestComics(): Promise<NBScraperResponse<{ total: number; data: BacaKomikLatestResult[] }>>;
  getRecommendedComics(): Promise<NBScraperResponse<{ total: number; data: BacaKomikRecommendationResult[] }>>;
  filterComics(options: BacaKomikFilterOptions): Promise<NBScraperResponse<{ filters: BacaKomikFilterOptions; total: number; data: BacaKomikSearchResult[] }>>;
  getComicDetail(idOrUrl: string): Promise<NBScraperResponse<BacaKomikDetailData>>;
  getChapter(idOrUrl: string): Promise<NBScraperResponse<BacaKomikChapterData>>;
}

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

/**
 * Liputan 6 Scraper Types
 */
export interface Liputan6NewsItem {
  title: string;
  link: string;
  thumb?: string;
  summary?: string;
 // author: string;
}

export interface Liputan6SearchResult {
  title: string;
  link: string;
  //author: string;
}

export interface Liputan6NewsDetail {
  title: string;
  description?: string;
  image?: string;
  published?: string;
  author?: string;
  content: string;
}

export interface Liputan6API {
  getHomeNews(): Promise<NBScraperResponse<Liputan6NewsItem[]>>;
  searchNews(query: string): Promise<NBScraperResponse<Liputan6SearchResult[]>>;
  getNewsDetail(url: string): Promise<NBScraperResponse<Liputan6NewsDetail>>;
}

export interface FileUploadResult {
  filename: string;
  downloadUrl: string;
  size: string;
  mimeType: string;
  extension: string;
  uploadedAt: string;
}

export interface FileInfoResult {
  filename: string;
  mimeType: string;
  extension: string;
  size: {
    bytes: number;
    kb: string;
    mb: string;
  };
  isAllowed: boolean;
}

/**
 * Savegram Scraper Types
 */
export interface SavegramItem {
  thumbnail: string;
  quality: string;
  downloadUrl: string;
}

export interface SavegramResult {
  items: SavegramItem[];
}

export interface WeatherMasterOptions {
  lat ? : string;
  lon ? : string;
}

// app/types.ts

/**
 * APKPure Scraper Types
 */
export interface ApkPureTag {
  name: string;
  type: string;
  id: string;
}

export interface ApkPureSearchResultItem {
  key: string;
  packageName: string;
  title: string;
  icon: string;
  installTotal: string;
  scoreTotal: string;
  score: string;
  tags: ApkPureTag[];
  url: string;
  fullUrl: string;
  buttonText: string;
  isInterveneUrl: boolean;
  isConfigTag: boolean;
  showDownloadBtn: boolean;
  downloadTip: string;
  downloadText: string;
  downloadUrl: string;
  fullDownloadUrl: string;
  fileId: string;
  fileSize: number;
  version: string;
  versionCode: number;
  cornerTags: any[]; // Type can be refined if structure is known
  search_suggestion_id: string;
  downloadUrlFile: string;
}

export interface ApkPureSearchOptions {
  keyword: string;
  limit?: number;
  [key: string]: unknown;
}

export interface ApkPureAPI {
    (options: ApkPureSearchOptions): Promise<NBScraperResponse<ApkPureSearchResultItem[]>>;
}

/**
 * YouTube Post Scraper Types
 */
export type YouTubePostType = 'voteImage' | 'voteText' | 'multipleImages' | 'singleImage' | 'videoShare' | 'text';

export interface YouTubePostImage {
  text: string | null;
  url: string | null;
}

export interface YouTubePostData {
  author: string;
  authorUrl: string;
  publishTime: string;
  text: string;
  like: string | null;
  images: YouTubePostImage[] | null;
  videoShareUrl: string | null;
  postType: YouTubePostType;
}

export interface YouTubePostAPI {
  (url: string): Promise<NBScraperResponse<YouTubePostData>>;
}

/**
 * AI Lyrics Generator Types
 */
export type LyricsGeneratorGenre = 'pop' | 'rock' | 'folk' | 'rap' | 'rnb' | 'jazz' | 'classical' | 'electronic' | 'country' | 'blues';
export type LyricsGeneratorMood = 'happy' | 'sad' | 'romantic' | 'energetic' | 'peaceful' | 'melancholic' | 'angry' | 'hopeful' | 'nostalgic' | 'uplifting';
export type LyricsGeneratorStructure = 'verse_chorus' | 'verse_chorus_bridge' | 'verse_prechorus_chorus' | 'verse_chorus_bridge_chorus' | 'verse_only' | 'chorus_only';
export type LyricsGeneratorLanguage = 'en' | 'id';

export interface LyricsGeneratorOptions {
  topic: string;
  genre?: LyricsGeneratorGenre;
  mood?: LyricsGeneratorMood;
  structure?: LyricsGeneratorStructure;
  language?: LyricsGeneratorLanguage;
  [key: string]: unknown;
}

export interface LyricsGeneratorData {
  title: string;
  lyrics: string;
  topic: string;
  genre: string;
  mood: string;
  structure: string;
  language: string;
}

export interface LyricsGeneratorAPI {
    (options: LyricsGeneratorOptions): Promise<NBScraperResponse<LyricsGeneratorData>>;
}

/**
 * Detailed Weather Data Interfaces for WeatherMaster Scraper
 * Based on TimeZoneDB, Open-Meteo, and WeatherAPI.com responses.
 */

export interface TimezoneResponse {
  status: string;
  message: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  cityName: string;
  zoneName: string;
  abbreviation: string;
  gmtOffset: number;
  dst: string;
  zoneStart: number | null;
  zoneEnd: number | null;
  nextAbbreviation: string | null;
  timestamp: number;
  formatted: string;
}

export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  is_day: string;
  apparent_temperature: string;
  pressure_msl: string;
  relative_humidity_2m: string;
  precipitation: string;
  weather_code: string;
  cloud_cover: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  wind_gusts_10m: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  is_day: number;
  apparent_temperature: number;
  pressure_msl: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyUnits {
  time: string;
  wind_speed_10m ? : string;
  wind_direction_10m ? : string;
  relative_humidity_2m: string;
  pressure_msl: string;
  cloud_cover: string;
  temperature_2m: string;
  dew_point_2m: string;
  apparent_temperature: string;
  precipitation_probability: string;
  precipitation: string;
  weather_code: string;
  visibility: string;
  uv_index: string;
}

export interface HourlyData {
  time: string[];
  wind_speed_10m ? : number[];
  wind_direction_10m ? : number[];
  relative_humidity_2m: number[];
  pressure_msl: number[];
  cloud_cover: number[];
  temperature_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  visibility: number[];
  uv_index: number[];
}

export interface DailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  sunrise: string;
  sunset: string;
  daylight_duration: string;
  uv_index_max: string;
  precipitation_sum: string;
  precipitation_probability_max: string;
  precipitation_hours: string;
  wind_speed_10m_max: string;
  wind_gusts_10m_max: string;
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration: number[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  precipitation_hours: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeatherExtended {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface DayForecast {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
}

export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

export interface HourForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  snow_cm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  astro: Astro;
  hour: HourForecast[];
}

export interface Forecast {
  forecastday: ForecastDay[];
}

export interface Astronomy {
  astro: Astro;
}

export interface Alerts {
  alert: any[]; // this type i can't included, because the response api is too large
}

// Open-Meteo Weather Data Structure
export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units ? : CurrentWeatherUnits;
  current ? : CurrentWeather;
  hourly_units ? : HourlyUnits;
  hourly ? : HourlyData;
  daily_units ? : DailyUnits;
  daily ? : DailyData;
}

// WeatherAPI.com General Response Structure
export interface WeatherAPIResponse {
  location: Location;
  current ? : CurrentWeatherExtended;
  forecast ? : Forecast;
  astronomy ? : Astronomy; // For astronomy.json endpoint
  alerts ? : Alerts; // For alerts.json endpoint
}


/**
 * LaraTranslate Scraper Types
 */
export type LaraTranslateMode = 'Faithful' | 'Fluid' | 'Creative' | 'Custom';

export interface LaraTranslateOptions {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  mode?: LaraTranslateMode;
  customInstructions?: string[];
}

export interface LaraTranslateData {
  mode: LaraTranslateMode;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  quota: number;
}

export interface LaraAPI {
  (options: LaraTranslateOptions): Promise<NBScraperResponse<LaraTranslateData>>;
}

/**
 * TikTok Scraper Types
 */
export interface TikTokPhoto {
  index: number;
  imageUrl: string;
  downloadUrl: string;
  type: 'photo';
}

export interface TikTokVideoLink {
  type: 'video';
  url: string;
  quality: 'HD' | 'Normal' | string;
  label: string;
}

export interface TikTokRenderData {
  hasRenderButton: boolean;
  token?: string;
  isAd?: boolean;
  type?: 'render';
}

export interface TikTokData {
  originalUrl: string;
  title: string;
  author: string;
  thumbnail: string;
  contentType: 'slideshow' | 'video';
  downloadLinks: TikTokVideoLink[];
  photos: TikTokPhoto[];
  renderData: TikTokRenderData;
}

export interface TikTokAPI {
  (url: string): Promise<NBScraperResponse<TikTokData>>;
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
 * @interface NBScraperConfig
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

export interface LemonWriteOptions {
  font?: string;
  color?: string;
  size?: string;
}

export interface LemonWriteResult {
  imageBuffer: Buffer;
  contentType: string;
}

/**
 * Low-level response from the canvas writer.
 */
export interface WriteCanvas {
  /** HTTP-like status code (200 = OK) */
  status: number;
  /** Generated image data */
  message: Buffer;
}
