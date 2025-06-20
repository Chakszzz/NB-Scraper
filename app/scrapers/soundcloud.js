/**
 * @fileoverview SoundCloud Music Search and Track Information
 * Base URL: https://soundcloud.com/
 *
 * Features:
 * - Search tracks with detailed information
 * - Auto client_id extraction and caching
 * - Format duration, numbers, and dates
 * - Track metadata including plays, likes, downloads
 *
 * @author NB Team
 * @version 1.0.0
 */
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const BASE_URL = "https://soundcloud.com/";
const API_URL = "https://api-v2.soundcloud.com/search/tracks";
// Module-level cache
let cache = { version: "", id: "" };
/**
 * Format duration from milliseconds to MM:SS
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
function formatDuration(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const remainder = sec % 60;
  return `${min}:${remainder.toString().padStart(2, "0")}`;
}
/**
 * Format large numbers with K/M suffixes
 * @param n - Number to format
 * @returns Formatted number string
 */
function formatNumber(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}
/**
 * Format date to YYYY-MM-DD
 * @param dateStr - Date string to format
 * @returns Formatted date string or null
 */
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
}
/**
 * Get SoundCloud client ID by parsing website
 * @returns Promise<string | null>
 */
async function getClientID() {
  try {
    const response = await makeRequest({
      url: BASE_URL,
      method: "GET",
    });
    if (typeof response.data !== "string") {
      throw new Error("invalid html data");
    }
    const html = response.data;
    const version = html.match(
      /<script>window\.__sc_version="(\d{10})"<\/script>/,
    )?.[1];
    if (!version) return null;
    // Return cached ID if version matches
    if (cache.version === version) return cache.id;
    // Extract script URLs and find client_id
    const scriptMatches = [
      ...html.matchAll(
        /<script.*?src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+)"/g,
      ),
    ];
    for (const [, scriptUrl] of scriptMatches) {
      const { data: js } = await makeRequest({
        url: scriptUrl,
        method: "GET",
      });
      if (typeof js !== "string") {
        continue;
      }
      const idMatch = js.match(/client_id:"([a-zA-Z0-9]{32})"/);
      if (idMatch) {
        cache = { version, id: idMatch[1] };
        return idMatch[1];
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to get client_id: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
  return null;
}
/**
 * Search SoundCloud tracks
 *
 * @example
 * ```typescript
 * import { searchSoundCloud } from 'nb-scraper';
 *
 * const result = await searchSoundCloud({
 *   query: "lofi chill",
 *   limit: 10
 * });
 *
 * if (result.status) {
 *   console.log(result.data.tracks);
 * }
 * ```
 *
 * @param options - Search configuration
 * @returns Promise<NBScraperResponse<SoundCloudData>>
 * @author Rian
 */
export async function searchSoundCloud(options) {
  const { query, limit = 3 } = options;
  let clientId = null;
  try {
    validateRequiredParams(options, ["query"]);
    const clientId = await getClientID();
    if (!clientId) {
      return createErrorResponse("Failed to obtain client_id", {
        type: ScraperErrorType.AUTH_ERROR,
        context: { service: "SoundCloud" },
      });
    }
    const response = await makeRequest({
      url: API_URL,
      method: "GET",
      params: {
        q: query,
        client_id: clientId,
        limit,
      },
    });
    if (!response.data?.collection) {
      return createErrorResponse("Invalid SoundCloud API response", {
        type: ScraperErrorType.INVALID_RESPONSE,
      });
    }
    const tracks = response.data.collection.map((track) => {
      const durationMs = track.duration;
      const duration = formatDuration(durationMs);
      const likeCount = formatNumber(track.likes_count);
      const playCount = formatNumber(track.playback_count);
      const downloadCount = formatNumber(track.download_count);
      const releaseDate = track.release_date || track.created_at;
      return {
        id: track.id,
        title: track.title,
        url: track.permalink_url,
        duration,
        thumbnail: track.artwork_url,
        author: {
          name: track.user.username,
          url: track.user.permalink_url,
        },
        like_count: likeCount,
        download_count: downloadCount,
        play_count: playCount,
        release_date: formatDate(releaseDate),
      };
    });
    return createSuccessResponse({ tracks });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.API_ERROR,
      context: {
        service: "SoundCloud",
        query: query,
        clientId: clientId ? "*****" : "null",
      },
    });
  }
}
/**
 * @alpha
 * Get cached client ID and version info
 *
 * @example
 * ```typescript
 * import { getSoundCloudCacheInfo } from 'nb-scraper';
 *
 * const cacheInfo = getSoundCloudCacheInfo();
 * console.log(cacheInfo);
 * ```
 *
 * @returns Current cache state
 * @author Rian
 */
export function getSoundCloudCacheInfo() {
  return { ...cache };
}
