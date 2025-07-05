/**
 * @fileoverview Threads media scraper implementation
 * @author NB Team
 * @version 1.0.0
 */

import { 
  NBScraperResponse, 
  ThreadsMediaData, 
  ThreadsOptions 
} from '../types.js';
import { 
  createErrorResponse, 
  createSuccessResponse, 
  makeRequest, 
  validateRequiredParams,
  isValidUrl,
  extractDomain
} from '../utils.js';

/**
 * @alpha
 * Scrapes media URLs from Threads posts
 * 
 * @example
 * ```typescript
 * import { threads } from 'nb-scraper';
 * 
 * const result = await threads('https://www.threads.net/@username/post/123456789');
 * if (result.status) {
 *   console.log('Images:', result.data.image_urls);
 *   console.log('Videos:', result.data.video_urls);
 * }
 * ```
 * 
 * @param url - The Threads post URL to scrape
 * @param options - Optional configuration for the request
 * @returns Promise resolving to media URLs from the post
 * 
 * @throws Will not throw errors, returns error response instead
 * 
 * @author Rian
 */
export async function threads(
  url: string,
  options: ThreadsOptions = {}
): Promise<NBScraperResponse<ThreadsMediaData>> {
  try {
    // Validate input parameters
    validateRequiredParams({ url }, ['url']);

    // Validate URL format
    const sanitizedUrl = url.trim();
    if (!isValidUrl(sanitizedUrl)) {
      return createErrorResponse('Invalid URL format', { url: sanitizedUrl });
    }

    // Check if URL is from Threads
    const domain = extractDomain(sanitizedUrl);
    if (!domain?.includes('threads.net')) {
      return createErrorResponse('URL must be from threads.net', { domain, url: sanitizedUrl });
    }

    // Prepare API URL
    const apiUrl = `https://api.threadsphotodownloader.com/v2/media?url=${encodeURIComponent(sanitizedUrl)}`;

    // Prepare request headers
    const headers = {
      'User-Agent': '5.0',
      'Accept': 'application/json',
      'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
      ...options.headers
    };

    // Make the request
    const response = await makeRequest(
      {
        method: 'GET',
        url: apiUrl,
        headers
      },
      {
        timeout: options.timeout,
        retries: options.retries,
        retryDelay: options.retryDelay
      }
    );

    // Validate response
    if (!response.data || typeof response.data !== 'object') {
      return createErrorResponse('Invalid response format from Threads API', {
        responseType: typeof response.data,
        status: response.status
      });
    }

    const rawData = response.data as Record<string, unknown>;

    // Parse and validate media URLs
    const imageUrls = parseMediaUrls(rawData.image_urls);
    const videoUrls = parseMediaUrls(rawData.video_urls);

    // Apply filters based on options
    let filteredData: ThreadsMediaData = {
      image_urls: imageUrls,
      video_urls: videoUrls
    };

    if (options.imagesOnly) {
      filteredData.video_urls = [];
    } else if (options.videosOnly) {
      filteredData.image_urls = [];
    }

    // Check if any media was found
    if (filteredData.image_urls.length === 0 && filteredData.video_urls.length === 0) {
      return createErrorResponse('No media found in the Threads post', { 
        url: sanitizedUrl,
        rawImageCount: imageUrls.length,
        rawVideoCount: videoUrls.length
      });
    }

    return createSuccessResponse(filteredData);

  } catch (error) {
    return createErrorResponse(error as Error, { 
      url: url.substring(0, 100),
      options: { ...options, headers: undefined }
    });
  }
}

/**
 * Parses and validates media URLs from API response
 * @param urls - Raw URLs data from API
 * @returns Array of valid URL strings
 * @internal
 */
function parseMediaUrls(urls: unknown): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls
    .filter((url): url is string => 
      typeof url === 'string' && 
      url.trim().length > 0 && 
      isValidUrl(url.trim())
    )
    .map(url => url.trim())
    .slice(0, 50); // Limit to prevent memory issues
}