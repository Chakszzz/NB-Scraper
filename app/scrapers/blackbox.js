/**
 * @fileoverview BlackBox AI scraper implementation
 * @author From NB
 * @version 1.0.0
 */
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
  safeJsonParse,
} from "../utils";
/**
 * Default BlackBox AI configuration
 */
const DEFAULT_BLACKBOX_CONFIG = {
  maxTokens: 1024,
  temperature: null,
  webSearchMode: false,
  memoryEnabled: false,
};
/**
 * Scrapes BlackBox AI for responses to queries
 *
 * @example
 * ```typescript
 * import { blackboxAi } from 'nb-scraper';
 *
 * const result = await blackboxAi('What is TypeScript?');
 * if (result.status) {
 *   console.log(result.data.response);
 *   console.log(result.data.source);
 * }
 * ```
 *
 * @param query - The query to send to BlackBox AI
 * @param options - Optional configuration for the request
 * @returns Promise resolving to the AI response with sources
 *
 * @throws Will not throw errors, returns error response instead
 *
 * @public
 * @author Pratama
 */
export async function blackboxAi(query, options = {}) {
  try {
    // Validate input parameters
    validateRequiredParams({ query }, ["query"]);
    // Sanitize and validate query
    const sanitizedQuery = query.trim();
    if (sanitizedQuery.length === 0) {
      return createErrorResponse("Query cannot be empty", { query });
    }
    if (sanitizedQuery.length > 10000) {
      return createErrorResponse("Query too long (max 10,000 characters)", {
        queryLength: sanitizedQuery.length,
      });
    }
    // Merge options with defaults
    const config = { ...DEFAULT_BLACKBOX_CONFIG, ...options };
    // Prepare request headers
    const headers = {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "id-ID,id;q=0.9",
      "Content-Type": "application/json",
      Origin: "https://www.blackbox.ai",
      Referer: "https://www.blackbox.ai/",
      "Sec-Ch-Ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
      "Sec-Ch-Ua-Mobile": "?1",
      "Sec-Ch-Ua-Platform": '"Android"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      ...options.headers,
    };
    // Prepare request payload
    const payload = {
      messages: [
        {
          role: "user",
          content: sanitizedQuery,
          id: generateRandomId(),
        },
      ],
      id: generateRandomId(),
      previewToken: null,
      userId: null,
      codeModelMode: true,
      trendingAgentMode: {},
      isMicMode: false,
      userSystemPrompt: null,
      maxTokens: config.maxTokens,
      playgroundTopP: null,
      playgroundTemperature: config.temperature,
      isChromeExt: false,
      githubToken: "",
      clickedAnswer2: false,
      clickedAnswer3: false,
      clickedForceWebSearch: config.webSearchMode,
      visitFromDelta: false,
      isMemoryEnabled: config.memoryEnabled,
      mobileClient: false,
      userSelectedModel: null,
      validated: generateUUID(),
      imageGenerationMode: false,
      webSearchModePrompt: config.webSearchMode,
      deepSearchMode: false,
      domains: null,
      vscodeClient: false,
      codeInterpreterMode: false,
      customProfile: {
        name: "",
        occupation: "",
        traits: [],
        additionalInfo: "",
        enableNewChats: false,
      },
      webSearchModeOption: {
        autoMode: true,
        webMode: config.webSearchMode,
        offlineMode: !config.webSearchMode,
      },
      session: null,
      isPremium: false,
      subscriptionCache: null,
      beastMode: false,
      reasoningMode: false,
      designerMode: false,
      workspaceId: "",
      asyncMode: false,
      isTaskPersistent: false,
    };
    // Make the request
    const response = await makeRequest(
      {
        method: "POST",
        url: "https://www.blackbox.ai/api/chat",
        data: payload,
        headers,
      },
      {
        timeout: options.timeout,
        retries: options.retries,
        retryDelay: options.retryDelay,
      },
    );
    // Validate response
    if (!response.data || typeof response.data !== "string") {
      return createErrorResponse("Invalid response format from BlackBox AI", {
        responseType: typeof response.data,
        status: response.status,
      });
    }
    // Parse response
    const rawResponse = response.data;
    const parsedData = parseBlackBoxResponse(rawResponse);
    if (!parsedData) {
      return createErrorResponse("Failed to parse BlackBox AI response", {
        rawResponse: rawResponse.substring(0, 100) + "...",
      });
    }
    return createSuccessResponse(parsedData);
  } catch (error) {
    return createErrorResponse(error, {
      query: query.substring(0, 100),
      options: { ...options, headers: undefined }, // Don't log headers for security
    });
  }
}
/**
 * Parses the raw response from BlackBox AI
 * @param rawResponse - The raw response string
 * @returns Parsed data or null if parsing failed
 * @internal
 */
function parseBlackBoxResponse(rawResponse) {
  try {
    const parsed = rawResponse.split("$~~~$");
    if (parsed.length === 1) {
      // Simple response without sources
      const response = parsed[0]?.trim();
      if (!response) {
        return null;
      }
      return {
        response,
        source: [],
      };
    } else if (parsed.length >= 3) {
      // Response with sources
      const response = parsed[2]?.trim();
      const sourcesData = parsed[1];
      if (!response || !sourcesData) {
        return null;
      }
      const sources = safeJsonParse(sourcesData);
      if (!Array.isArray(sources)) {
        // If sources parsing fails, return response without sources
        return {
          response,
          source: [],
        };
      }
      // Validate and sanitize sources
      const validSources = sources
        .filter(
          (source) =>
            source &&
            typeof source === "object" &&
            typeof source.link === "string" &&
            typeof source.title === "string",
        )
        .map((source) => ({
          link: source.link,
          title: source.title,
          snippet: source.snippet || "",
          position: typeof source.position === "number" ? source.position : 0,
        }));
      return {
        response,
        source: validSources,
      };
    }
    return null;
  } catch {
    return null;
  }
}
/**
 * Generates a random ID for requests
 * @returns Random ID string
 * @internal
 */
function generateRandomId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
/**
 * Generates a UUID v4
 * @returns UUID string
 * @internal
 */
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
