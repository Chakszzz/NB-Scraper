/**
 * NB Scraper - Community scraper library by Er Rickow
 *
 * If you get confused read this documentations, just read the variables or functions section's
 *
 * Don't forget to install the nb-scraper first:
 * ```bash
 * npm i nb-scraper
 * ```
 *
 * @packageDocumentation
 * @since 1.2.2
 *
 */
// Export all scrapers
export * from "./scrapers/index";
// Export utilities (for advanced users)
export {
  createErrorResponse,
  createSuccessResponse,
  isValidUrl,
  sanitizeString,
  extractDomain,
  formatBytes,
  DEFAULT_CONFIG,
  CREATOR,
} from "./utils";
/**
 * Library version
 * @public
 */
export const VERSION = "1.2.2";
/**
 * Library information
 * @public
 */
export const INFO = {
  name: "nb-scraper",
  version: VERSION,
  author: "Er Rickow",
  description: "NB Community scraper library",
  repository: "https://github.com/chakszzz/nb-scraper",
  documentation: "https://Chakszzz.github.io/NB-Scraper",
};
