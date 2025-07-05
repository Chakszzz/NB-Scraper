import * as cheerio from 'cheerio';
import type {
    NBScraperResponse,
    SSYoutubeData,
    SSYoutubeDownloadFormat
} from '../types';
import { ScraperErrorType } from '../types';
import {
    createErrorResponse,
    createSuccessResponse,
    makeRequest,
    validateRequiredParams
} from '../utils';

/**
 * MurmurHash64 implementation needed for the API request.
 * @param str The string to hash.
 * @returns A 64-bit hash as a hex string.
 */
function murmurHash64(str: string): string {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;

    for (let i = 0; i < str.length; i++) {
        const k = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ k, 0x85ebca6b);
        h2 = Math.imul(h2 ^ k, 0xc2b2ae35);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 0x85ebca6b) ^ Math.imul(h2 ^ (h2 >>> 13), 0xc2b2ae35);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 0x85ebca6b) ^ Math.imul(h1 ^ (h1 >>> 13), 0xc2b2ae35);

    const h1Hex = (h1 >>> 0).toString(16).padStart(8, '0');
    const h2Hex = (h2 >>> 0).toString(16).padStart(8, '0');

    return h1Hex + h2Hex;
}

/**
 * Scrapes YouTube video download links from ssyoutube.rip.
 * This function relies on an external API to solve Cloudflare challenges.
 * @param url - The full URL of the YouTube video.
 * @returns A promise that resolves to the scraped download data.
 * @example
 * ```typescript
 * import { ssyoutube } from 'nb-scraper';
 *
 * async function downloadVideo() {
 * const result = await ssyoutube('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * if (result.status) {
 * console.log('Title:', result.data.title);
 * console.log('Video with audio:', result.data.downloads.video.find(v => v.hasAudio));
 * } else {
 * console.error(result.error);
 * }
 * }
 *
 * downloadVideo();
 * ```
 * @author Yogikid
 */
export async function ssyoutube(url: string): Promise<NBScraperResponse<SSYoutubeData>> {
    try {
        validateRequiredParams({ url }, ['url']);

        const siteKey = '0x4AAAAAAAzuNQE5IJEnuaAp';
        const solverApiUrl = `https://api.yogik.id/tools/tcloudflare/?url=https://ssyoutube.rip/en-a1/&siteKey=${siteKey}`;
        
        const tokenResponse = await makeRequest<any>({ url: solverApiUrl });
        const cfToken = tokenResponse.data?.data?.token;

        if (!cfToken) {
            return createErrorResponse('Failed to get a valid token from the solver API.', {
                type: ScraperErrorType.AUTH_ERROR
            });
        }

        const mhash = murmurHash64(url);
        const targetApiUrl = `https://ssyoutube.rip/mates/en/analyze/ajax?retry=undefined&platform=youtube&mhash=${mhash}`;
        const requestBody = new URLSearchParams({ 'url': url, 'ajax': '1', 'lang': 'en', 'cftoken': cfToken });
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0'
        };

        const finalResponse = await makeRequest<any>({
            method: 'POST',
            url: targetApiUrl,
            data: requestBody.toString(),
            headers
        });

        if (!finalResponse.data || typeof finalResponse.data.result !== 'string') {
            return createErrorResponse('Failed to get valid data from ssyoutube.rip. The response format may have changed.', {
                type: ScraperErrorType.INVALID_RESPONSE
            });
        }

        const $ = cheerio.load(finalResponse.data.result);
        const title = $('#video_title').text().trim();

        if (!title) {
            return createErrorResponse('Failed to parse HTML. The page structure may have changed.', {
                type: ScraperErrorType.PARSE_ERROR
            });
        }

        const apiOutput: SSYoutubeData = {
            title: title,
            duration: $('p.m-b-0.m-t').text().replace('Duration:', '').trim(),
            thumbnail: $('img.img-thumbnail').attr('src') || '',
            downloads: {
                video: [],
                audio: []
            }
        };

        let currentSection = '';
        $('table tr').each((_, element) => {
            const row = $(element);
            if (row.find('strong').length > 0) {
                currentSection = row.find('strong').text().trim().toLowerCase();
                return;
            }
            const columns = row.find('td');
            if (columns.length === 3) {
                const downloadButton = $(columns[2]).find('a, button');
                const url = downloadButton.attr('href') || downloadButton.data('url');
                if (url) {
                    const format: SSYoutubeDownloadFormat = {
                        url: url,
                        quality: $(columns[0]).text().trim().replace(/\s+/g, ' '),
                        ext: downloadButton.data('ftype') || 'N/A',
                        size: $(columns[1]).text().trim(),
                    };
                    if (currentSection === 'video') {
                        format.hasAudio = !row.hasClass('noaudio');
                        apiOutput.downloads.video.push(format);
                    } else if (currentSection === 'audio') {
                        apiOutput.downloads.audio.push(format);
                    }
                }
            }
        });

        return createSuccessResponse(apiOutput);

    } catch (error) {
        return createErrorResponse(error as Error, {
            type: ScraperErrorType.API_ERROR,
            context: { service: 'ssyoutube' }
        });
    }
}