[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / premiumDreamAnalysis

# Function: premiumDreamAnalysis()

> **premiumDreamAnalysis**(`text`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DreamAnalysisData`](../interfaces/DreamAnalysisData.md)\>\>

Defined in: [scrapers/dreamanalysis.ts:159](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/scrapers/dreamanalysis.ts#L159)

Premium analysis with detailed interpretation

## Parameters

### text

`string`

Dream description text

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DreamAnalysisData`](../interfaces/DreamAnalysisData.md)\>\>

Promise<NBScraperResponse<DreamAnalysisData>>

## Example

```typescript
import { premiumDreamAnalysis } from 'nb-scraper';

const result = await premiumDreamAnalysis("I dreamed I could breathe underwater");
if (result.status) {
  console.log(result.data.symbols);
}
```
