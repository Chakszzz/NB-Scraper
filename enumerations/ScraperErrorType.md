[**NB Scraper Documentation v1.1.0**](../README.md)

***

[NB Scraper Documentation](../globals.md) / ScraperErrorType

# Enumeration: ScraperErrorType

Defined in: [types.ts:35](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L35)

Error types that can occur during scraping

## Enumeration Members

### NETWORK\_ERROR

> **NETWORK\_ERROR**: `"NETWORK_ERROR"`

Defined in: [types.ts:37](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L37)

Network-related errors (connection, timeout, etc.)

***

### INVALID\_PARAMETER

> **INVALID\_PARAMETER**: `"INVALID_PARAMETER"`

Defined in: [types.ts:39](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L39)

Invalid or malformed input parameters

***

### INVALID\_INPUT

> **INVALID\_INPUT**: `"INVALID_INPUT"`

Defined in: [types.ts:40](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L40)

***

### INVALID\_RESPONSE

> **INVALID\_RESPONSE**: `"INVALID_RESPONSE"`

Defined in: [types.ts:42](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L42)

API returned an unexpected response format

***

### RATE\_LIMITED

> **RATE\_LIMITED**: `"RATE_LIMITED"`

Defined in: [types.ts:44](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L44)

Rate limiting or quota exceeded

***

### SERVICE\_UNAVAILABLE

> **SERVICE\_UNAVAILABLE**: `"SERVICE_UNAVAILABLE"`

Defined in: [types.ts:46](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L46)

Service is temporarily unavailable

***

### AUTH\_ERROR

> **AUTH\_ERROR**: `"AUTH_ERROR"`

Defined in: [types.ts:48](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L48)

Authentication or authorization failed

***

### PARSE\_ERROR

> **PARSE\_ERROR**: `"PARSE_ERROR"`

Defined in: [types.ts:50](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L50)

Error parsing response data

***

### IMAGE\_GENERATION\_ERROR

> **IMAGE\_GENERATION\_ERROR**: `"IMAGE_GENERATION_ERROR"`

Defined in: [types.ts:52](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L52)

Error during image generation

***

### API\_ERROR

> **API\_ERROR**: `"API_ERROR"`

Defined in: [types.ts:54](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L54)

Error calling external API

***

### UNKNOWN\_ERROR

> **UNKNOWN\_ERROR**: `"UNKNOWN_ERROR"`

Defined in: [types.ts:56](https://github.com/Chakszzz/NB-Scraper/blob/a54b0d480231641a2da59c589f08af0cd80e90f8/app/types.ts#L56)

Unknown or unexpected error
