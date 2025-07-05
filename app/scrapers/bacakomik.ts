import type {
  NBScraperResponse,
  BacaKomikSearchResult,
  BacaKomikLatestResult,
  BacaKomikRecommendationResult,
  BacaKomikFilterOptions,
  BacaKomikDetailData,
  BacaKomikChapterData
} from '../types';
import {ScraperErrorType} from '../types';
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams
} from '../utils';

const API_BASE_URL = 'https://omikbkversialter.click';
const API_HEADERS = {
  'user-agent': 'Postify/1.0.0',
  'Connection': 'Keep-Alive',
  'accept-encoding': 'gzip'
};

// Helper function to parse URL or use ID directly
function parseId(input: string, expectedPage: 'manga' | 'chapter'): string | null {
    try {
        const url = new URL(input);
        const params = new URLSearchParams(url.search);
        if (params.get('page') === expectedPage && params.get('id')) {
            return params.get('id');
        }
        return null;
    } catch {
        // Assume input is a direct ID string if it's not a valid URL
        return input;
    }
}

/**
 * Searches for comics on BacaKomik.
 * @param keyword - The search term.
 * @param page - The page number to retrieve.
 * @returns A promise that resolves to the search results.
 * @example
 * ```typescript
 * import { searchComics } from 'nb-scraper';
 * const results = await searchComics('isekai', 1);
 * if (results.status) {
 * console.log(results.data.data);
 * }
 * ```
 */
export async function searchComics(keyword: string, page: number = 1): Promise<NBScraperResponse<{ query: string; paged: number; total: number; data: BacaKomikSearchResult[] }>> {
    validateRequiredParams({ keyword }, ['keyword']);
    const url = `${API_BASE_URL}/?page=search&search=${encodeURIComponent(keyword)}&paged=${page}`;

    try {
        const response = await makeRequest({ url, headers: API_HEADERS, timeout: 8000 });
        if (!Array.isArray(response.data) || response.data.length === 0) {
            return createErrorResponse('No results found for this query and page.', { type: ScraperErrorType.NOT_FOUND });
        }
        const data = response.data.map((item: any) => ({
            title: item.title || '',
            url: item.url || '',
            image: item.img || '',
            type: item.type || '',
            score: parseFloat(item.score) || 0,
            genres: Array.isArray(item.genre) ? item.genre : [],
            chapter: item.chapter || ''
        }));
        return createSuccessResponse({ query: keyword, paged: page, total: data.length, data });
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'BacaKomik', function: 'searchComics' } });
    }
}

/**
 * Retrieves the latest updated comics.
 * @returns A promise that resolves to the latest comics.
 */
export async function getLatestComics(): Promise<NBScraperResponse<{ total: number; data: BacaKomikLatestResult[] }>> {
    const url = `${API_BASE_URL}/?page=latest`;
    try {
        const response = await makeRequest({ url, headers: API_HEADERS, timeout: 8000 });
        if (!Array.isArray(response.data)) {
            return createErrorResponse('Failed to retrieve latest comics.', { type: ScraperErrorType.API_ERROR });
        }
        const data = response.data.map((item: any) => ({
            title: item.title || '',
            url: item.url || '',
            image: item.img || '',
            type: item.type || '',
            views: item.views || 0,
            score: parseFloat(item.score) || 0,
            status: item.status || '',
            colorized: item.colorized === '1',
            latestChapter: {
                chapter: item.data?.chapter || '',
                url: item.data?.url || '',
                time: item.data?.time || ''
            }
        }));
        return createSuccessResponse({ total: data.length, data });
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'BacaKomik', function: 'getLatestComics' } });
    }
}

/**
 * Retrieves recommended comics.
 * @returns A promise that resolves to recommended comics.
 */
export async function getRecommendedComics(): Promise<NBScraperResponse<{ total: number; data: BacaKomikRecommendationResult[] }>> {
    const url = `${API_BASE_URL}/?page=rekomendasi`;
    try {
        const response = await makeRequest({ url, headers: API_HEADERS, timeout: 8000 });
        if (!Array.isArray(response.data)) {
            return createErrorResponse('Failed to retrieve recommended comics.', { type: ScraperErrorType.API_ERROR });
        }
        const data = response.data.map((item: any) => ({
            title: item.title || '',
            url: item.url || '',
            image: item.img || '',
            type: item.type || '',
            score: parseFloat(item.score) || 0,
            status: item.status || '',
            recommendedChapter: {
                chapter: item.data?.chapter || '',
                url: item.data?.url || '',
                time: item.data?.time || ''
            }
        }));
        return createSuccessResponse({ total: data.length, data });
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'BacaKomik', function: 'getRecommendedComics' } });
    }
}

/**
 * Retrieves comic details by its ID or URL.
 * @param idOrUrl - The comic ID or its full URL.
 * @returns A promise that resolves to the comic's detail.
 */
export async function getComicDetail(idOrUrl: string): Promise<NBScraperResponse<BacaKomikDetailData>> {
    const id = parseId(idOrUrl, 'manga');
    if (!id) {
      return createErrorResponse("Invalid input. Please provide a valid comic URL or ID.", { type: ScraperErrorType.INVALID_INPUT });
    }
    const url = `${API_BASE_URL}/?page=manga&id=${id}`;
    try {
        const response = await makeRequest({ url, headers: API_HEADERS, timeout: 10000 });
        const data = response.data?.[0];
        if (!data) {
            return createErrorResponse('Comic details not found.', { type: ScraperErrorType.NOT_FOUND });
        }
        const result: BacaKomikDetailData = {
            id: id,
            title: data.title || '',
            synopsis: data.synopsis || '',
            score: parseFloat(data.score) || 0,
            status: data.status || '',
            cover: data.cover || '',
            thumbnail: data.img || '',
            author: Array.isArray(data.author) ? data.author.map((a: any) => a.name || '') : [],
            genre: Array.isArray(data.genre) ? data.genre.map((g: any) => g.name || '') : [],
            theme: Array.isArray(data.theme) ? data.theme.map((t: any) => t.name || '') : [],
            content: Array.isArray(data.content) ? data.content.map((c: any) => c.name || '') : [],
            demographic: Array.isArray(data.demographic) ? data.demographic.map((d: any) => d.name || '') : [],
            chapters: Array.isArray(data.data) ? data.data.map((ch: any) => ({
                chapter: ch.chapter || '',
                url: ch.url || '',
                download: ch.download || ''
            })) : []
        };
        return createSuccessResponse(result);
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'BacaKomik', function: 'getComicDetail' } });
    }
}

/**
 * Retrieves a specific chapter's images by its ID or URL.
 * @param idOrUrl - The chapter ID or its full URL.
 * @returns A promise that resolves to the chapter's data.
 */
export async function getChapter(idOrUrl: string): Promise<NBScraperResponse<BacaKomikChapterData>> {
    const id = parseId(idOrUrl, 'chapter');
    if (!id) {
      return createErrorResponse("Invalid input. Please provide a valid chapter URL or ID.", { type: ScraperErrorType.INVALID_INPUT });
    }
    const url = `${API_BASE_URL}/?page=chapter&id=${id}`;
    try {
        const response = await makeRequest({ url, headers: API_HEADERS, timeout: 10000 });
        const data = response.data;
        if (!data?.image?.length) {
            return createErrorResponse('Chapter data or images not found.', { type: ScraperErrorType.NOT_FOUND });
        }
        const result: BacaKomikChapterData = {
            id: id,
            title: data.title || '',
            chapter: data.chapter || '',
            next: data.next || '',
            thumbnail: data.thumb || '',
            readerLink: data.link || '',
            adsLink: data.adsurl || '',
            images: Array.isArray(data.image) ? data.image : []
        };
        return createSuccessResponse(result);
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'BacaKomik', function: 'getChapter' } });
    }
}