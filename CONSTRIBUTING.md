# 🤝 Contributing

We welcome contributions to NB Scraper! Here's how you can help:

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-scraper`
3. **Add your scraper** following the established patterns in `app/scrapers/`
4. **Add comprehensive tests** in `tests/` (opsional)
5. **Update documentation** and README
6. **Submit a pull request**

## Adding a New Scraper

1. Create a new file in `app/scrapers/your-scraper.ts`
2. Follow the existing patterns for type safety and error handling
3. Add comprehensive TSDoc documentation
4. Export your scraper from `app/scrapers/index.ts`
5. `opsional` Add tests in `tests/your-scraper.test.ts`

Example scraper structure:

```typescript
export async function yourScraper(
  input: string,
  options: YourScraperOptions = {},
): Promise<NBScraperResponse<YourScraperData>> {
  try {
    validateRequiredParams({ input }, ["input"]);

    // Your scraping logic here
    const result = await makeRequest(config, options);

    return createSuccessResponse(processedData);
  } catch (error) {
    return createErrorResponse(error as Error, { input });
  }
}
```

## Project Structure

```
nb-scraper/
├── app/
│   ├── scrapers/         <!-- Lokasi utama scraper -->
│   │   ├── blackboxAi.ts
│   │   ├── threads.ts
│   │   ├── your-scraper.ts
│   │   └── index.ts      <!-- File global ekspor -->
├── tests/
├── ...
```

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm/yarn/pnpm

### Setup

```bash
git clone https://github.com/chakszzz/nb-scraper.git
cd nb-scraper
npm install
```

### Build Commands

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

## Code Style

- Follow TypeScript best practices
- Use descriptive variable names
- Include comprehensive JSDoc comments
- Keep functions focused and modular

## Pull Request Guidelines

- Reference related issues
- Include tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

## Reporting Issues

Please use the GitHub issue tracker to report bugs or suggest features.
