[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / generatePollinationsImage

# Function: generatePollinationsImage()

> **generatePollinationsImage**(`options`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`PollinationsData`](../interfaces/PollinationsData.md)\>\>

Defined in: [scrapers/pollinations.ts:55](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/pollinations.ts#L55)

Generate image from prompt and upload to Catbox

## Parameters

### options

[`PollinationsOptions`](../interfaces/PollinationsOptions.md)

Configuration for image generation

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`PollinationsData`](../interfaces/PollinationsData.md)\>\>

Promise<NBScraperResponse<PollinationsData>>

## Example

```typescript
import { generatePollinationsImage } from 'nb-scraper';

const result = await generatePollinationsImage({
  prompt: "a beautiful sunset over mountains",
  nologo: true
});

if (result.status) {
  console.log(result.data.url); // Catbox.moe URL
}
```
