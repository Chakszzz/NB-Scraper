[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / generateDeepInfraResponse

# Function: generateDeepInfraResponse()

> **generateDeepInfraResponse**(`options`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DeepInfraAIData`](../interfaces/DeepInfraAIData.md)\>\>

Defined in: [scrapers/deepinfra.ts:63](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/deepinfra.ts#L63)

Generate AI response using DeepInfra

## Parameters

### options

[`DeepInfraAIOptions`](../interfaces/DeepInfraAIOptions.md)

Configuration for the AI request

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`DeepInfraAIData`](../interfaces/DeepInfraAIData.md)\>\>

Promise<NBScraperResponse<DeepInfraAIData>>

## Example

```typescript
import { generateDeepInfraResponse } from 'nb-scraper';

const result = await generateDeepInfraResponse({
  prompt: "Explain JavaScript in simple terms",
  model: "deepseek-ai/DeepSeek-R1"
});

if (result.status) {
  console.log(result.data.response);
}
```
