[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / pinterest

# Function: pinterest()

> **pinterest**(`query`, `options?`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`PinterestData`](../interfaces/PinterestData.md)\>\>

Defined in: [scrapers/pinterest.ts:36](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/pinterest.ts#L36)

Search Pinterest from the given query

## Parameters

### query

`string`

The query to search content on Pinterest

### options?

[`RequestConfig`](../interfaces/RequestConfig.md)

Optional request configuration

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`PinterestData`](../interfaces/PinterestData.md)\>\>

Promise resolving Array of image URLs

## Example

```typescript
import { Pinterest } from 'nb-scraper';

const result = await Pinterest('jagung');
if (result.status) {
  console.log(result.data.result);
}
```

## Throws

Returns error response
