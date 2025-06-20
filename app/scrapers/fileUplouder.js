import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import { ScraperErrorType } from "../types";
import {
  createErrorResponse,
  createSuccessResponse,
  formatBytes,
} from "../utils";
// Get MIME type based on file extension
const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    // Images
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".bmp": "image/bmp",
    ".ico": "image/x-icon",
    // Documents
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".rtf": "application/rtf",
    // Archives
    ".zip": "application/zip",
    ".rar": "application/vnd.rar",
    ".7z": "application/x-7z-compressed",
    ".tar": "application/x-tar",
    ".gz": "application/gzip",
    // Videos
    ".mp4": "video/mp4",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".wmv": "video/x-ms-wmv",
    ".flv": "video/x-flv",
    ".webm": "video/webm",
    ".mkv": "video/x-matroska",
    // Audio
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".flac": "audio/flac",
    ".aac": "audio/aac",
    ".ogg": "audio/ogg",
    ".wma": "audio/x-ms-wma",
    // Code
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".xml": "application/xml",
    ".php": "text/x-php",
    ".py": "text/x-python",
    ".java": "text/x-java-source",
    ".cpp": "text/x-c++src",
    ".c": "text/x-csrc",
    ".h": "text/x-chdr",
    ".cs": "text/x-csharp",
    ".rb": "text/x-ruby",
    ".go": "text/x-go",
    ".rs": "text/x-rust",
    ".swift": "text/x-swift",
    ".kt": "text/x-kotlin",
    ".ts": "text/typescript",
    ".jsx": "text/jsx",
    ".tsx": "text/tsx",
    ".vue": "text/x-vue",
    ".sql": "application/sql",
    ".md": "text/markdown",
    ".yml": "application/x-yaml",
    ".yaml": "application/x-yaml",
    ".toml": "application/toml",
  };
  return mimeTypes[ext] || "application/octet-stream";
};
// Check if file type is allowed (exclude plain text files)
const isAllowedFileType = (mime, filename = "") => {
  // Blocked MIME types (text files)
  const blockedMimes = ["text/plain", "text/txt"];
  // Blocked extensions
  const blockedExtensions = [".txt", ".log", ".ini", ".cfg", ".conf"];
  // Check if MIME type is blocked
  if (blockedMimes.includes(mime)) {
    return false;
  }
  // Check if file extension is blocked
  const ext = path.extname(filename).toLowerCase();
  if (blockedExtensions.includes(ext)) {
    return false;
  }
  return true;
};
/**
 * @public
 * File Upload Scraper for yupra.dpdns.org
 */
export const fileUploadScraper = {
  /**
   * Uploads a file from a Buffer.
   * @param buffer - The file content as a Buffer.
   * @param filename - Optional. The name of the file, including extension.
   * @returns A promise that resolves to an NBScraperResponse with upload details.
   * @example
   * ```typescript
   * import { fileUploadScraper } from 'nb-scraper';
   * import fs from 'fs';
   *
   * (async () => {
   * const buffer = fs.readFileSync('path/to/your/image.jpg');
   * const result = await fileUploadScraper.uploadFromBuffer(buffer, 'my-image.jpg');
   * if (result.status) {
   * console.log('Upload URL:', result.data.downloadUrl);
   * } else {
   * console.error('Upload failed:', result.error);
   * }
   * })();
   * ```
   * @author Nauval YP
   */
  uploadFromBuffer: async (buffer, filename) => {
    try {
      if (!buffer || buffer.length === 0) {
        return createErrorResponse("Buffer is empty or invalid.", {
          type: ScraperErrorType.INVALID_PARAMETER,
        });
      }
      // Deteksi tipe file dari buffer
      const type = await fileTypeFromBuffer(buffer).catch(() => null);
      let ext = type?.ext;
      let detectedMime = type?.mime;
      // Generate filename dengan timestamp jika tidak ada
      if (!filename) {
        filename = `file_${Date.now()}`;
        if (ext) filename += `.${ext}`;
      }
      // Jika tidak terdeteksi dari buffer, gunakan MIME mapping
      if (!ext && filename) {
        const fileExt = path.extname(filename).toLowerCase();
        detectedMime = getMimeType(filename);
        ext = fileExt.replace(".", "");
      }
      // Validasi tipe file yang diizinkan
      if (
        !isAllowedFileType(detectedMime || "application/octet-stream", filename)
      ) {
        return createErrorResponse(
          "File type not allowed. Plain text files cannot be uploaded.",
          {
            type: ScraperErrorType.INVALID_PARAMETER,
            context: {
              allowedTypes:
                "Images, Videos, Audio, Documents, Archives, Code files",
            },
          },
        );
      }
      const form = new FormData();
      form.append("file", buffer, { filename });
      const { data } = await axios.post(
        "https://uploader.yupra.dpdns.org/tourl",
        form,
        {
          headers: {
            ...form.getHeaders(),
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "max-age=0",
            Dnt: "1",
            Origin: "https://uploader.yupra.dpdns.org",
            Referer: "https://uploader.yupra.dpdns.org/tourl",
            "Sec-Ch-Ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
            "Sec-Ch-Ua-Mobile": "?1",
            "Sec-Ch-Ua-Platform": '"Android"',
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          transformResponse: [(res) => res], // Ensure response is treated as string
          timeout: 60000,
        },
      );
      if (!data || typeof data !== "string") {
        return createErrorResponse("Invalid response from upload server.", {
          type: ScraperErrorType.INVALID_RESPONSE,
        });
      }
      let fileUrl = null;
      // Try several patterns to get the URL
      // Pattern 1: Input field with value URL
      const inputMatch = data.match(
        /<input[^>]*value="(https?:\/\/[^\"]+)"[^>]*>/,
      );
      if (inputMatch?.[1]) {
        fileUrl = inputMatch[1];
      } else {
        // Pattern 2: Link in <a> tag
        const linkMatch = data.match(/<a[^>]*href="(https?:\/\/[^\"]+)"[^>]*>/);
        if (linkMatch?.[1]) {
          fileUrl = linkMatch[1];
        } else {
          // Pattern 3: Standalone URL
          const urlMatch = data.match(/https?:\/\/[^\s"'<>]+/);
          fileUrl = urlMatch?.[0] ?? null;
        }
      }
      if (!fileUrl) {
        return createErrorResponse(
          "Could not extract download URL from server response.",
          {
            type: ScraperErrorType.PARSE_ERROR,
          },
        );
      }
      // Validate URL from correct server
      const allowedHosts = ["yupra.dpdns.org"];
      const urlHost = new URL(fileUrl).hostname;
      if (!allowedHosts.includes(urlHost)) {
        return createErrorResponse("Invalid URL host from server.", {
          type: ScraperErrorType.API_ERROR,
          context: {
            receivedUrl: fileUrl,
            expectedHosts: allowedHosts,
            actualHost: urlHost,
          },
        });
      }
      return createSuccessResponse({
        filename: filename,
        downloadUrl: fileUrl,
        size: formatBytes(buffer.length), // Use formatBytes from utils
        mimeType: detectedMime || "application/octet-stream",
        extension: ext || "unknown",
        uploadedAt: new Date().toISOString(),
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        return createErrorResponse("Request timeout.", {
          type: ScraperErrorType.NETWORK_ERROR,
        });
      }
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        return createErrorResponse(
          "Rate limit exceeded. Please wait before trying again.",
          {
            type: ScraperErrorType.RATE_LIMITED,
          },
        );
      }
      return createErrorResponse(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload file.",
        {
          type: ScraperErrorType.UNKNOWN_ERROR,
          context: {
            errorDetails: axios.isAxiosError(error)
              ? error.response?.data
              : error,
          },
        },
      );
    }
  },
  /**
   * Uploads a file from a given URL.
   * @param fileUrl - The URL of the file to upload.
   * @param customFilename - Optional. A custom name for the uploaded file.
   * @returns A promise that resolves to an NBScraperResponse with upload details.
   * @example
   * ```typescript
   * import { fileUploadScraper } from 'nb-scraper';
   *
   * (async () => {
   * const urlResult = await fileUploadScraper.uploadFromUrl('[https://www.example.com/example.pdf](https://www.example.com/example.pdf)', 'my-document.pdf');
   * if (urlResult.status) {
   * console.log('Upload from URL successful! Data:', urlResult.data);
   * } else {
   * console.error('Upload from URL failed:', urlResult.error);
   * }
   * })();
   * ```
   */
  uploadFromUrl: async (fileUrl, customFilename = null) => {
    try {
      if (!fileUrl || !fileUrl.startsWith("http")) {
        return createErrorResponse("Invalid file URL provided.", {
          type: ScraperErrorType.INVALID_PARAMETER,
        });
      }
      // Download file from URL
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      const buffer = Buffer.from(response.data);
      // Generate filename dari URL jika tidak ada custom filename
      let filename = customFilename;
      if (!filename) {
        const urlObj = new URL(fileUrl);
        filename = path.basename(urlObj.pathname) || `downloaded_${Date.now()}`;
      }
      // Upload menggunakan fungsi uploadFromBuffer
      return await fileUploadScraper.uploadFromBuffer(buffer, filename);
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        return createErrorResponse("Timeout while downloading file from URL.", {
          type: ScraperErrorType.NETWORK_ERROR,
        });
      }
      return createErrorResponse(
        error.message || "Failed to download and upload file from URL.",
        {
          type: ScraperErrorType.UNKNOWN_ERROR,
          context: {
            url: fileUrl,
            errorDetails: axios.isAxiosError(error)
              ? error.response?.data
              : error,
          },
        },
      );
    }
  },
  /**
   * Returns a list of supported file extensions for upload.
   * @returns An array of strings representing supported file extensions (e.g., '.jpg', '.mp4').
   */
  getSupportedExtensions: () => {
    const extensions = [
      // Images
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
      ".ico",
      // Documents
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".rtf",
      // Archives
      ".zip",
      ".rar",
      ".7z",
      ".tar",
      ".gz",
      // Videos
      ".mp4",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".webm",
      ".mkv",
      // Audio
      ".mp3",
      ".wav",
      ".flac",
      ".aac",
      ".ogg",
      ".wma",
      // Code
      ".html",
      ".css",
      ".js",
      ".json",
      ".xml",
      ".php",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".h",
      ".cs",
      ".rb",
      ".go",
      ".rs",
      ".swift",
      ".kt",
      ".ts",
      ".jsx",
      ".tsx",
      ".vue",
      ".sql",
      ".md",
      ".yml",
      ".yaml",
      ".toml",
    ];
    return extensions;
  },
  /**
   * Checks if a given filename has an allowed file type for upload.
   * @param filename - The name of the file to check.
   * @returns True if the file type is allowed, false otherwise.
   */
  isValidFileType: (filename) => {
    const ext = path.extname(filename).toLowerCase();
    return fileUploadScraper.getSupportedExtensions().includes(ext);
  },
  /**
   * Gets information about a file from its Buffer.
   * @param buffer - The file content as a Buffer.
   * @param filename - Optional. The name of the file, including extension.
   * @returns A promise that resolves to an NBScraperResponse with file information.
   * @example
   * ```typescript
   * import { fileUploadScraper } from 'nb-scraper';
   * import fs from 'fs';
   *
   * (async () => {
   * const buffer = fs.readFileSync('path/to/your/document.pdf');
   * const fileInfo = await fileUploadScraper.getFileInfo(buffer, 'document.pdf');
   * if (fileInfo.status) {
   * console.log('File Info:', fileInfo.data);
   * } else {
   * console.error('Failed to get file info:', fileInfo.error);
   * }
   * })();
   * ```
   */
  getFileInfo: async (buffer, filename = null) => {
    try {
      const type = await fileTypeFromBuffer(buffer).catch(() => null);
      const size = buffer.length;
      const sizeKB = (size / 1024).toFixed(2);
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      let detectedFilename = filename || `file_${Date.now()}`;
      if (!path.extname(detectedFilename) && type?.ext) {
        detectedFilename += `.${type.ext}`;
      }
      return createSuccessResponse({
        filename: detectedFilename,
        mimeType: type?.mime || "application/octet-stream",
        extension: type?.ext || "unknown",
        size: {
          bytes: size,
          kb: sizeKB,
          mb: sizeMB,
        },
        isAllowed: isAllowedFileType(type?.mime || "", detectedFilename),
      });
    } catch (error) {
      return createErrorResponse(`Failed to get file info: ${error.message}`, {
        type: ScraperErrorType.UNKNOWN_ERROR,
        context: { filename, bufferLength: buffer.length, errorDetails: error },
      });
    }
  },
};
