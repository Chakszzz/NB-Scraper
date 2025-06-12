[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / BlackBoxAIOptions

# Interface: BlackBoxAIOptions

Defined in: [types.ts:274](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L274)

Configuration options for HTTP requests

## Extends

- [`RequestConfig`](RequestConfig.md)

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### timeout?

> `optional` **timeout**: `number`

Defined in: [types.ts:26](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L26)

#### Inherited from

[`RequestConfig`](RequestConfig.md).[`timeout`](RequestConfig.md#timeout)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [types.ts:27](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L27)

#### Inherited from

[`RequestConfig`](RequestConfig.md).[`headers`](RequestConfig.md#headers)

***

### retries?

> `optional` **retries**: `number`

Defined in: [types.ts:28](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L28)

#### Inherited from

[`RequestConfig`](RequestConfig.md).[`retries`](RequestConfig.md#retries)

***

### retryDelay?

> `optional` **retryDelay**: `number`

Defined in: [types.ts:29](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L29)

#### Inherited from

[`RequestConfig`](RequestConfig.md).[`retryDelay`](RequestConfig.md#retrydelay)

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [types.ts:276](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L276)

Maximum number of tokens in the response

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [types.ts:278](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L278)

Temperature for response generation (0-1)

***

### webSearchMode?

> `optional` **webSearchMode**: `boolean`

Defined in: [types.ts:280](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L280)

Whether to enable web search mode

***

### memoryEnabled?

> `optional` **memoryEnabled**: `boolean`

Defined in: [types.ts:282](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L282)

Whether to enable memory/context
