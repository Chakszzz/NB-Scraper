import FormData from "form-data";
import type {
    NBScraperResponse,
    TranslateImageOptions,
    TranslateMangaOptions,
    TranslateEcommerceOptions,
    TranslateImageResult,
    TranslateImageCredentials
} from '../types';
import {ScraperErrorType} from '../types';
import {
    createErrorResponse,
    createSuccessResponse,
    makeRequest,
    validateRequiredParams
} from '../utils';

const BASE_URL = "https://translateimage.app";
const API_URL = "https://api.translateimage.app";

const DEFAULT_HEADERS = {
    "accept": "*/*",
    "accept-language": "ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7",
    "origin": BASE_URL,
    "referer": `${BASE_URL}/`,
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
};

// --- Internal Helper Functions ---

async function getUploadCredentials(filename: string, fileType: string): Promise<TranslateImageCredentials> {
    const response = await makeRequest<TranslateImageCredentials>({
        method: 'POST',
        url: `${BASE_URL}/api/translate/ecommerce/upload/credentials`,
        headers: { ...DEFAULT_HEADERS, 'content-type': 'application/json' },
        data: { fileName: filename, fileType }
    });
    return response.data;
}

async function uploadToAliyunOSS(buffer: Buffer, filename: string, credentials: TranslateImageCredentials): Promise<string> {
    const { host, dir, accessId, policy, signature, callback, fileUrl } = credentials;
    const ossKey = `${dir}${filename}`; // Simple concatenation for key

    const form = new FormData();
    form.append("key", ossKey);
    form.append("OSSAccessKeyId", accessId);
    form.append("policy", policy);
    form.append("Signature", signature);
    form.append("success_action_status", "200");
    form.append("callback", callback);
    form.append("file", buffer, filename);

    const res = await makeRequest({
        method: 'POST',
        url: host,
        data: form,
        headers: { ...form.getHeaders() },
    });

    if (res.status === 200) {
        return fileUrl.replace("image.jpg", filename);
    } else {
        throw new Error(`OSS Upload failed with status: ${res.status}`);
    }
}

// --- Exported Scraper Functions ---

/**
 * Uploads an image buffer and returns the public URL.
 * This is a utility for `translateEcommerceImageFromUrl`.
 * @returns Promise the url
 */
export async function uploadImage(options: { buffer: Buffer, filename: string }): Promise<NBScraperResponse<{ imageUrl: string }>> {
    try {
        validateRequiredParams(options, ['buffer', 'filename']);
        const credentials = await getUploadCredentials(options.filename, 'image/jpeg'); // Assuming jpeg, can be made dynamic
        const imageUrl = await uploadToAliyunOSS(options.buffer, options.filename, credentials);
        return createSuccessResponse({ imageUrl });
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'TranslateImageUploader' } });
    }
}

/**
 * Translates text on a generic image.
 * @author FongsiDev
 */
export async function translateImage(options: TranslateImageOptions): Promise<NBScraperResponse<TranslateImageResult>> {
    try {
        validateRequiredParams(options, ['buffer', 'filename']);
        const { buffer, filename, sourceLanguage = 'auto', targetLanguage = 'en' } = options;

        const form = new FormData();
        form.append("image", buffer, filename);
        form.append("from", sourceLanguage);
        form.append("to", targetLanguage);

        const response = await makeRequest<TranslateImageResult>({
            method: 'POST',
            url: `${API_URL}/api/translate/image`,
            data: form,
            headers: { ...DEFAULT_HEADERS, ...form.getHeaders(), authority: "api.translateimage.app" }
        });
        return createSuccessResponse(response.data);
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'translateImage' } });
    }
}

/**
 * Translates text on a manga/comic image.
 * @author FongsiDev
 */
export async function translateManga(options: TranslateMangaOptions): Promise<NBScraperResponse<TranslateImageResult>> {
    try {
        validateRequiredParams(options, ['buffer', 'filename']);
        const { buffer, filename, sourceLanguage = 'auto', targetLanguage = 'ENG', detectionMode = 'default', textDirection = 'auto' } = options;

        const form = new FormData();
        form.append("image", buffer, filename);
        form.append("from", sourceLanguage);
        form.append("to", targetLanguage);
        form.append("detection_mode", detectionMode);
        form.append("text_direction", textDirection);

        const response = await makeRequest<TranslateImageResult>({
            method: 'POST',
            url: `${API_URL}/api/translate/manga`,
            data: form,
            headers: { ...DEFAULT_HEADERS, ...form.getHeaders(), authority: "api.translateimage.app" }
        });
        return createSuccessResponse(response.data);
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'translateManga' } });
    }
}

/**
 * Translates text on an e-commerce image using a public URL.
 * @author FongsiDev
 */
export async function translateEcommerceImageFromUrl(options: TranslateEcommerceOptions): Promise<NBScraperResponse<TranslateImageResult>> {
    try {
        validateRequiredParams(options, ['imageUrl']);
        const { imageUrl, sourceLanguage = 'auto', targetLanguage = 'en', commodityProtection = true, detectionMode = 'default', textDirection = 'auto' } = options;

        const payload = { imageUrl, sourceLanguage, targetLanguage, commodityProtection, detectionMode, textDirection };
        
        const response = await makeRequest<TranslateImageResult>({
            method: 'POST',
            url: `${BASE_URL}/api/translate/ecommerce`,
            data: payload,
            headers: { ...DEFAULT_HEADERS, 'content-type': 'application/json' },
        });
        return createSuccessResponse(response.data);
    } catch (error) {
        return createErrorResponse(error as Error, { type: ScraperErrorType.API_ERROR, context: { service: 'translateEcommerce' } });
    }
}