/**
 * @fileoverview Instagram Downloader using savegram.info service
 * @author FongsiDev (original author) & NB Team (integration)
 * @beta
 *
 * Note: This scraper relies on executing obfuscated JavaScript from a third-party website
 * within a Node.js `vm` context. This method is inherently fragile and highly
 * susceptible to breaking if the target website changes its front-end logic or obfuscation.
 * While `vm` provides a sandbox, executing external, untrusted code always carries
 * potential security implications. Use with caution.
 */
import axios from "axios";
import * as cheerio from "cheerio";
import * as vm from "vm"; // Node.js built-in module
import { URLSearchParams } from "url"; // Node.js built-in module
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequiredParams,
  isValidUrl,
  extractDomain,
} from "../utils";
const BASE_URL = "https://savegram.info";
const ACTION_URL = `${BASE_URL}/action.php`;
/**
 * Downloads Instagram media (videos/photos) via the savegram.info service.
 * This function is highly dependent on the target website's dynamic JS,
 * making it prone to breaking changes.
 *
 * @param url - The Instagram post URL (e.g., photo, video, reel, IGTV).
 * @returns A promise that resolves to an NBScraperResponse containing an array of download items.
 *
 * @example
 * ```typescript
 * import { savegram } from 'nb-scraper';
 *
 * (async () => {
 * const instagramUrl = '[https://www.instagram.com/reel/DG7I2Ezz2sy/?igsh=MTFoN2Z1MDJpeGNj](https://www.instagram.com/reel/DG7I2Ezz2sy/?igsh=MTFoN2Z1MDJpeGNj)';
 * const result = await savegram(instagramUrl);
 *
 * if (result.status) {
 * console.log('Download items:', result.data.items);
 * } else {
 * console.error('Error:', result.error);
 * }
 * })();
 * ```
 * @author Puruu Puruu
 */
export async function savegram(url) {
  try {
    validateRequiredParams({ url }, ["url"]);
    // Basic URL validation
    if (!isValidUrl(url)) {
      return createErrorResponse("Invalid URL format for Instagram.", {
        type: ScraperErrorType.INVALID_INPUT,
        context: { url },
      });
    }
    const domain = extractDomain(url);
    const validDomains = [
      "instagram.com",
      "www.instagram.com",
      "m.instagram.com",
    ];
    if (!domain || !validDomains.includes(domain)) {
      return createErrorResponse("URL must be from Instagram domain.", {
        type: ScraperErrorType.INVALID_INPUT,
        context: { url, domain },
      });
    }
    const payload = new URLSearchParams({
      url,
      action: "post",
      lang: "id",
    });
    const { data: obfuscatedScript } = await axios({
      method: "post",
      url: ACTION_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0", // Standard user agent, can be customized via utils.makeRequest if needed
        Referer: `${BASE_URL}/id`,
      },
      data: payload.toString(),
      timeout: 30000, // Add a timeout for t
    });
    if (
      typeof obfuscatedScript !== "string" ||
      !obfuscatedScript.includes("eval(function(p,a,c,k,e,d)")
    ) {
      return createErrorResponse(
        "Unexpected script response from Savegram.info. Service might have changed.",
        {
          type: ScraperErrorType.INVALID_RESPONSE,
          context: {
            url,
            responseSnippet: String(obfuscatedScript).substring(0, 200),
          },
        },
      );
    }
    let capturedHtml = "";
    const context = {
      window: { location: { hostname: "savegram.info" } },
      pushAlert: () => {}, // Mock function to prevent errors
      gtag: () => {}, // Mock function to prevent errors
      document: {
        getElementById: (id) => {
          if (id === "div_download") {
            return {
              set innerHTML(html) {
                capturedHtml = html;
              },
              style: {}, // Mock style property
              remove: () => {}, // Mock remove method
            };
          }
          return { style: {}, remove: () => {} }; // Return mock object for other elements
        },
        querySelector: () => ({ classList: { remove: () => {} } }), // Mock querySelector
      },
    };
    // Create a new vm context and run the obfuscated script
    // WARNING: This involves running external, potentially untrusted JavaScript.
    // While sandboxed, it's a higher-risk operation compared to direct API calls.
    const sandbox = vm.createContext(context);
    const script = new vm.Script(obfuscatedScript);
    script.runInContext(sandbox);
    if (!capturedHtml) {
      return createErrorResponse(
        "Failed to capture HTML content. Savegram.info structure might have changed.",
        {
          type: ScraperErrorType.PARSE_ERROR,
          context: { url },
        },
      );
    }
    const $ = cheerio.load(capturedHtml);
    const out = [];
    $(".download-items").each((_, el) => {
      const item = $(el);
      const thumbnail = item.find("img").attr("src");
      const btn = item.find(".download-items__btn a");
      const url_download = btn.attr("href");
      const kualitas = btn.text().trim(); // Use actual text, not a placeholder
      if (thumbnail && url_download) {
        // Ensure both are present
        out.push({ thumbnail, quality: kualitas, downloadUrl: url_download });
      }
    });
    if (out.length === 0) {
      return createErrorResponse(
        "No download links found from the Instagram URL. It might be private, deleted, or savegram.info failed to process it.",
        {
          type: ScraperErrorType.NOT_FOUND,
          context: { url },
        },
      );
    }
    return createSuccessResponse({ items: out });
  } catch (error) {
    // Axios errors will have `response` property for HTTP errors
    if (axios.isAxiosError(error)) {
      const serverMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      return createErrorResponse(`Network or API error: ${serverMsg}`, {
        type: ScraperErrorType.NETWORK_ERROR,
        context: { url, status: error.response?.status, code: error.code },
      });
    }
    // General errors (from thrown new Error or other issues)
    return createErrorResponse(error, {
      type: ScraperErrorType.UNKNOWN_ERROR,
      context: { url, message: error.message },
    });
  }
}
