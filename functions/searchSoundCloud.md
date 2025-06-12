[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / searchSoundCloud

# Function: searchSoundCloud()

> **searchSoundCloud**(`options`): `Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`SoundCloudData`](../interfaces/SoundCloudData.md)\>\>

Defined in: [scrapers/soundcloud.ts:145](https://github.com/Chakszzz/NB-Scraper/blob/06c561b9f0d22405d402fc768994dc101fb84509/app/scrapers/soundcloud.ts#L145)

Search SoundCloud tracks

## Parameters

### options

[`SoundCloudSearchOptions`](../interfaces/SoundCloudSearchOptions.md)

Search configuration

## Returns

`Promise`\<[`NBScraperResponse`](../interfaces/NBScraperResponse.md)\<[`SoundCloudData`](../interfaces/SoundCloudData.md)\>\>

Promise<NBScraperResponse<SoundCloudData>>

## Example

```typescript
import { searchSoundCloud } from 'nb-scraper';

const result = await searchSoundCloud({
  query: "lofi chill",
  limit: 10
});

if (result.status) {
  console.log(result.data.tracks);
}
```
