import cheerio from "cheerio";
import qs from "qs";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequiredParams,
  makeRequest,
} from "../utils";
/**
 * @alpha
 * Facebook Video Downloader Service using
 *
 * @param url - Facebook video URL (must be in format: https://www.facebook.com/share/v/...)
 * @returns Promise<NBScraperResponse<FacebookVideoData>>
 * @example
 * ```ts
 * const { facebookDownloader } = require('nb-scraper')
 *
 * const res = await facebookDownloader('https://url.facebook.com/')
 * console.log(res)
 * ```
 * @author Woiii
 */
export async function facebookDownloader(url) {
  try {
    // Validate input parameters
    validateRequiredParams({ url }, ["url"]);
    // Validate URL format
    const allowedHosts = ["facebook.com", "www.facebook.com"];
    const parsedHost = new URL(url).host;
    if (!allowedHosts.includes(parsedHost)) {
      return createErrorResponse("Invalid Facebook video URL format", {
        type: ScraperErrorType.INVALID_INPUT,
        context: { url },
      });
    }
    // Step 1: Get verification token
    const verifyPayload = qs.stringify({ url });
    const verifyConfig = {
      method: "POST",
      url: "https://fdownloader.net/api/userverify",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest",
      },
      data: verifyPayload,
    };
    const verifyRes = await makeRequest(verifyConfig);
    if (verifyRes.status !== 200 || !verifyRes.data?.token) {
      return createErrorResponse("Failed to get verification token", {
        type: ScraperErrorType.AUTH_ERROR,
        context: { service: "FacebookDownloader" },
      });
    }
    const cftoken = verifyRes.data.token;
    // Step 2: Get video data
    const ajaxPayload = qs.stringify({
      k_exp: Math.floor(Date.now() / 1000) + 1800,
      k_token:
        "4901a847f621da898b5429bf38df6f3a0959738cd4eb52a2bf0cf44b3eb44cad",
      q: url,
      lang: "id",
      web: "fdownloader.net",
      v: "v2",
      w: "",
      cftoken,
    });
    const ajaxConfig = {
      method: "POST",
      url: "https://v3.fdownloader.net/api/ajaxSearch",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
      },
      data: ajaxPayload,
    };
    const ajaxRes = await makeRequest(ajaxConfig);
    if (
      ajaxRes.status !== 200 ||
      (typeof ajaxRes.data !== "string" && ajaxRes.data?.status !== "ok")
    ) {
      return createErrorResponse("Failed to fetch video data", {
        type: ScraperErrorType.API_ERROR,
        context: { service: "FacebookDownloader" },
      });
    }
    // Handle both string and nested object responses
    const html =
      typeof ajaxRes.data === "string"
        ? ajaxRes.data
        : ajaxRes.data?.data || "";
    if (!html) {
      return createErrorResponse("No HTML content found in response", {
        type: ScraperErrorType.API_ERROR,
        context: { service: "FacebookDownloader" },
      });
    }
    // Now safely load the HTML
    const $ = cheerio.load(html);
    const thumbnail = $(".image-fb img").attr("src") || "";
    const duration = $(".content p").text().trim();
    const title = $(".content h3").text().trim();
    const links = [];
    $("a.download-link-fb").each((_index, el) => {
      const link = $(el).attr("href");
      const quality =
        $(el).attr("title")?.replace("Download ", "") || "Unknown";
      const format = link?.includes(".mp4") ? "mp4" : "unknown";
      if (link) {
        links.push({
          quality,
          format,
          link,
        });
      }
    });
    if (links.length === 0) {
      return createErrorResponse("No download links found", {
        type: ScraperErrorType.NOT_FOUND,
        context: { service: "FacebookDownloader" },
      });
    }
    return createSuccessResponse({
      title,
      duration,
      thumbnail,
      links,
    });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.API_ERROR,
      context: { service: "FacebookDownloader" },
    });
  }
}
