[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / quickDreamAnalysis

# Function: quickDreamAnalysis()

> **quickDreamAnalysis**(`text`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DreamAnalysisData`](../interfaces/DreamAnalysisData.md)\>\>

Defined in: [scrapers/dreamanalysis.ts:137](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/dreamanalysis.ts#L137)

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
