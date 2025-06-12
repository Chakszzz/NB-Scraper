[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / analyzeDream

# Function: analyzeDream()

> **analyzeDream**(`options`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DreamAnalysisData`](../interfaces/DreamAnalysisData.md)\>\>

Defined in: [scrapers/dreamanalysis.ts:67](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/scrapers/dreamanalysis.ts#L67)

Analyze dream text and get interpretation

## Parameters

### options

[`DreamAnalysisOptions`](../interfaces/DreamAnalysisOptions.md)

Configuration for dream analysis

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DreamAnalysisData`](../interfaces/DreamAnalysisData.md)\>\>

Promise<NBScraperResponse<DreamAnalysisData>>

## Example

```typescript
import { analyzeDream } from 'nb-scraper';

const result = await analyzeDream({
  text: "I dreamed I was flying over mountains",
  isPremium: true
});

if (result.status) {
  console.log(result.data.interpretation);
}
```
