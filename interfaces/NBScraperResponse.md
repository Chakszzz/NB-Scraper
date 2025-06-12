[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / NBScraperResponse

# Interface: NBScraperResponse\<T\>

Defined in: [types.ts:11](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L11)

Standard response structure for all scraper functions

## Type Parameters

### T

`T` = `unknown`

The type of the data property

## Properties

### creator

> **creator**: `string`

Defined in: [types.ts:13](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L13)

The creator/author of this scraper

***

### status

> **status**: `boolean`

Defined in: [types.ts:15](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L15)

Whether the operation was successful

***

### data?

> `optional` **data**: `T`

Defined in: [types.ts:17](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L17)

The scraped data (only present when status is true)

***

### error?

> `optional` **error**: `string`

Defined in: [types.ts:19](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/types.ts#L19)

Error message (only present when status is false)
