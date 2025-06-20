import * as cheerio from "cheerio";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const BASE_URL = "https://snaptik.app";
const USER_AGENT =
  "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36";
// Internal helper to get the request token
async function getToken() {
  const response = await makeRequest({
    url: `${BASE_URL}/en2`,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
    },
  });
  const $ = cheerio.load(response.data);
  const token = $('input[name="token"]').val();
  if (!token) {
    throw new Error("Token not found on the page.");
  }
  return token;
}
// Internal helper to decode obfuscated JS response from the server
function decodeObfuscatedJS(body) {
  try {
    const re =
      /eval\(function\(h,u,n,t,e,r\)\{[\s\S]*?\}\(\s*"([^"]*)"\s*,\s*\d+\s*,\s*"([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\)/;
    const match = body.match(re);
    if (!match) return body;
    const [, h, N, tStr, eStr] = match;
    const OFFSET = +tStr;
    const BASE_FROM = +eStr;
    const DELIM = N.charAt(BASE_FROM);
    const ALPHABET =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
    const fromBase = (str, base) => {
      const tbl = ALPHABET.split("").slice(0, base);
      return str
        .split("")
        .reverse()
        .reduce((acc, ch, idx) => {
          const v = tbl.indexOf(ch);
          return acc + (v < 0 ? 0 : v * Math.pow(base, idx));
        }, 0);
    };
    const segs = h.split(DELIM).filter((s) => s);
    let plain = "";
    for (const seg of segs) {
      let s = seg;
      for (let d = 0; d < N.length; d++) {
        s = s.split(N[d]).join(d.toString());
      }
      const code = fromBase(s, BASE_FROM) - OFFSET;
      plain += String.fromCharCode(code);
    }
    return Buffer.from(plain, "latin1").toString("utf8");
  } catch {
    // If decoding fails, return original body
    return body;
  }
}
// Internal helper to extract all information from the final HTML
function extractAllInfo(html) {
  const $ = cheerio.load(html);
  // Extract photo links
  const photos = [];
  $(".column .photo").each((index, element) => {
    const $photo = $(element);
    const imgSrc = $photo.find("img").attr("src");
    const downloadLink = $photo.find(".dl-footer a").attr("href");
    if (imgSrc && downloadLink) {
      photos.push({
        index: index + 1,
        imageUrl: imgSrc,
        downloadUrl: downloadLink,
        type: "photo",
      });
    }
  });
  // Extract render data
  const renderButton = $("button[data-token]");
  const renderData = { hasRenderButton: false };
  if (renderButton.length > 0) {
    renderData.hasRenderButton = true;
    renderData.token = renderButton.attr("data-token");
    renderData.isAd = renderButton.attr("data-ad") === "true";
    renderData.type = "render";
  }
  // Extract video info
  const title = $(".video-title").text().trim() || "No title";
  const author = $(".info span").text().trim() || "Unknown author";
  const thumbnail = $("#thumbnail").attr("src") || "";
  const downloadLinks = [];
  $('a[href*="rapidcdn"], a[href*="download"]').each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (href?.includes("http")) {
      downloadLinks.push({
        type: "video",
        url: href,
        quality: text.includes("HD") ? "HD" : "Normal",
        label: text,
      });
    }
  });
  const hdButton = $("button[data-tokenhd]");
  if (hdButton.length > 0) {
    if (hdButton.attr("data-tokenhd"))
      downloadLinks.push({
        type: "video",
        url: hdButton.attr("data-tokenhd"),
        quality: "HD",
        label: "Download Video HD",
      });
    if (hdButton.attr("data-backup"))
      downloadLinks.push({
        type: "video",
        url: hdButton.attr("data-backup"),
        quality: "Normal",
        label: "Download Video (Backup)",
      });
  }
  if (downloadLinks.length === 0 && photos.length === 0) {
    return null;
  }
  return {
    title,
    author,
    thumbnail,
    contentType: photos.length > 0 ? "slideshow" : "video",
    downloadLinks,
    photos,
    renderData,
  };
}
/**
 * Scrapes a TikTok URL to get download links for videos or slideshow photos.
 * @param url - The TikTok video URL.
 * @returns A promise that resolves to the scraped TikTok data.
 * @example
 * ```typescript
 * import { tiktok } from 'nb-scraper';
 * * const result = await tiktok("https://www.tiktok.com/@dayyanbae_3/video/7515070760566820104");
 * if (result.status) {
 * console.log('Title:', result.data.title);
 * if(result.data.contentType === 'video') {
 * console.log('Video Links:', result.data.downloadLinks);
 * } else {
 * console.log('Photo Links:', result.data.photos);
 * }
 * } else {
 * console.error(result.error);
 * }
 * ```
 * @author YogikID
 * @beta
 */
export async function tiktok(url) {
  try {
    validateRequiredParams({ url }, ["url"]);
    // 1. Get token from the main page
    const token = await getToken();
    // 2. Submit the URL to the API
    const formData = new URLSearchParams();
    formData.append("url", url);
    formData.append("lang", "en2");
    formData.append("token", token);
    const response = await makeRequest({
      method: "POST",
      url: `${BASE_URL}/abc2.php`,
      data: formData.toString(),
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: `${BASE_URL}/en2`,
        Origin: BASE_URL,
      },
    });
    // 3. Decode the response if it's obfuscated
    const decodedHtml = decodeObfuscatedJS(response.data);
    // 4. Extract information from the decoded HTML
    const videoInfo = extractAllInfo(decodedHtml);
    if (!videoInfo) {
      return createErrorResponse(
        "Failed to extract video information from the response.",
        {
          type: ScraperErrorType.PARSE_ERROR,
          context: { url },
        },
      );
    }
    return createSuccessResponse({
      originalUrl: url,
      ...videoInfo,
    });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.API_ERROR,
      context: { service: "TikTok", url },
    });
  }
}
