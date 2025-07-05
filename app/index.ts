/**
 * 
 * @packageDocumentation
 * @categoryDescription NB Scraper Module
 * This is all the necessary function from [NB-Scraper](https://npm.com/) library
 * @since 1.2.6
 *
 */
// Export all scrapers
export * from './scrapers/index';

// Export types
export type {
	NBScraperResponse,
	NBScraperConfig,
	RequestConfig,
	ScraperError,
	ScraperErrorType,
  ApkPureAPI,
  ApkPureTag,
  ApkPureSearchOptions,
  ApkPureSearchResultItem,
  LyricsGeneratorAPI,
  LyricsGeneratorData,
  LyricsGeneratorOptions,
  YouTubePostAPI,
  YouTubePostData,
  YouTubePostImage,
  AnyDownloaderAPI,
  AnyDownloadMedia,
  AnyDownloadResponse,
  AnyDownloadResult,
  AnimeIndoAPI,
  AnimeIndoDetail,
  AnimeIndoDownloadInfo,
  AnimeIndoEpisode,
  AnimeIndoSearchResult,
  BlackBoxAIData,
  BlackBoxAIOptions,
  BlackBoxSource,
  BacaKomikAPI,
  BacaKomikChapterData,
  BacaKomikDetailData,
  BacaKomikFilterOptions,
  BacaKomikLatestResult,
  BacaKomikRecommendationResult,
  BacaKomikSearchResult,
  ExomlAPIMessage,
  ExomlAPIOptions,
  ExomlAPIData,
  ExomlAPIRandomData,
  PollinationsOptions,
  PollinationsData,
  SoundCloudApiResponse,
  SoundCloudApiTrack,
  SoundCloudTrack,
  SoundCloudSearchOptions,
  SoundCloudData,
  SoundCloudCache,
  DreamAnalysisOptions,
  DreamAnalysisData,
  DeepInfraAIData,
  DeepInfraAIOptions,
  DeepInfraAIMessage,
  DeepInfraAIModel,
  DeepInfraAIRequest,
  DeepInfraAIResponse,
  Liputan6API,
  Liputan6NewsDetail,
  Liputan6NewsItem,
  Liputan6SearchResult,
  ThreadsMediaData,
  ThreadsOptions,
  TikTokAPI,
  TikTokData,
  TikTokPhoto,
  TikTokRenderData,
  TikTokVideoLink,
  SavegramItem,
  SavegramResult,
  WeatherData,
  WeatherAPIResponse,
  WeatherMasterOptions,
  CurrentWeather,
  CurrentWeatherExtended,
  CurrentWeatherUnits,
  HourlyData,
  HourlyUnits,
  HourForecast,
  TimezoneResponse,
  Condition,
  Location,
  DailyData,
  DailyUnits,
  Astronomy,
  Astro,
  Forecast,
  ForecastDay,
  DayForecast,
  CharSetOptions,
  FileInfoResult,
  FileUploadResult,
  UnaimytextAPI,
  UnaimytextData,
  UnaimytextOptions,
  UnaimytextSettings,
  LaraAPI,
  LaraTranslateData,
  LaraTranslateOptions,
  FacebookDownloaderAPI,
  FacebookDownloadLink,
  FacebookVideoData,
  PinterestData,
  YouTubeDownloaderAPI,
  YouTubeDownloadResult,
  YouTubeMP3Response,
  YouTubeProgressResponse,
  YouTubeVideoResponse,
  WriteCanvas,
  LemonWriteResult,
  LemonWriteOptions,
  SSYoutubeAPI,
  SSYoutubeData,
  SSYoutubeDownloadFormat,
  FFStalkAPI,
  FFStalkData,
  FFStalkAccountInfo,
  FFStalkEquipped,
  FFStalkEquippedItem,
  FFStalkGuildInfo,
  FFStalkPetInfo,
  TranslateEcommerceOptions,
  TranslateImageAPI,
  TranslateImageCredentials,
  TranslateImageOptions,
  TranslateImageResult,
  TranslateMangaOptions,
  Alerts
} from './types';

export * from './re-export';

// Export utilities (for advanced users)
export {
	createErrorResponse,
	createSuccessResponse,
	isValidUrl,
	sanitizeString,
	extractDomain,
	formatBytes,
	DEFAULT_CONFIG,
	CREATOR
} from './utils';

/**
 * Library version
 * @public
 */
export const VERSION = "1.2.6";

/**
 * Library information
 * @public
 */
export const INFO = {
	name: 'nb-scraper',
	version: VERSION,
	author: 'Er Rickow',
	description: 'NB Community scraper library',
	repository: 'https://github.com/chakszzz/nb-scraper',
	documentation: 'https://nb-scraper.js.org'
} as const;
