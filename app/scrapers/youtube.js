import axios from "axios";
import FormData from "form-data";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  isValidUrl,
  extractDomain,
} from "../utils";
const validQualities = {
  480: 480,
  1080: 1080,
  720: 720,
  360: 360,
  audio: "mp3",
};
const YOUTUBE_DOMAINS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "m.youtube.com",
]);
function validateYouTubeUrl(url) {
  if (!isValidUrl(url)) {
    return createErrorResponse("Invalid YouTube URL", {
      type: ScraperErrorType.INVALID_INPUT,
    });
  }
  const domain = extractDomain(url);
  if (!domain || !YOUTUBE_DOMAINS.has(domain.replace(/^www\./, ""))) {
    return createErrorResponse("URL must be from YouTube domain", {
      type: ScraperErrorType.INVALID_INPUT,
      context: { validDomains: Array.from(YOUTUBE_DOMAINS) },
    });
  }
  try {
    return createSuccessResponse(new URL(url));
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.INVALID_INPUT,
    });
  }
}
/**
 * Helper for loop download
 * Thanks to coderabbitai
 */
const waitForDownloadUrl = async (progressUrl) => {
  const maxAttempts = 40;
  let attempts = 0;
  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const progressResponse = await axios.get(progressUrl, {
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      if (progressResponse.data?.download_url) {
        return progressResponse.data.download_url;
      }
    } catch (pollError) {
      if (
        axios.isAxiosError(pollError) &&
        pollError.response?.status !== undefined &&
        pollError.response.status >= 400
      ) {
        throw new Error(
          `Remote server responded with ${pollError.response.status}`,
        );
      }
      // otherwise continue polling (network glitch / 202 status etc.)
    }
    attempts++;
  }
  throw new Error("Timeout: please try again");
};
export const Ytdl = {
  /**
   * @beta
   *
   * Download YouTube video as MP3
   * @param url - YouTube video URL
   * @example
   * ```ts
   * import { Ytdl } from 'nb-scraper';
   *
   * const result = await Ytdl.mp3("https://youtube.com/.../");
   * console.log(result)
   * ```
   * @author YogikId
   */
  mp3: async (url) => {
    const urlValidation = validateYouTubeUrl(url);
    if (!urlValidation.status) {
      return createErrorResponse({
        message: "Invalid YouTube URL",
        type: ScraperErrorType.INVALID_INPUT,
      });
    }
    const ds = new FormData();
    ds.append("url", url);
    try {
      const config = {
        method: "post",
        url: "https://www.youtubemp3.ltd/convert",
        headers: {
          ...ds.getHeaders(),
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        data: ds,
        timeout: 45000,
      };
      const response = await axios(config);
      const data = response.data;
      if (!data?.link) {
        return createErrorResponse("Failed to get download link", {
          type: ScraperErrorType.API_ERROR,
        });
      }
      return createSuccessResponse({
        title: data.filename || "Unknown Title",
        downloadUrl: data.link,
        type: "mp3",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        return createErrorResponse("Request timeout", {
          type: ScraperErrorType.NETWORK_ERROR,
        });
      }
      const ax = error;
      const serverMsg =
        typeof ax.response?.data === "object" &&
        ax.response?.data !== null &&
        "message" in ax.response.data
          ? ax.response.data.message
          : undefined;
      return createErrorResponse(
        serverMsg ?? ax.message ?? "Audio Download Failed",
        {
          type: ScraperErrorType.API_ERROR,
        },
      );
    }
  },
  /**
   * @beta
   *
   * Download YouTube video in specified quality
   * @param url - YouTube video URL
   * @param quality - Quality option (480, 720, 1080, 360, audio)
   * @example
   * ```ts
   * import { Ytdl } from 'nb-scraper';
   *
   * const result = await Ytdl.mp4("https://youtube.com/.../");
   * console.log(result)
   * ```
   * @author YogikId
   */
  mp4: async (url, quality = "720") => {
    const urlValidation = validateYouTubeUrl(url);
    if (!urlValidation.status) {
      return createErrorResponse({
        message: "Invalid YouTube URL",
        type: ScraperErrorType.INVALID_INPUT,
      });
    }
    if (!Object.keys(validQualities).includes(quality)) {
      return createErrorResponse(
        { message: "Quality not valid!", type: ScraperErrorType.INVALID_INPUT },
        { availableQuality: Object.keys(validQualities) },
      );
    }
    const qualityParam = validQualities[quality];
    const initialUrl = `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${qualityParam}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`;
    try {
      // First request to start download process
      const firstResponse = await axios.get(initialUrl, {
        timeout: 30000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      if (!firstResponse.data?.progress_url) {
        return createErrorResponse("Failed to proceed download", {
          type: ScraperErrorType.API_ERROR,
        });
      }
      const metadata = {
        title: firstResponse.data.info?.title || "Unknown Title",
        thumbnail: firstResponse.data.info?.image,
        quality: quality === "audio" ? undefined : quality,
        type: quality === "audio" ? "mp3" : "mp4",
      };
      // Poll for download progress
      try {
        const downloadUrl = await waitForDownloadUrl(
          firstResponse.data.progress_url,
        );
        metadata.downloadUrl = downloadUrl;
        return createSuccessResponse(metadata);
      } catch (timeoutError) {
        const msg =
          timeoutError instanceof Error
            ? timeoutError.message
            : String(timeoutError);
        return createErrorResponse(msg, {
          type: ScraperErrorType.NETWORK_ERROR,
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        return createErrorResponse("Request timeout", {
          type: ScraperErrorType.NETWORK_ERROR,
        });
      }
      const ax = error;
      const serverMsg =
        typeof ax.response?.data === "object" &&
        ax.response?.data !== null &&
        "message" in ax.response.data
          ? ax.response.data.message
          : undefined;
      return createErrorResponse(
        serverMsg ?? ax.message ?? "Video Download Failed",
        {
          type: ScraperErrorType.API_ERROR,
        },
      );
    }
  },
};
/**
 * @fileoverview YouTube Downloader using ytmp3.cc service
 * Base URL: https://ytmp3.cc/
 *
 * Features:
 * - Download audio (mp3) and video (mp4) from YouTube, YouTube Music, and Shorts.
 * - Handles dynamic authorization codes.
 *
 * Note: This scraper may not support videos/audio longer than 45 minutes.
 * The use of `eval()` in this module is for dynamic code execution required by the target service.
 * This practice carries security risks and is generally not recommended for production.
 *
 * @author wolep
 * @beta
 */
// Internal headers for requests
const HEADERS = {
  Referer: "https://ytmp3.cc/",
  Origin: "https://ytmp3.cc/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
};
/**
 * Performs an HTTP request with custom headers.
 * @param url The URL to hit.
 * @param description A description for logging purposes (removed console.log, but kept for context).
 * @param returnType Expected return type ('text' or 'json').
 * @returns Promise with the result and response object.
 * @internal
 */
async function hit(url, description, returnType = "text") {
  const listReturnType = ["text", "json"];
  if (!listReturnType.includes(returnType)) {
    throw new Error(`${returnType} invalid. `);
  }
  let result;
  let response;
  try {
    response = await fetch(url, {
      headers: HEADERS,
    });
    const data = await response.text();
    result = data;
    try {
      if (returnType === "json") {
        result = JSON.parse(data);
      }
    } catch (error) {
      throw new Error(
        `Failed to change return type to ${returnType}. ${error.message}`,
      );
    }
    return { result, response };
  } catch (error) {
    throw new Error(
      `Fetch failed at ${description}\nReason: ${error.message}\nStatus: ${response?.status || "N/A"} ${response?.statusText || "N/A"}\nResponse body: ${result || "N/A"}`,
    );
  }
}
/**
 * Retrieves the authorization code from the ytmp3.cc website.
 * This function uses `eval()` which carries significant security risks.
 * @returns Promise<string> The authorization code.
 * @internal
 */
async function getAuthCode() {
  const { result: html, response } = await hit(
    "https://ytmp3.cc",
    "hit homepage ytmp3cc",
  );
  const valueOnHtmlMatch = html.match(/<script[^>]*>(.*?)<\/script>/i)?.[1];
  if (!valueOnHtmlMatch) {
    throw new Error(`Failed to get regex match for code value in html`);
  }
  let evalHtmlCode = valueOnHtmlMatch;
  // Manipulate the script content to make it executable outside a browser context
  // and extract the necessary variable. This is a fragile approach.
  evalHtmlCode = evalHtmlCode.replace(/var _\w+=\w+;/, ""); // Remove variable declarations that might conflict
  evalHtmlCode = evalHtmlCode.replace(
    /document\.getElementById\("ytmp3"\)\.src/,
    "`https://ytmp3.cc`",
  ); // Replace DOM access with string
  let tempEvalResult;
  try {
    // WARNING: Using eval() can be a security risk. It's used here to execute
    // dynamic JavaScript from the target website as per original implementation.
    tempEvalResult = eval(
      `(function() { ${evalHtmlCode}; return window; })();`,
    );
  } catch (error) {
    throw new Error(`Eval failed for HTML value: ${error.message}`);
  }
  const srcPathMatch = html.match(/src="(.*?)"/)?.[1];
  if (!srcPathMatch) {
    throw new Error(`Failed to get srcPath to download javascript file`);
  }
  const url = new URL(response.url).origin + srcPathMatch;
  const { result: jsCode } = await hit(url, "download js file ytmp3");
  const authCodeMatch = jsCode.match(/authorization\(\){(.*?)}function/)?.[1];
  if (!authCodeMatch) {
    throw new Error(`Failed to get regex match for auth function code`);
  }
  const newAuthCode = authCodeMatch.replace(/id\("ytmp3"\)\.src/g, `"${url}"`); // Replace id("ytmp3").src with a string literal
  let authString;
  try {
    // WARNING: Using eval() can be a security risk. It's used here to execute
    // dynamic JavaScript from the target website as per original implementation.
    authString = eval(`(function(){ ${newAuthCode} })()`);
  } catch (error) {
    throw new Error(`Eval failed trying to get authString: ${error.message}`);
  }
  return authString;
}
/**
 * Extracts the YouTube video ID from a given URL.
 * @param youtubeUrl The YouTube URL.
 * @returns Promise<{ videoId: string; url: string }> Object containing video ID and final URL.
 * @internal
 */
async function getYoutubeId(youtubeUrl) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
  };
  let resp;
  try {
    resp = await fetch(youtubeUrl, {
      method: "HEAD",
      headers,
    });
    if (!resp.ok) {
      throw new Error(
        `Failed to get video ID: ${resp.status} ${resp.statusText}`,
      );
    }
  } catch (error) {
    throw new Error(`Network error while getting video ID: ${error.message}`);
  }
  let videoId = null;
  try {
    videoId = new URL(resp.url).searchParams.get("v");
  } catch (e) {
    // Fallback for invalid URL objects or short URLs
  }
  if (!videoId) {
    const shortsMatch = resp.url.match(
      /https:\/\/www\.youtube\.com\/shorts\/(.*?)(?:\?|$)/,
    );
    if (shortsMatch) {
      videoId = shortsMatch[1];
    }
  }
  if (!videoId) {
    throw new Error(
      `Could not extract video ID from the provided URL: ${youtubeUrl}`,
    );
  }
  return { videoId, url: resp.url };
}
/**
 * Downloads YouTube video or audio using ytmp3.cc.
 * Supports MP3 and MP4 formats.
 * @param youtubeUrl The YouTube video URL.
 * @param format 'mp3' for audio, 'mp4' for video.
 * @returns Promise<NBScraperResponse<YouTubeDownloadResult>>
 * @example
 * ```typescript
 * import { ytmp3cc } from 'nb-scraper';
 *
 * (async () => {
 * const result = await ytmp3cc.download("[https://www.youtube.com/watch?v=dQw4w9WgXcQ](https://www.youtube.com/watch?v=dQw4w9WgXcQ)", "mp3");
 * if (result.status) {
 * console.log(result.data.title);
 * console.log(result.data.downloadUrl);
 * } else {
 * console.error(result.error);
 * }
 * })();
 * ```
 * @author wolep
 * @beta
 */
export const ytmp3cc = {
  download: async (youtubeUrl, format = "mp3") => {
    const validFormats = ["mp3", "mp4"];
    if (!validFormats.includes(format)) {
      return createErrorResponse(
        `Invalid format: ${format}. Available formats: ${validFormats.join(", ")}`,
        {
          type: ScraperErrorType.INVALID_PARAMETER,
        },
      );
    }
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
      const { videoId, url } = await getYoutubeId(youtubeUrl);
      const authCode = await getAuthCode();
      // hit1: init api
      const url1 = `https://d.ecoe.cc/api/v1/init?a=${authCode}&_=${Math.random()}`;
      const { result: resultInit } = await hit(url1, "init api", "json");
      if (resultInit.error !== "0") {
        return createErrorResponse(`Error in init API: ${resultInit.error}`, {
          type: ScraperErrorType.API_ERROR,
          context: {
            service: "ytmp3cc",
            phase: "init",
            rawResponse: resultInit,
          },
        });
      }
      // hit2: convert url
      const url2 = new URL(resultInit.convertURL);
      url2.searchParams.append("v", videoId);
      url2.searchParams.append("f", format);
      url2.searchParams.append("_", String(Math.random()));
      const { result: resultConvert } = await hit(url2, "hit convert", "json");
      let {
        downloadURL,
        progressURL,
        redirectURL,
        error: errorFromConvertUrl,
      } = resultConvert;
      if (errorFromConvertUrl) {
        return createErrorResponse(
          `Error after convert URL fetch: ${errorFromConvertUrl}. Probably bad YouTube video ID or unsupported video.`,
          {
            type: ScraperErrorType.API_ERROR,
            context: {
              service: "ytmp3cc",
              phase: "convert",
              videoId,
              rawResponse: resultConvert,
            },
          },
        );
      }
      // hit2a (directed)
      if (redirectURL) {
        const redirectedResult = (
          await hit(redirectURL, "fetch redirectURL", "json")
        ).result;
        downloadURL = redirectedResult.downloadURL;
        progressURL = redirectedResult.progressURL;
      }
      // Loop to check progress
      let { error, progress, title } = { error: null, progress: 0, title: "" };
      while (progress !== 3) {
        const api3 = new URL(progressURL);
        api3.searchParams.append("_", String(Math.random()));
        const progressCheckResult = (
          await hit(api3, "check progressURL", "json")
        ).result;
        error = progressCheckResult.error;
        progress = progressCheckResult.progress;
        title = progressCheckResult.title;
        if (error) {
          return createErrorResponse(
            `Conversion error: ${error}. Video might be too long or incompatible (>45 mins).`,
            {
              type: ScraperErrorType.API_ERROR,
              context: {
                service: "ytmp3cc",
                phase: "progress check",
                videoId,
                error_code: error,
              },
            },
          );
        }
        if (progress !== 3) {
          await delay(5000); // 5 sec delay before next checking request
        }
      }
      const finalResult = { title, downloadUrl: downloadURL, type: format };
      return createSuccessResponse(finalResult);
    } catch (error) {
      return createErrorResponse(error, {
        type: ScraperErrorType.API_ERROR,
        context: { service: "ytmp3cc", youtubeUrl, format },
      });
    }
  },
};
