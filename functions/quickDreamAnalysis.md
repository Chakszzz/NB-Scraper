[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / quickDreamAnalysis

# Function: quickDreamAnalysis()

> **quickDreamAnalysis**(`text`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DreamAnalysisData`](../interfaces/DreamAnalysisData.md)\>\>

Defined in: [scrapers/dreamanalysis.ts:137](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/scrapers/dreamanalysis.ts#L137)

Quick analysis with basic interpretation

## Parameters

### text

`string`

Dream description text

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DreamAnalysisData`](../interfaces/DreamAnalysisData.md)\>\>

Promise<NBScraperResponse<DreamAnalysisData>>

## Example

```typescript
import { quickDreamAnalysis } from 'nb-scraper';

const result = await quickDreamAnalysis("I dreamed of being chased");
if (result.status) {
  console.log(result.data);
}
```
