[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / generateExomlResponse

# Function: generateExomlResponse()

> **generateExomlResponse**(`options`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`ExomlAPIData`](../interfaces/ExomlAPIData.md)\>\>

Defined in: [scrapers/exomlapi.ts:141](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/scrapers/exomlapi.ts#L141)

Generate AI response

## Parameters

### options

[`ExomlAPIOptions`](../interfaces/ExomlAPIOptions.md)

Configuration for the AI request

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`ExomlAPIData`](../interfaces/ExomlAPIData.md)\>\>

Promise<NBScraperResponse<ExomlAPIData>>

## Example

```typescript
import { generateExomlResponse } from 'nb-scraper';

const result = await generateExomlResponse({
  messages: [
    createExomlMessage("user", "Hello, how are you?")
  ],
  model: "gpt-4.1"
});

if (result.status) {
  console.log(result.data.content);
}
```
