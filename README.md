**NB Scraper Documentation v1.1.0**

***

# NB Scraper

[![npm version](https://badge.fury.io/js/nb-scraper.svg)](https://badge.fury.io/js/nb-scraper)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f7c79559f8d44dd49ee3fc69bc77aef3)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Build Status](https://github.com/chakszzz/nb-scraper/workflows/CI/badge.svg)](https://github.com/chakszzz/nb-scraper/actions)

A comprehensive TypeScript scraper library by **NB Team** that provides easy-to-use functions for scraping various online services and APIs. Built with type safety, robust error handling, and maintainability in mind.

## 🚀 Features

- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Dual Module Support**: Works with both ESM (`import`) and CommonJS (`require`)
- **Robust Error Handling**: Never throws errors - always returns structured responses
- **Well Documented**: Complete TSDoc documentation for all functions
- **Extensible**: Easy to add new scrapers following established patterns
- **Production Ready**: Includes retry logic, timeout handling, and input validation

## 📦 Installation

```bash
npm install nb-scraper
```

```bash
yarn add nb-scraper
```

```bash
pnpm add nb-scraper
```

## 🛠️ Usage

### ESM (Modern JavaScript/TypeScript)

```typescript
import { blackboxAi, threads } from 'nb-scraper';

// Scrape BlackBox AI
const aiResult = await blackboxAi('What is TypeScript?');
if (aiResult.status) {
  console.log('AI Response:', aiResult.data.response);
  console.log('Sources:', aiResult.data.source);
} else {
  console.error('Error:', aiResult.error);
}

// Scrape Threads media
const mediaResult = await threads('https://www.threads.net/@username/post/123456789');
if (mediaResult.status) {
  console.log('Images:', mediaResult.data.image_urls);
  console.log('Videos:', mediaResult.data.video_urls);
} else {
  console.error('Error:', mediaResult.error);
}
```

### CommonJS (Node.js)

```javascript
const { blackboxAi, threads } = require('nb-scraper');

// Same usage as above
(async () => {
  const result = await blackboxAi('Hello World');
  console.log(result);
})();
```

## 📚 Available Scrapers

### BlackBox AI (`blackboxAi`)

Scrape AI responses from BlackBox AI with optional web search integration.

```typescript
import { blackboxAi } from 'nb-scraper';

const result = await blackboxAi('Explain quantum computing', {
  maxTokens: 1024,
  webSearchMode: true,
  memoryEnabled: false,
  timeout: 30000
});
```

**Parameters:**
- `query` (string): The question or prompt to send to BlackBox AI
- `options` (optional): Configuration options

**Options:**
- `maxTokens`: Maximum tokens in response (default: 1024)
- `webSearchMode`: Enable web search integration (default: false)
- `memoryEnabled`: Enable conversation memory (default: false)
- `timeout`: Request timeout in milliseconds (default: 30000)

### Threads Media (`threads`)

Extract image and video URLs from Threads posts.

```typescript
import { threads } from 'nb-scraper';

const result = await threads('https://www.threads.net/@user/post/123456789', {
  imagesOnly: false,
  videosOnly: false,
  timeout: 15000
});
```

**Parameters:**
- `url` (string): The Threads post URL
- `options` (optional): Configuration options

**Options:**
- `imagesOnly`: Return only images (default: false)
- `videosOnly`: Return only videos (default: false)
- `timeout`: Request timeout in milliseconds (default: 30000)

## 🔧 Response Format

All scrapers return a standardized response format:

```typescript
interface NBScraperResponse<T> {
  creator: string;        // Always "NB Team"
  status: boolean;        // true for success, false for error
  data?: T;              // Response data (only when status is true)
  error?: string;        // Error message (only when status is false)
}
```

### Success Response Example

```typescript
{
  creator: "NB Team",
  status: true,
  data: {
    response: "TypeScript is a programming language...",
    source: [
      {
        link: "https://example.com",
        title: "TypeScript Documentation",
        snippet: "TypeScript is...",
        position: 1
      }
    ]
  }
}
```

### Error Response Example

```typescript
{
  creator: "NB Team",
  status: false,
  error: "[NETWORK_ERROR] Request timeout after 30000ms"
}
```

## 🏗️ Development

### Setup

```bash
git clone https://github.com/chakszzz/nb-scraper.git
cd nb-scraper
npm install
```

### Build

```bash
npm run build          # Build all formats
npm run build:cjs      # Build CommonJS
npm run build:esm      # Build ES Modules
npm run build:types    # Build type definitions
```

### Testing

```bash
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
```

### Linting

```bash
npm run lint           # Check for linting errors
npm run lint:fix       # Fix linting errors
```

### Documentation

```bash
npm run docs           # Generate documentation
npm run docs:serve     # Serve documentation locally
```

## 📖 API Documentation

Complete API documentation is available at: [https://chakszzz.github.io/nb-scraper](https://chakszzz.github.io/nb-scraper)

## 🛡️ Error Handling

NB Scraper is designed to never throw errors. Instead, all functions return a response object with a `status` field:

```typescript
const result = await blackboxAi('test query');

if (result.status) {
  // Success - use result.data
  console.log(result.data.response);
} else {
  // Error - check result.error
  console.error(result.error);
}
```

Common error types:
- `NETWORK_ERROR`: Connection, timeout, or server issues
- `INVALID_INPUT`: Invalid parameters or URL format
- `INVALID_RESPONSE`: Unexpected response format from API
- `RATE_LIMITED`: Rate limiting or quota exceeded
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-scraper`
3. **Add your scraper** following the established patterns in `src/scrapers/`
4. **Add comprehensive tests** in `tests/`
5. **Update documentation** and README
6. **Submit a pull request**

### Adding a New Scraper

1. Create a new file in `src/scrapers/your-scraper.ts`
2. Follow the existing patterns for type safety and error handling
3. Add comprehensive TSDoc documentation
4. Export your scraper from `src/scrapers/index.ts`
5. Add tests in `tests/your-scraper.test.ts`

Example scraper structure:

```typescript
export async function yourScraper(
  input: string,
  options: YourScraperOptions = {}
): Promise<NBScraperResponse<YourScraperData>> {
  try {
    validateRequiredParams({ input }, ['input']);
    
    // Your scraping logic here
    const result = await makeRequest(config, options);
    
    return createSuccessResponse(processedData);
  } catch (error) {
    return createErrorResponse(error as Error, { input });
  }
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](_media/LICENSE) file for details.

## 👥 Team

**NB Team** - A community-driven development team focused on creating useful tools and libraries.

## 🔗 Links

- [GitHub Repository](https://github.com/chakszzz/nb-scraper)
- [npm Package](https://www.npmjs.com/package/nb-scraper)
- [Documentation](https://chakszzz.github.io/nb-scraper)
- [Issues](https://github.com/chakszzz/nb-scraper/issues)

## 📊 Stats

![npm](https://img.shields.io/npm/dw/nb-scraper)
![GitHub stars](https://img.shields.io/github/stars/chakszzz/nb-scraper)
![GitHub issues](https://img.shields.io/github/issues/chakszzz/nb-scraper)
![GitHub pull requests](https://img.shields.io/github/issues-pr/chakszzz/nb-scraper)

---

Made with ❤️ by **NB Team**
