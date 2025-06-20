/**
 * @fileoverview Anime Indo Scraper
 * Base URL: https://anime-indo.lol
 *
 * Features:
 * - Search anime
 * - Get anime details
 * - Download episodes
 *
 * @author Jul
 * @version 1.0.1
 */
import { URL } from "url";
import * as cheerio from "cheerio";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const BASE_URL = "https://anime-indo.lol";
export const animeIndo = {
  /**
   * Search anime
   *
   * @example
   * ```typescript
   * const result = await animeIndo.search("Naruto");
   * if (result.status) {
   *   console.log(result.data);
   * }
   * ```
   * @author Jul
   */
  async search(query) {
    try {
      validateRequiredParams({ query }, ["query"]);
      const url = `${BASE_URL}/search/${encodeURIComponent(query)}/`;
      const response = await makeRequest({ url });
      const $ = cheerio.load(response.data);
      const results = [];
      $("table.otable").each((_index, el) => {
        const element = $(el);
        const title = element.find(".videsc a").text().trim();
        const link = BASE_URL + element.find(".videsc a").attr("href");
        const image = BASE_URL + element.find("img").attr("src");
        const description = element.find("p.des").text().trim();
        const labelEls = element.find(".label");
        const year = labelEls.last().text().trim();
        results.push({
          title,
          link,
          image,
          year,
          description,
        });
      });
      return createSuccessResponse(results);
    } catch (error) {
      return createErrorResponse(error, {
        type: ScraperErrorType.API_ERROR,
        context: { service: "AnimeIndo", query },
      });
    }
  },
  /**
   * Get anime details
   *
   * @example
   * ```typescript
   * const result = await animeIndo.detail("https://anime-indo.lol/anime/naruto");
   * if (result.status) {
   *   console.log(result.data);
   * }
   * ```
   * @author Jul
   */
  async detail(url) {
    try {
      validateRequiredParams({ url }, ["url"]);
      const response = await makeRequest({ url });
      const $ = cheerio.load(response.data);
      const title = $("h1.title").text().trim();
      let imageSrc = $(".detail img").attr("src") || "";
      if (imageSrc.startsWith("/")) {
        imageSrc = BASE_URL + imageSrc;
      }
      const genres = [];
      $(".detail li a").each((_index, el) => {
        genres.push($(el).text().trim());
      });
      const description = $(".detail p").text().trim();
      const episodes = [];
      $(".ep a").each((_index, el) => {
        let epLink = $(el).attr("href");
        if (epLink && epLink.startsWith("/")) {
          epLink = BASE_URL + epLink;
        }
        episodes.push({
          episode: $(el).text().trim(),
          link: epLink || "",
        });
      });
      return createSuccessResponse({
        title,
        image: imageSrc,
        genres,
        description,
        episodes,
      });
    } catch (error) {
      return createErrorResponse(error, {
        type: ScraperErrorType.API_ERROR,
        context: { service: "AnimeIndo", url },
      });
    }
  },
  /**
   * Download episode
   *
   * @example
   * ```typescript
   * const result = await animeIndo.download("https://anime-indo.lol/episode/naruto-1");
   * if (result.status) {
   *   console.log(result.data.downloadUrl);
   * }
   * ```
   * @author Jul
   */
  async download(episodeUrl) {
    try {
      validateRequiredParams({ episodeUrl }, ["episodeUrl"]);
      // Get episode page
      const { data: episodeHtml } = await makeRequest({
        url: episodeUrl,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const $ = cheerio.load(episodeHtml);
      const title = $("h1.title").first().text().trim();
      const description = $(".detail p").text().trim();
      // Extract video links
      const videoLinks = [];
      $(".servers a.server").each((_index, el) => {
        const label = $(el).text().trim();
        let videoUrl = $(el).attr("data-video") || "";
        if (videoUrl.startsWith("//")) {
          videoUrl = "https:" + videoUrl;
        }
        videoLinks.push({ label, videoUrl });
      });
      // Find GDrive HD link
      const gdriveHdLinkObj = videoLinks.find(
        (v) =>
          v.label.toLowerCase().includes("gdrive") &&
          v.label.toLowerCase().includes("hd"),
      );
      if (!gdriveHdLinkObj) {
        return createErrorResponse("HD quality not available", {
          type: ScraperErrorType.QUALITY_NOT_AVAILABLE,
          context: {
            episodeUrl,
            availableQualities: videoLinks.map((v) => v.label),
          },
        });
      }
      // Get GDrive embed page
      const { data: gdriveHtml } = await makeRequest({
        url: gdriveHdLinkObj.videoUrl,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const $$ = cheerio.load(gdriveHtml);
      const gdriveRawLink = $$("#subtitlez").text().trim();
      if (!gdriveRawLink) {
        throw new Error("Google Drive raw link not found in embed page");
      }
      const parsedUrl = new URL(gdriveRawLink);
      const allowedHosts = ["drive.google.com"];
      if (!allowedHosts.includes(parsedUrl.host)) {
        throw new Error("Invalid host for Google Drive raw link");
      }
      // Extract file ID
      const idMatch =
        gdriveRawLink.match(/\/d\/([^\/]+)\//) ||
        gdriveRawLink.match(/id=([^&]+)/);
      if (!idMatch) throw new Error("Google Drive file ID not found");
      const fileId = idMatch[1];
      // Get download URL from Google Drive API
      const driveApiUrl = `https://drive.google.com/uc?id=${fileId}&authuser=0&export=download`;
      const driveResponse = await makeRequest({
        method: "POST",
        url: driveApiUrl,
        headers: {
          "accept-encoding": "gzip, deflate, br",
          "content-length": "0",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          origin: "https://drive.google.com",
          "user-agent": "Mozilla/5.0",
          "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
          "x-drive-first-party": "DriveWebUi",
          "x-json-requested": "true",
        },
      });
      // Parse Drive API response (JSONP format)
      const jsonStr = driveResponse.data.slice(4);
      const json = JSON.parse(jsonStr);
      if (!json.downloadUrl || !json.fileName || !json.sizeBytes) {
        throw new Error("Invalid Google Drive response");
      }
      // Get file info
      const fileDownloadUrl = json.downloadUrl;
      const fileName = json.fileName;
      const fileSize = json.sizeBytes;
      // Get mimetype
      const headResponse = await makeRequest({
        method: "HEAD",
        url: fileDownloadUrl,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      return createSuccessResponse({
        title,
        description,
        videoLinks,
        gdriveHdLink: gdriveHdLinkObj.videoUrl,
        downloadUrl: fileDownloadUrl,
        fileName,
        fileSize,
        mimetype:
          headResponse.headers["content-type"] || "application/octet-stream",
      });
    } catch (error) {
      return createErrorResponse(error, {
        type: ScraperErrorType.DOWNLOAD_ERROR,
        context: { service: "AnimeIndo", episodeUrl },
      });
    }
  },
};
