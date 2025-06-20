import * as cheerio from "cheerio";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequiredParams,
  makeRequest,
} from "../utils";
/**
 * Get token from the website
 */
async function getToken() {
  try {
    const config = {
      method: "GET",
      url: "https://anydownloader.com/en/xiaohongshu-videos-and-photos-downloader",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
      },
    };
    const response = await makeRequest(config);
    if (!response.status || !response.data) {
      return createErrorResponse("Failed to fetch token page", {
        type: ScraperErrorType.AUTH_ERROR,
      });
    }
    const $ = cheerio.load(response.data);
    const token = $("#token").val();
    if (!token) {
      return createErrorResponse("Token not found in page", {
        type: ScraperErrorType.NOT_FOUND,
      });
    }
    return createSuccessResponse({ token });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.NETWORK_ERROR,
    });
  }
}
/**
 * Calculate hash for the request
 */
function calculateHash(url, salt) {
  return (
    Buffer.from(url).toString("base64") +
    (url.length + 1000) +
    Buffer.from(salt).toString("base64")
  );
}
/**
 * @beta
 * Download content from any source
 * @param url - Xiaohongshu URL (e.g., http://xhslink.com/a/aTl9Mau0KNWeb)
 * @example
 * ```ts
 * import { anyDownloader } from 'nb-scraper'
 *
 * const result = await anyDownloader("https://url.content.com") //eg. video facebook, ig etc
 * console.log(result.data)
 * ```
 * @author Paxsenix0
 */
export async function anyDownloader(url) {
  try {
    // Validate URL format
    validateRequiredParams({ url }, ["url"]);
    // Get token first
    const tokenResponse = await getToken();
    if (!tokenResponse.status || !tokenResponse.data?.token) {
      return createErrorResponse(
        tokenResponse.error ?? "Failed to obtain token",
        { type: ScraperErrorType.AUTH_ERROR },
      );
    }
    const { token } = tokenResponse.data;
    const hash = calculateHash(url, "aio-dl");
    // Prepare request data
    const data = new URLSearchParams();
    data.append("url", url);
    data.append("token", token);
    data.append("hash", hash);
    const config = {
      method: "POST",
      url: "https://anydownloader.com/wp-json/aio-dl/video-data/",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://anydownloader.com",
        Referer:
          "https://anydownloader.com/en/xiaohongshu-videos-and-photos-downloader",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
      data: data.toString(),
    };
    const response = await makeRequest(config);
    if (!response.status || !response.data) {
      return createErrorResponse("Failed to fetch video data", {
        type: ScraperErrorType.API_ERROR,
      });
    }
    // If API returns error in its response
    if (response.data.error) {
      return createErrorResponse(response.data.error, {
        type: ScraperErrorType.API_ERROR,
      });
    }
    return createSuccessResponse(response.data);
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.API_ERROR,
    });
  }
}
