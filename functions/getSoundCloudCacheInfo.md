[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / getSoundCloudCacheInfo

# Function: getSoundCloudCacheInfo()

> **getSoundCloudCacheInfo**(): [`SoundCloudCache`](../interfaces/SoundCloudCache.md)

Defined in: [scrapers/soundcloud.ts:229](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/soundcloud.ts#L229)

Get cached client ID and version info

## Returns

[`SoundCloudCache`](../interfaces/SoundCloudCache.md)

Current cache state

## Example

```typescript
import { getSoundCloudCacheInfo } from 'nb-scraper';

const cacheInfo = getSoundCloudCacheInfo();
console.log(cacheInfo);
```
