[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / createExomlMessage

# Function: createExomlMessage()

> **createExomlMessage**(`role`, `content`): [`ExomlAPIMessage`](../interfaces/ExomlAPIMessage.md)

Defined in: [scrapers/exomlapi.ts:112](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/scrapers/exomlapi.ts#L112)

Create a conversation message

## Parameters

### role

Message role

`"user"` | `"assistant"` | `"system"`

### content

`string`

Message content

## Returns

[`ExomlAPIMessage`](../interfaces/ExomlAPIMessage.md)

ExomlAPIMessage

## Example

```typescript
import { createExomlMessage } from 'nb-scraper';

const message = createExomlMessage("user", "Hello, how are you?");
```
