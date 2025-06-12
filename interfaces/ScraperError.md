[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / ScraperError

# Interface: ScraperError

Defined in: [types.ts:62](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L62)

Detailed error information

## Properties

### type

> **type**: [`ScraperErrorType`](../enumerations/ScraperErrorType.md)

Defined in: [types.ts:64](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L64)

The type of error that occurred

***

### message

> **message**: `string`

Defined in: [types.ts:66](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L66)

Human-readable error message

***

### originalError?

> `optional` **originalError**: `Error`

Defined in: [types.ts:68](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L68)

Original error object (if available)

***

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [types.ts:70](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L70)

Additional context about the error
