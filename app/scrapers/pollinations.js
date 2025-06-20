/**
 * @fileoverview Pollinations AI Image Generation Service
 * Base URL: https://image.pollinations.ai/
 *
 * Features:
 * - Generate images from text prompts
 * - Upload generated images to Catbox.moe for permanent hosting
 * - No logo option available
 *
 * @author NB Team
 * @version 1.0.1
 */
import { Readable } from "stream";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import os from "os";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  makeRequest,
  validateRequiredParams,
} from "../utils";
const BASE_URL = "https://image.pollinations.ai/prompt/";
const UPLOAD_URL = "https://catbox.moe/user/api.php";
/**
 * @alpha
 * Generate image from prompt and upload to Catbox
 *
 * @example
 * ```typescript
 * import { generatePollinationsImage } from 'nb-scraper';
 *
 * const result = await generatePollinationsImage({
 *   prompt: "a beautiful sunset over mountains",
 *   nologo: true
 * });
 *
 * if (result.status) {
 *   console.log(result.data.url); // Catbox.moe URL
 * }
 * ```
 *
 * @param options - Configuration for image generation
 * @returns Promise<NBScraperResponse<PollinationsData>>
 * @author Jul
 */
export async function generatePollinationsImage(options) {
  try {
    // Validate required parameters
    validateRequiredParams(options, ["prompt"]);
    const { prompt, nologo = true } = options;
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${BASE_URL}${encodedPrompt}${nologo ? "?nologo=true" : ""}`;
    const tempPath = path.join(os.tmpdir(), `pollinations_${Date.now()}.jpg`);
    // Download image to temporary file
    const response = await makeRequest({
      url: imageUrl,
      responseType: "arraybuffer",
    });
    // Create stream from buffer and write to file
    const buffer = Buffer.from(response.data);
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    const writer = fs.createWriteStream(tempPath);
    readable.pipe(writer);
    // Wait for download to complete
    await new Promise((resolve, reject) => {
      writer.on("finish", () => resolve());
      writer.on("error", (err) => reject(err));
    });
    // Upload to Catbox.moe
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", fs.createReadStream(tempPath));
    const upload = await makeRequest({
      method: "POST",
      url: UPLOAD_URL,
      data: form,
      headers: form.getHeaders(),
    });
    // Clean up temporary file
    fs.unlinkSync(tempPath);
    if (typeof upload.data !== "string") {
      throw new Error("Invalid upload response");
    }
    return createSuccessResponse({
      url: upload.data,
      directUrl: imageUrl,
    });
  } catch (error) {
    return createErrorResponse(error, {
      type: ScraperErrorType.IMAGE_GENERATION_ERROR,
      context: { service: "Pollinations" },
    });
  }
}
/**
 * Get direct image URL (without upload to Catbox)
 *
 * @example
 * ```typescript
 * import { getPollinationsDirectUrl } from 'nb-scraper';
 *
 * const url = getPollinationsDirectUrl({
 *   prompt: "a beautiful sunset over mountains",
 *   nologo: true
 * });
 *
 * console.log(url); // Direct Pollinations image URL
 * ```
 *
 * @param options - Configuration for image generation
 * @returns string - Direct image URL
 * @author Jul
 */
export function getPollinationsDirectUrl(options) {
  validateRequiredParams(options, ["prompt"]);
  const { prompt, nologo = true } = options;
  const encodedPrompt = encodeURIComponent(prompt);
  return `${BASE_URL}${encodedPrompt}${nologo ? "?nologo=true" : ""}`;
}
