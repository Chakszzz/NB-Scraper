/**
 * @fileoverview Type definitions for NB Scraper
 * @author ErRickow
 * @version 1.1.4
 */
/**
 * Error types that can occur during scraping
 */
export var ScraperErrorType;
(function (ScraperErrorType) {
  /** Network-related errors (connection, timeout, etc.) */
  ScraperErrorType["NETWORK_ERROR"] = "NETWORK_ERROR";
  /** Invalid or malformed input parameters */
  ScraperErrorType["INVALID_PARAMETER"] = "INVALID_PARAMETER";
  ScraperErrorType["INVALID_INPUT"] = "INVALID_INPUT";
  /** API returned an unexpected response format */
  ScraperErrorType["INVALID_RESPONSE"] = "INVALID_RESPONSE";
  /** Rate limiting or quota exceeded */
  ScraperErrorType["RATE_LIMITED"] = "RATE_LIMITED";
  /** Service is temporarily unavailable */
  ScraperErrorType["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
  /** Authentication or authorization failed */
  ScraperErrorType["AUTH_ERROR"] = "AUTH_ERROR";
  /** Error parsing response data */
  ScraperErrorType["PARSE_ERROR"] = "PARSE_ERROR";
  /** Error during image generation */
  ScraperErrorType["IMAGE_GENERATION_ERROR"] = "IMAGE_GENERATION_ERROR";
  /** Error calling external API */
  ScraperErrorType["API_ERROR"] = "API_ERROR";
  ScraperErrorType["DOWNLOAD_ERROR"] = "DOWNLOAD_ERROR";
  ScraperErrorType["NOT_FOUND"] = "NOT_FOUND";
  ScraperErrorType["QUALITY_NOT_AVAILABLE"] = "QUALITY_NOT_AVAILABLE";
  /** Unknown or unexpected error */
  ScraperErrorType["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(ScraperErrorType || (ScraperErrorType = {}));
