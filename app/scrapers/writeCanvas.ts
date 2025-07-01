/**
 * @fileoverview Lemon Write scraper function
 * @version 1.1.1
 */

import axios, { AxiosResponse } from 'axios';
import { NBScraperResponse } from '../types';
import { createErrorResponse, createSuccessResponse, validateRequiredParams } from '../utils';

export interface LemonWriteOptions {
  font?: string;
  color?: string;
  size?: string;
}

export interface LemonWriteResult {
  imageBuffer: Buffer;
  contentType: string;
}

const LEMON_WRITE_API = 'https://lemon-write.vercel.app/api/generate-book';

/**
 * Generates an image using Lemon Write API
 *
 * @param text - Text to convert into image
 * @param options - Optional customization (font, color, size)
 * @returns Image buffer wrapped in response format
 *
 * @example
 * const result = await lemonWrite("Hello 🍋", { font: "Pacifico", color: "#FF00FF", size: "32" });
 * if (result.success) {
 *   fs.writeFileSync('output.png', result.data.imageBuffer);
 * }
 */
export async function lemonWrite(
  text: string,
  options: LemonWriteOptions = {}
): Promise<NBScraperResponse<LemonWriteResult>> {
  try {
    validateRequiredParams({ text }, ['text']);

    // Validate color format
    if (options.color && !/^#?[0-9A-Fa-f]{6}$/.test(options.color)) {
      throw new Error('Parameter "color" harus dalam format hex, misalnya: #000000');
    }

    const payload = {
      text,
      font: options.font || 'default',
      color: options.color
        ? (options.color.startsWith('#') ? options.color : `#${options.color}`)
        : '#000000',
      size: options.size || '28'
    };

    const response: AxiosResponse<ArrayBuffer> = await axios.post(LEMON_WRITE_API, payload, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return createSuccessResponse({
      imageBuffer: Buffer.from(response.data),
      contentType: response.headers['content-type'] || 'image/png'
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return createErrorResponse(
        new Error(`Lemon Write API error: ${error.response?.status} ${error.response?.statusText}`),
        { text, ...options }
      );
    }

    return createErrorResponse(error as Error, { text, ...options });
  }
}
