import type {
  NBScraperResponse,
  UnaimytextData,
  UnaimytextOptions,
  UnaimytextLevel
} from '../types';
import { ScraperErrorType } from '../types';
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams
} from '../utils';

const API_URL = 'https://unaimytext.com/api/humanize';
const API_HEADERS = {
  'authority': 'unaimytext.com',
  'accept': '*/*',
  'content-type': 'application/json',
  'origin': 'https://unaimytext.com',
  'referer': 'https://unaimytext.com/',
  'user-agent': 'Postify/1.0.0'
};

const DEFAULT_SETTINGS = {
  removeUnicode: true,
  dashesToCommas: true,
  removeDashes: true,
  transformQuotes: true,
  removeWhitespace: true,
  removeEmDash: true,
  keyboardOnly: true
};

/**
 * Humanizes AI-generated text to make it sound more natural using unaimytext.com.
 * @param options - The options for humanizing text.
 * @returns A promise that resolves to the humanized text data.
 * @example
 * ```typescript
 * import { unaimytextHumanize } from 'nb-scraper';
 *
 * async function humanizeContent() {
 * const aiText = "The utilization of advanced methodologies facilitates the optimization of operational efficiencies.";
 * const result = await unaimytextHumanize({
 * text: aiText,
 * level: 'enhanced'
 * });
 *
 * if (result.status) {
 * console.log('Original Length:', result.data.originalLength);
 * console.log('Humanized Text:', result.data.humanizedText);
 * console.log('Reduction:', result.data.reductionPercentage);
 * } else {
 * console.error(result.error);
 * }
 * }
 *
 * humanizeContent();
 * ```
 * @author Daffa
 */
export async function unaimytextHumanize(
  options: UnaimytextOptions
): Promise<NBScraperResponse<UnaimytextData>> {
  try {
    validateRequiredParams(options, ['text']);

    const { text, level = 'enhanced', settings = {} } = options;
    const validLevels: UnaimytextLevel[] = ["standard", "enhanced", "aggressive"];

    if (!validLevels.includes(level)) {
      return createErrorResponse(
        `Invalid level: '${level}'. Available levels are: ${validLevels.join(', ')}`, {
          type: ScraperErrorType.INVALID_PARAMETER
        }
      );
    }
    
    const payload = {
      text,
      recaptchaToken: "", // Token is not required for this API endpoint
      level,
      settings: { ...DEFAULT_SETTINGS, ...settings }
    };

    const response = await makeRequest<{ text: string }>({
      method: 'POST',
      url: API_URL,
      data: payload,
      headers: API_HEADERS,
      timeout: 10000
    });

    if (!response.data?.text) {
      return createErrorResponse('Empty response from Unaimytext API.', {
        type: ScraperErrorType.NOT_FOUND
      });
    }

    const humanizedText = response.data.text;
    const originalLength = text.length;
    const transformedLength = humanizedText.length;
    const reductionPercentage = (((originalLength - transformedLength) / originalLength) * 100).toFixed(2) + '%';
    
    return createSuccessResponse({
      humanizedText,
      level,
      originalLength,
      transformedLength,
      reductionPercentage
    });

  } catch (error) {
    return createErrorResponse(error as Error, {
      type: ScraperErrorType.API_ERROR,
      context: { service: 'Unaimytext' }
    });
  }
}