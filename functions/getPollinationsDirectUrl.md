[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / getPollinationsDirectUrl

# Function: getPollinationsDirectUrl()

> **getPollinationsDirectUrl**(`options`): `string`

Defined in: [scrapers/pollinations.ts:137](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/scrapers/pollinations.ts#L137)

Get direct image URL (without upload to Catbox)

## Parameters

### options

[`PollinationsOptions`](../interfaces/PollinationsOptions.md)

Configuration for image generation

## Returns

`string`

string - Direct image URL

## Example

```typescript
import { getPollinationsDirectUrl } from 'nb-scraper';

const url = getPollinationsDirectUrl({
  prompt: "a beautiful sunset over mountains",
  nologo: true
});

console.log(url); // Direct Pollinations image URL
```
