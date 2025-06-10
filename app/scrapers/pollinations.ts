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
 * @version 1.0.0
 */

import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { 
  NBScraperResponse, 
  PollinationsData, 
  PollinationsOptions,
  ScraperErrorType
} from '../types';
import { 
  createErrorResponse, 
  createSuccessResponse, 
  makeRequest, 
  validateRequiredParams,
} from '../utils';

const BASE_URL = 'https://image.pollinations.ai/prompt/';
const UPLOAD_URL = 'https://catbox.moe/user/api.php';

/**
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
 */
export async function generatePollinationsImage(
  options: PollinationsOptions
): Promise<NBScraperResponse<PollinationsData>> {
  try {
    // Validate required parameters
    validateRequiredParams(options, ['prompt']);

    const { prompt, nologo = true } = options;

    // Encode prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${BASE_URL}${encodedPrompt}${nologo ? '?nologo=true' : ''}`;

    // Download image to temporary file
    const response = await makeRequest({
      url: imageUrl,
      responseType: 'stream'
    });

    const tempPath = path.join(os.tmpdir(), `pollinations_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(tempPath);
    
    response.data.pipe(writer);

    // Wait for download to complete
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Upload to Catbox.moe
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', fs.createReadStream(tempPath));

    const upload = await makeRequest({
      method: 'POST',
      url: UPLOAD_URL,
      data: form,
      headers: form.getHeaders()
    });

    // Clean up temporary file
    fs.unlinkSync(tempPath);

    return createSuccessResponse<PollinationsData>({
      url: upload.data,
      directUrl: imageUrl
    });
  } catch (error) {
    return createErrorResponse(error as Error, {
      type: ScraperErrorType.IMAGE_GENERATION_ERROR,
      context: { service: 'Pollinations' }
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
 */
export function getPollinationsDirectUrl(options: PollinationsOptions): string {
  validateRequiredParams(options, ['prompt']);
  
  const { prompt, nologo = true } = options;
  const encodedPrompt = encodeURIComponent(prompt);
  return `${BASE_URL}${encodedPrompt}${nologo ? '?nologo=true' : ''}`;
}