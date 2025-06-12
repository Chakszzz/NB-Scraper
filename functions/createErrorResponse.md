[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / createErrorResponse

# Function: createErrorResponse()

> **createErrorResponse**(`error`, `context?`): [`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<`never`\>

Defined in: [utils.ts:65](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/utils.ts#L65)

Creates a standardized error response

## Parameters

### error

The error that occurred

`string` | [`ScraperError`](../interfaces/ScraperError.md) | `Error`

### context?

`Record`\<`string`, `unknown`\>

Additional context about the error

## Returns

[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<`never`\>

Standardized error response
