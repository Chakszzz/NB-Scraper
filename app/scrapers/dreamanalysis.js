/**
 * @fileoverview DreamAnalysis - Dream Interpretation Service
 * Base URL: https://safe-coast-53976-cd772af9b056.herokuapp.com/
 *
 * Features:
 * - Analyze and interpret dreams from text descriptions
 * - Premium analysis features available
 * - Returns detailed interpretation with symbols, emotions, and themes
 *
 * @author NB Team
 * @version 1.0.0
 */
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const BASE_URL = "https://safe-coast-53976-cd772af9b056.herokuapp.com/";
function parseDreamResponse(raw) {
  if (typeof raw !== "string") return null;
  try {
    const data = JSON.parse(raw);
    return {
      analysis: data.analysis,
      interpretation: data.interpretation,
      symbols: data.symbols || [],
      emotions: data.emotions || [],
      themes: data.themes || [],
      metadata: data.metadata || {},
    };
  } catch {
    return null;
  }
}
/**
 * Analyze dream text and get interpretation
 *
 * @example
 * ```typescript
 * import { analyzeDream } from 'nb-scraper';
 *
 * const result = await analyzeDream({
 *   text: "I dreamed I was flying over mountains",
 *   isPremium: true
 * });
 *
 * if (result.status) {
 *   console.log(result.data.interpretation);
 * }
 * ```
 *
 * @param options - Configuration for dream analysis
 * @returns Promise<NBScraperResponse<DreamAnalysisData>>
 * @author NajmyW
 */
export async function analyzeDream(options) {
  try {
    validateRequiredParams(options, ["text"]);
    const { text, isPremium = true } = options;
    const response = await makeRequest({
      url: BASE_URL,
      method: "POST",
      headers: {
        "Accept-Encoding": "gzip",
        Connection: "Keep-Alive",
        "Content-Type": "application/json",
        Host: "safe-coast-53976-cd772af9b056.herokuapp.com",
        "User-Agent": "okhttp/4.9.2",
      },
      data: JSON.stringify({ text, isPremium }),
    });
    const rawResponse = response.data;
    // Type guard untuk rawResponse
    if (typeof rawResponse !== "string") {
      return createErrorResponse("Invalid response format", {
        type: ScraperErrorType.INVALID_RESPONSE,
        context: {
          service: "DreamAnalysis",
          rawResponse: String(rawResponse).substring(0, 100) + "...",
        },
      });
    }
    const parsedData = parseDreamResponse(rawResponse);
    if (!parsedData) {
      return createErrorResponse("Failed to parse Dream response", {
        type: ScraperErrorType.PARSE_ERROR,
        context: {
          rawResponse: rawResponse.substring(0, 100) + "...",
        },
      });
    }
    return createSuccessResponse(parsedData);
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.API_ERROR,
      context: { service: "DreamAnalysis" },
    });
  }
}
/**
 * Quick analysis with basic interpretation
 *
 * @example
 * ```typescript
 * import { quickDreamAnalysis } from 'nb-scraper';
 *
 * const result = await quickDreamAnalysis("I dreamed of being chased");
 * if (result.status) {
 *   console.log(result.data);
 * }
 * ```
 *
 * @param text - Dream description text
 * @returns Promise<NBScraperResponse<DreamAnalysisData>>
 * @author NajmyW
 */
export async function quickDreamAnalysis(text) {
  return analyzeDream({ text, isPremium: false });
}
/**
 * Premium analysis with detailed interpretation
 *
 * @example
 * ```typescript
 * import { premiumDreamAnalysis } from 'nb-scraper';
 *
 * const result = await premiumDreamAnalysis("I dreamed I could breathe underwater");
 * if (result.status) {
 *   console.log(result.data.symbols);
 * }
 * ```
 *
 * @param text - Dream description text
 * @returns Promise<NBScraperResponse<DreamAnalysisData>>
 * @author NajmyW
 */
export async function premiumDreamAnalysis(text) {
  return analyzeDream({ text, isPremium: true });
}
