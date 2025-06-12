[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / threads

# Function: threads()

> **threads**(`url`, `options`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`ThreadsMediaData`](../interfaces/ThreadsMediaData.md)\>\>

Defined in: [scrapers/threads.ts:43](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/threads.ts#L43)

Scrapes media URLs from Threads posts

## Parameters

### url

`string`

The Threads post URL to scrape

### options

[`ThreadsOptions`](../interfaces/ThreadsOptions.md) = `{}`

Optional configuration for the request

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`ThreadsMediaData`](../interfaces/ThreadsMediaData.md)\>\>

Promise resolving to media URLs from the post

## Example

```typescript
import { threads } from 'nb-scraper';

const result = await threads('https://www.threads.net/@username/post/123456789');
if (result.status) {
  console.log('Images:', result.data.image_urls);
  console.log('Videos:', result.data.video_urls);
}
```

## Throws

Will not throw errors, returns error response instead
