/* • Scraper Liputan 6 ( Search, news, detail )
• Source: by SaaOfc
*/
import * as cheerio from "cheerio";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const BASE_URL = "https://www.liputan6.com";
/**
 * Get the updated news indonesian, from Liputan6 News
 * @author saaoffc
 */
export const liputan6 = {
  /**
   * Get updated News
   * @example
   * ```ts
   * import liputan6 from 'nb-scraper';
   *
   * const result = await liputan6.getNews()
   * console.log(result)
   * ```
   * @beta
   */
  async getNews() {
    try {
      const response = await makeRequest({ url: BASE_URL });
      const $ = cheerio.load(response.data);
      const articles = [];
      $(".articles--iridescent-list--text-item").each((_, el) => {
        const title = $(el)
          .find(".articles--iridescent-list--text-item__title-link")
          .text()
          .trim();
        const link = $(el)
          .find(".articles--iridescent-list--text-item__title-link")
          .attr("href");
        const thumb =
          $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
        const summary = $(el)
          .find(".articles--iridescent-list--text-item__summary")
          .text()
          .trim();
        if (title && link) {
          articles.push({
            title,
            link: link.startsWith("http") ? link : BASE_URL + link,
            thumb,
            summary,
            //author: 'saaoffc' future update will be implemented to all scrapers
          });
        }
      });
      return createSuccessResponse(articles);
    } catch (error) {
      return createErrorResponse(error, {
        type: ScraperErrorType.API_ERROR,
        context: { service: "Liputan6", function: "getNews" },
      });
    }
  },
  /**
   * Search news from the given query.
   * @param query - (eg. free palestine)
   * @example
   * ```ts
   * import liputan6 from 'nb-scraper';
   *
   * const result = await liputan6.searchNews("junkfood")
   * console.log(result)
   * ```
   * @beta
   */
  async searchNews(query) {
    try {
      validateRequiredParams({ query }, ["query"]);
      const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
      const response = await makeRequest({ url });
      const $ = cheerio.load(response.data);
      const results = [];
      $(".articles--iridescent-list--text-item").each((_, el) => {
        const a = $(el).find(
          ".articles--iridescent-list--text-item__title-link",
        );
        const title = a.text().trim();
        const href = a.attr("href");
        if (title && href) {
          const link = href.startsWith("http") ? href : BASE_URL + href;
          results.push({
            title,
            link,
            // author: 'saaoffc'
          });
        }
      });
      return createSuccessResponse(results);
    } catch (error) {
      return createErrorResponse(error, {
        type: ScraperErrorType.API_ERROR,
        context: { service: "Liputan6", query },
      });
    }
  },
  /**
   * Get detailed news from Liputan6 Url
   * @param url - URL Liputan6 News.
   * @example
   * ```ts
   * import liputan6 from 'nb-scraper';
   *
   * const result = await liputan6.newsDetail()
   * console.log(result)
   * ```
   * @beta
   */
  async newsDetail(url) {
    try {
      validateRequiredParams({ url }, ["url"]);
      let currentPage = 1;
      let fullHtml = "";
      const baseUrl = url.split("?")[0];
      let hasNextPage = true;
      // (paginasi)
      while (hasNextPage) {
        const pageUrl =
          currentPage === 1 ? baseUrl : `${baseUrl}?page=${currentPage}`;
        const response = await makeRequest({ url: pageUrl });
        fullHtml += response.data;
        const $page = cheerio.load(response.data);
        hasNextPage = $page(".paging__link--next").length > 0;
        currentPage++;
      }
      const $ = cheerio.load(fullHtml);
      const title =
        $('meta[property="og:title"]').attr("content") || $("title").text();
      const description = $('meta[name="description"]').attr("content");
      const image = $('meta[property="og:image"]').attr("content");
      const published =
        $('meta[property="article:published_time"]').attr("content") ||
        $("time").text();
      const author =
        $('meta[name="author"]').attr("content") ||
        $('a[href*="/penulis/"]').first().text().trim();
      const content = [];
      $(".article-content-body__item-page p").each((_, el) => {
        const text = $(el).text().trim();
        if (text) content.push(text);
      });
      const detail = {
        title,
        description,
        image,
        published,
        author,
        content: content.join("\n\n"),
      };
      return createSuccessResponse(detail);
    } catch (error) {
      return createErrorResponse(error, {
        type: ScraperErrorType.API_ERROR,
        context: { service: "Liputan6", url },
      });
    }
  },
};
