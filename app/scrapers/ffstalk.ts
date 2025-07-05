import * as cheerio from 'cheerio';
import type {
    NBScraperResponse,
    FFStalkData,
    FFStalkAccountInfo,
    FFStalkPetInfo,
    FFStalkGuildInfo,
    FFStalkEquipped
} from '../types';
import {ScraperErrorType} from '../types';
import {
    createErrorResponse,
    createSuccessResponse,
    makeRequest,
    validateRequiredParams
} from '../utils';

const TARGET_URL = 'https://freefireinfo.in/get-free-fire-account-information-via-uid/';
const SITE_KEY = '0x4AAAAAABAe_Da-31Q7nqIm';

/**
 * Fetches a Cloudflare Turnstile token from an external solver API.
 * You can use this function if needed
 * 
 * @example 
 * ```ts
 * import {getTurnstileToken} from 'nb-scraper'
 * 
 * const result = await getTurnstileToken()
 * console.log(result) // you will get the token turnstile
 * ```
 * > also, this service can be down at anytime, feel free to pull requests if you interested to refactor the code
 * @author YogikID
 * @beta
 * @see {@link https://developers.cloudflare.com/turnstile/ | Cloudflare Turnstile Documentation}
 */
export async function getTurnstileToken(): Promise<string> {
  const solverApiUrl = `https://api.yogik.id/tools/tcloudflare/?url=${TARGET_URL}&siteKey=${SITE_KEY}`;
  const response = await makeRequest<any>({ url: solverApiUrl });
  const token = response.data?.data?.token;
  if (!token) {
    throw new Error('Failed to get a valid Turnstile token from the solver API.');
  }
  return token;
}

/**
 * Fetches and parses Free Fire user information based on their UID.
 * @param uid - The User ID of the Free Fire account.
 * @returns A promise that resolves to the scraped account data.
 * @example
 * ```typescript
 * import { ffstalk } from 'nb-scraper';
 *
 * async function getFreeFireAccount() {
 * const result = await ffstalk('USER_ID_HERE');
 * if (result.status) {
 * console.log('Player Name:', result.data.accountInfo['Nickname']);
 * console.log('Guild:', result.data.guildInfo['Guild Name']);
 * } else {
 * console.error(result.error);
 * }
 * }
 *
 * getFreeFireAccount();
 * ```
 * @author YogikID
 */
export async function ffstalk(uid: string): Promise<NBScraperResponse<FFStalkData>> {
    try {
        validateRequiredParams({ uid }, ['uid']);

        // 1. Get the Turnstile token
        const token = await getTurnstileToken();

        // 2. Make the main request to fetch user data
        const requestBody = new URLSearchParams({ uid, 'cf-turnstile-response': token });
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
            'User-Agent': 'Mozilla/5.0'
        };

        const response = await makeRequest<string>({
            method: 'POST',
            url: TARGET_URL,
            data: requestBody.toString(),
            headers,
            responseType: 'text' // Ensure we get raw HTML
        });

        // 3. Parse the HTML response
        const $ = cheerio.load(response.data);
        const $result = $('.result');

        if (!$result.length) {
            return createErrorResponse('Result container not found. The page structure may have changed or the UID is invalid.', {
                type: ScraperErrorType.PARSE_ERROR
            });
        }

        $result.find('br').replaceWith('\n');
        const lines = $result.text().split('\n').map(l => l.trim()).filter(l => l);

        const petIndex = lines.findIndex(l => l.includes('Pet Information'));
        const guildIndex = lines.findIndex(l => l.includes('Guild Information'));

        const accountInfo: FFStalkAccountInfo = {};
        lines.slice(0, petIndex > -1 ? petIndex : guildIndex > -1 ? guildIndex : lines.length)
            .filter(l => l.startsWith('✔'))
            .forEach(line => {
                const [key, ...vals] = line.slice(1).trim().split(':');
                if (key) accountInfo[key.trim()] = vals.join(':').trim();
            });

        const petInfo: FFStalkPetInfo = {};
        if (petIndex > -1) {
            lines.slice(petIndex + 1, guildIndex > -1 ? guildIndex : lines.length)
                .filter(l => l.startsWith('✔'))
                .forEach(line => {
                    const [key, ...vals] = line.slice(1).trim().split(':');
                    if (key) petInfo[key.trim()] = vals.join(':').trim();
                });
        }

        const guildInfo: FFStalkGuildInfo = {};
        if (guildIndex > -1) {
            lines.slice(guildIndex + 1)
                .filter(l => l.startsWith('✔'))
                .forEach(line => {
                    const [key, ...vals] = line.slice(1).trim().split(':');
                    if (key) guildInfo[key.trim()] = vals.join(':').trim();
                });
        }

        const equipped: FFStalkEquipped = {};
        $('.equipped-items h4').each((_, h4) => {
            const category = $(h4).text().trim();
            if (category) {
                equipped[category] = [];
                $(h4).nextUntil('h4', '.equipped-item').each((_, item) => {
                    const $item = $(item);
                    const name = $item.find('p').text().trim();
                    const img = $item.find('img').attr('data-lazy-src') || $item.find('img').attr('src') || '';
                    equipped[category].push({ name, image: img });
                });
            }
        });

        return createSuccessResponse({ accountInfo, petInfo, guildInfo, equipped });

    } catch (error) {
        return createErrorResponse(error as Error, {
            type: ScraperErrorType.API_ERROR,
            context: { service: 'ffstalk' }
        });
    }
}