import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const API_BASE_URL = "https://webapi.laratranslate.com";
const API_ENDPOINT = "/translate";
const LARA_HEADERS = {
  authority: "webapi.laratranslate.com",
  origin: "https://lara.com",
  referer: "https://lara.com/",
  "user-agent": "Postify/1.0.0",
  "content-type": "application/json",
};
const LARA_INSTRUCTIONS = {
  Faithful: [],
  Fluid: [
    "Translate this text with a focus on enhancing fluidity and readability. Prioritize natural language flow and coherence, ensuring the translation feels smooth and effortless while retaining the original meaning and intent.",
  ],
  Creative: [
    "Transform this text by infusing creativity, focusing on capturing the essence and emotion rather than a word-for-word translation. Use vivid imagery, dynamic expressions, and a playful tone to make the content engaging and imaginative while maintaining the original message's core themes.",
  ],
};
/**
 * Translates text using lara.com's API with different modes.
 *
 * @param options - The translation options.
 * @returns A promise that resolves to the translated data.
 * @example
 * ```typescript
 * import { laraTranslate } from 'nb-scraper';
 *
 * async function main() {
 * const result = await laraTranslate({
 * text: 'Hello, world!',
 * targetLanguage: 'id',
 * mode: 'Fluid'
 * });
 *
 * if (result.status) {
 * console.log('Translation:', result.data.translation);
 * console.log('Quota left:', result.data.quota);
 * } else {
 * console.error('Error:', result.error);
 * }
 * }
 *
 * main();
 * ```
 * @author Daffa
 * @alpha
 */
export async function laraTranslate(options) {
  try {
    validateRequiredParams(options, ["text", "targetLanguage"]);
    const {
      text,
      targetLanguage,
      sourceLanguage = "",
      mode = "Faithful",
      customInstructions = [],
    } = options;
    if (mode === "Custom" && customInstructions.length === 0) {
      return createErrorResponse(
        "Custom mode requires the 'customInstructions' array to not be empty.",
        {
          type: ScraperErrorType.INVALID_PARAMETER,
        },
      );
    }
    const instructions =
      mode === "Custom" ? customInstructions : LARA_INSTRUCTIONS[mode];
    const payload = {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      instructions,
    };
    const response = await makeRequest({
      method: "POST",
      url: `${API_BASE_URL}${API_ENDPOINT}`,
      data: payload,
      headers: LARA_HEADERS,
    });
    if (response.data.status !== 200 || !response.data.content) {
      return createErrorResponse(
        `API returned status ${response.data.status}`,
        {
          type: ScraperErrorType.API_ERROR,
          context: { service: "LaraTranslate", response: response.data },
        },
      );
    }
    const {
      source_language: sourceLang,
      translation,
      quota,
    } = response.data.content;
    return createSuccessResponse({
      mode,
      originalText: text,
      sourceLanguage: sourceLang,
      targetLanguage,
      translation,
      quota,
    });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.API_ERROR,
      context: { service: "LaraTranslate" },
    });
  }
}
