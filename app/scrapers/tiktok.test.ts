import { tiktok } from '../scrapers';
import type { NBScraperResponse, TikTokData } from '../types';
import * as utils from '../utils';

// Mock the makeRequest utility to prevent actual HTTP calls
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'), // Import and retain original functionalities
  makeRequest: jest.fn(), // Mock makeRequest specifically
}));

// Create a typed mock instance
const mockedMakeRequest = utils.makeRequest as jest.Mock;

describe('TikTok Scraper', () => {
  const TIKTOK_VIDEO_URL = 'https://www.tiktok.com/@example/video/123';
  const TIKTOK_SLIDESHOW_URL = 'https://www.tiktok.com/@example/video/456';

  // Mock HTML responses from snaptik.app
  const MOCK_TOKEN_PAGE_HTML = `
    <html>
      <body>
        <input name="token" value="mock-token-12345" type="hidden">
      </body>
    </html>
  `;

  const MOCK_VIDEO_RESPONSE_HTML = `
    <html>
      <body>
        <div class="video-title">Test TikTok Video</div>
        <div class="info"><span>@testauthor</span></div>
        <img id="thumbnail" src="https://example.com/thumb.jpg" />
        <a class="download-link-fb" href="https://video.example.com/download-sd">Download SD</a>
        <button data-tokenhd="https://video.example.com/download-hd">Download HD</button>
      </body>
    </html>
  `;
  
  const MOCK_SLIDESHOW_RESPONSE_HTML = `
    <html>
      <body>
        <div class="video-title">Test TikTok Slideshow</div>
        <div class="info"><span>@testauthor</span></div>
        <div class="column">
          <div class="photo">
            <img src="https://photo.example.com/1.jpg" />
            <div class="dl-footer"><a href="https://photo.example.com/download/1">Download</a></div>
          </div>
          <div class="photo">
            <img src="https://photo.example.com/2.jpg" />
            <div class="dl-footer"><a href="https://photo.example.com/download/2">Download</a></div>
          </div>
        </div>
      </body>
    </html>
  `;

  beforeEach(() => {
    // Clear mock history before each test
    mockedMakeRequest.mockClear();
  });

  it('should successfully scrape a video TikTok URL', async () => {
    // Arrange: Mock the sequence of network requests
    mockedMakeRequest
      .mockResolvedValueOnce({ data: MOCK_TOKEN_PAGE_HTML }) // First call for getToken
      .mockResolvedValueOnce({ data: MOCK_VIDEO_RESPONSE_HTML }); // Second call for main data

    // Act
    const result: NBScraperResponse<TikTokData> = await tiktok(TIKTOK_VIDEO_URL);

    // Assert
    expect(result).toBeSuccessfulScraperResponse();
    expect(result.data?.contentType).toBe('video');
    expect(result.data?.title).toBe('Test TikTok Video');
    expect(result.data?.author).toBe('@testauthor');
    expect(result.data?.downloadLinks).toHaveLength(2);
    expect(result.data?.photos).toHaveLength(0);
  });

  it('should successfully scrape a slideshow TikTok URL', async () => {
    // Arrange
    mockedMakeRequest
      .mockResolvedValueOnce({ data: MOCK_TOKEN_PAGE_HTML })
      .mockResolvedValueOnce({ data: MOCK_SLIDESHOW_RESPONSE_HTML });

    // Act
    const result: NBScraperResponse<TikTokData> = await tiktok(TIKTOK_SLIDESHOW_URL);

    // Assert
    expect(result).toBeSuccessfulScraperResponse();
    expect(result.data?.contentType).toBe('slideshow');
    expect(result.data?.photos).toHaveLength(2);
    expect(result.data?.downloadLinks).toHaveLength(0);
    expect(result.data?.photos[0].downloadUrl).toBe('https://photo.example.com/download/1');
  });

  it('should return an error for an invalid URL', async () => {
    // Act
    const result = await tiktok('https://not-a-valid-url.com');
    
    // Assert
    expect(result).toBeErrorScraperResponse();
    expect(result.error).toContain('INVALID_INPUT');
  });
  
  it('should return an error if token cannot be found', async () => {
    // Arrange: Mock a response without a token
    mockedMakeRequest.mockResolvedValueOnce({ data: '<html><body></body></html>' });

    // Act
    const result = await tiktok(TIKTOK_VIDEO_URL);

    // Assert
    expect(result).toBeErrorScraperResponse();
    expect(result.error).toContain('Token not found');
  });

  it('should return an error if video info cannot be parsed', async () => {
    // Arrange: Mock a response with a valid token but invalid final data
    mockedMakeRequest
      .mockResolvedValueOnce({ data: MOCK_TOKEN_PAGE_HTML })
      .mockResolvedValueOnce({ data: '<html><body><p>No results</p></body></html>' });

    // Act
    const result = await tiktok(TIKTOK_VIDEO_URL);

    // Assert
    expect(result).toBeErrorScraperResponse();
    expect(result.error).toContain('Failed to extract video information');
  });
});