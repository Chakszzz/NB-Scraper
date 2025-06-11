/**
 * @fileoverview ExomlAPI - AI Text Completion Service
 * Base URL: https://exomlapi.com/
 * 
 * Features:
 * - AI text completion with conversation support
 * - Multiple model support (GPT-4.1, GPT-4o, Llama, etc.)
 * - Text-only responses
 * 
 * Note: Some models may hang with slow fetch times
 * 
 * @author wolep
 * @version 1.0.0
 * @lastUpdated 2025-06-07
 */

import {
  NBScraperResponse,
  CharSetOptions,
  ExomlAPIData,
  ExomlAPIOptions,
  ExomlAPIMessage,
  ExomlAPIRandomData,
  ScraperErrorType
} from '../types';
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams
} from '../utils';

const BASE_URL = 'https://exomlapi.com/api/chat';

// Available models
export const EXOML_MODELS = [
  'llama',
  'gemma',
  'qwen-3-235b',
  'gpt-4.1',
  'gpt-4o',
  'gpt-4o-mini',
  'llama-4-scout',
  'llama-4-maverick',
  'deepseek-r1',
  'qwq-32b'
] as
const;

export type ExomlModel = typeof EXOML_MODELS[number];

/**
 * Generate random IDs for API request
 */
function generateRandomIds(): ExomlAPIRandomData {
  const gen = (length: number, charSet: CharSetOptions = {}): string => {
    const l = "abcdefghijklmnopqrstuvwxyz";
    const u = l.toUpperCase();
    const s = "-_";
    const n = "0123456789";
    
    const {
      lowerCase = false,
        upperCase = false,
        symbol = false,
        number = false
    } = charSet;
    
    // Build character set based on options
    let cs = "";
    if (!lowerCase && !upperCase && !symbol && !number) {
      cs = l + u + s + n; // Default: include everything
    } else {
      if (lowerCase) cs += l;
      if (upperCase) cs += u;
      if (symbol) cs += s;
      if (number) cs += n;
    }
    
    // Generate random string
    return Array.from({ length }, () =>
      cs[Math.floor(Math.random() * cs.length)]
    ).join("");
  };
  
  // Generate IDs with specific character sets
  const id = gen(16, { upperCase: true, lowerCase: true, number: true });
  const timestamp = new Date().getTime();
  const chatId =
    `chat-${timestamp}-${gen(9, { lowerCase: true, number: true })}`;
  const userId =
    `local-user-${timestamp}-${gen(9, { lowerCase: true, number: true })}`;
  const antiBotId = `${gen(32)}-${gen(8, { number: true, lowerCase: true })}`;
  
  return { id, chatId, userId, antiBotId };
}

/**
 * Create a conversation message
 * 
 * @example
 * ```typescript
 * import { createExomlMessage } from 'nb-scraper';
 * 
 * const message = createExomlMessage("user", "Hello, how are you?");
 * ```
 * 
 * @param role - Message role
 * @param content - Message content
 * @returns ExomlAPIMessage
 */
export function createExomlMessage(
  role: "user" | "assistant" | "system",
  content: string
): ExomlAPIMessage {
  return { role, content };
}

/**
 * Generate AI response
 * 
 * @example
 * ```typescript
 * import { generateExomlResponse } from 'nb-scraper';
 * 
 * const result = await generateExomlResponse({
 *   messages: [
 *     createExomlMessage("user", "Hello, how are you?")
 *   ],
 *   model: "gpt-4.1"
 * });
 * 
 * if (result.status) {
 *   console.log(result.data.content);
 * }
 * ```
 * 
 * @param options - Configuration for the AI request
 * @returns Promise<NBScraperResponse<ExomlAPIData>>
 */
export async function generateExomlResponse(
  options: ExomlAPIOptions
): Promise < NBScraperResponse < ExomlAPIData >> {
  try {
    validateRequiredParams(options, ['messages']);
    
    const { messages, systemPrompt = "", model = "gpt-4.1" } = options;
    
    if (!EXOML_MODELS.includes(model as ExomlModel)) {
      return createErrorResponse(
        `Invalid model. Available models: ${EXOML_MODELS.join(', ')}`, {
          type: ScraperErrorType.INVALID_PARAMETER,
          context: { model }
        });
    }
    
    const body = JSON.stringify({
      messages,
      systemPrompt,
      model,
      isAuthenticated: true,
      ...generateRandomIds()
    });
    
    const response = await makeRequest < { data: string } > ({
      url: BASE_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body
    });
    
    if (typeof response.data !== 'string') {
      return createErrorResponse('Invalid response format from server', {
        type: ScraperErrorType.INVALID_RESPONSE,
        context: { rawResponse: response.data }
      });
    }
    
    // Parse response (parsing might be imperfect)
    const data = response.data;
    const content = [...data.matchAll(/^0:"(.*?)"$/gm)]
      .map(v => v[1])
      .join("")
      .replaceAll("\\n", "\n")
      .replaceAll("\\\"", "\"");
    
    if (!content) {
      return createErrorResponse('Failed to parse message from server', {
        type: ScraperErrorType.PARSE_ERROR,
        context: { rawResponse: data }
      });
    }
    
    return createSuccessResponse < ExomlAPIData > ({ content });
  } catch (error) {
    return createErrorResponse(error as Error, {
      type: ScraperErrorType.API_ERROR,
      context: { service: 'ExomlAPI' }
    });
  }
}