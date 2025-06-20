/**
 * @fileoverview DeepInfra AI Chat Service
 * Base URL: https://ai-sdk-starter-deepinfra.vercel.app/api/chat
 *
 * Features:
 * - AI text generation with multiple model support
 * - Handles various response formats
 * - Fallback for empty responses
 *
 * @author Woi
 * @version 1.0.0
 */
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const BASE_URL = "https://ai-sdk-starter-deepinfra.vercel.app/api/chat";
/**
 * Available DeepInfra AI models
 */
export const DEEPINFRA_MODELS = [
  "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  "deepseek-ai/DeepSeek-R1",
  "Qwen/Qwen2.5-72B-Instruct",
];
/**
 * Generate AI response using DeepInfra
 *
 * @example
 * ```typescript
 * import { generateDeepInfraResponse } from 'nb-scraper';
 *
 * const result = await generateDeepInfraResponse({
 *   prompt: "Explain JavaScript in simple terms",
 *   model: "deepseek-ai/DeepSeek-R1"
 * });
 *
 * if (result.status) {
 *   console.log(result.data.response);
 * }
 * ```
 *
 * @param options - Configuration for the AI request
 * @returns Promise<NBScraperResponse<DeepInfraAIData>>
 * @author Woi
 */
export async function generateDeepInfraResponse(options) {
  try {
    validateRequiredParams(options, ["prompt"]);
    const { prompt, model = "meta-llama/Llama-3.3-70B-Instruct-Turbo" } =
      options;
    const body = {
      id: Math.random().toString(36).slice(2),
      selectedModel: model,
      messages: [
        {
          role: "user",
          content: prompt,
          parts: [{ type: "text", text: prompt }],
        },
      ],
    };
    const response = await makeRequest({
      url: BASE_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });
    // Process response parts
    const parts = [];
    const responseData = response.data;
    if (responseData && typeof responseData === "object") {
      const data = responseData;
      if (data.g) {
        parts.push(...(Array.isArray(data.g) ? data.g : [data.g]));
      }
      if (data.f) {
        parts.push(...(Array.isArray(data.f) ? data.f : [data.f]));
      }
      if (data["0"]) {
        parts.push(...(Array.isArray(data["0"]) ? data["0"] : [data["0"]]));
      }
    } else if (typeof responseData === "string") {
      parts.push(responseData);
    }
    const result = parts.join("").trim() || "No response generated";
    return createSuccessResponse({
      response: result,
    });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.API_ERROR,
      context: {
        service: "DeepInfraAI",
        model: options.model,
      },
    });
  }
}
