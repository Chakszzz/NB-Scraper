/**
 * NB Scraper - Community scraper library by Er Rickow
 * 
 * @packageDocumentation
 * @since 1.1.3
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
	FacebookDownloaderAPI,
	FacebookDownloadLink,
	FacebookVideoData,
	PinterestData,
	YouTubeDownloaderAPI,
	YouTubeDownloadResult,
	YouTubeMP3Response,
	YouTubeProgressResponse,
	YouTubeVideoResponse
}
from './types';

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
}
from './utils';

/**
 * Library version
 * @public
 */
export const VERSION = "1.1.9";

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
	documentation: 'https://Chakszzz.github.io/NB-Scraper'
} as const;