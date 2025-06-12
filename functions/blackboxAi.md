[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / blackboxAi

# Function: blackboxAi()

> **blackboxAi**(`query`, `options`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`BlackBoxAIData`](../interfaces/BlackBoxAIData.md)\>\>

Defined in: [scrapers/blackbox.ts:53](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/blackbox.ts#L53)

Scrapes BlackBox AI for responses to queries

## Parameters

### query

`string`

The query to send to BlackBox AI

### options

[`BlackBoxAIOptions`](../interfaces/BlackBoxAIOptions.md) = `{}`

Optional configuration for the request

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`BlackBoxAIData`](../interfaces/BlackBoxAIData.md)\>\>

Promise resolving to the AI response with sources

## Example

```typescript
import { blackboxAi } from 'nb-scraper';

const result = await blackboxAi('What is TypeScript?');
if (result.status) {
  console.log(result.data.response);
  console.log(result.data.source);
}
```

## Throws

Will not throw errors, returns error response instead
