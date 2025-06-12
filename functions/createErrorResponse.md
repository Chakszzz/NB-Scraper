[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / createErrorResponse

# Function: createErrorResponse()

> **createErrorResponse**(`error`, `context?`): [`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<`never`\>

Defined in: [utils.ts:65](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/utils.ts#L65)

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
