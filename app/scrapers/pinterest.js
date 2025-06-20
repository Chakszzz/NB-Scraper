/**
 * @fileoverview Pinterest Scraper
 * @author Wolep
 * @version 1.0.0
 */
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
/**
 * @alpha
 * Search Pinterest from the given query
 *
 * @example
 * ```typescript
 * import { Pinterest } from 'nb-scraper';
 *
 * const result = await Pinterest('jagung');
 * if (result.status) {
 *   console.log(result.data.result);
 * }
 * ```
 *
 * @param query - The query to search content on Pinterest
 * @param options - Optional request configuration
 * @returns Promise resolving Array of image URLs
 *
 * @throws Returns error response
 *
 * @author Wolep
 */
export async function pinterest(query, options) {
  try {
    // Validate required parameters
    validateRequiredParams({ query }, ["query"]);
    // Prepare the request
    const searchUrl =
      "https://www.pinterest.com/resource/BaseSearchResource/get/";
    const params = new URLSearchParams({
      data: JSON.stringify({
        options: {
          query: query,
        },
      }),
    });
    const response = await makeRequest(
      {
        url: `${searchUrl}?${params.toString()}`,
        method: "HEAD",
        headers: {
          "screen-dpr": "4",
          "x-pinterest-pws-handler": "www/search/[scope].js",
          ...options?.headers,
        },
      },
      options,
    );
    // Extract links from response headers
    const linkHeader = response.headers.link;
    if (!linkHeader) {
      return createErrorResponse("No results found for the query", {
        type: ScraperErrorType.INVALID_RESPONSE,
        context: { query },
      });
    }
    // Parse the links from the header
    const links = [...linkHeader.matchAll(/<(.*?)>/gm)].map((v) => v[1]);
    return createSuccessResponse({
      result: links,
    });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.NETWORK_ERROR,
      context: { query },
    });
  }
}
