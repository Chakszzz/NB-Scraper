import { facebookDownloader } from '../scrapers';
import type { FacebookDownload, NBScraperResponse } from '../types';
import * as utils from '../utils';

// Mock the makeRequest utility
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  makeRequest: jest.fn(),
}));

const mockedMakeRequest = utils.makeRequest as jest.Mock;

describe('Facebook Downloader', () => {
  const FACEBOOK_URL = 'https://www.facebook.com/watch/?v=12345';

  // This is a simplified, fake representation of the obfuscated response.
  // The real one is more complex, but the principle is to have a decodable string.
  const MOCK_API_RESPONSE = `68747470733a2f2f6578616d706c652e636f6d2f766964656f2d68642e6d7034`; // "https://example.com/video-hd.mp4" in hex

  const MOCK_DECODED_HTML = `
    <html>
      <body>
        <div class="download-section">
          <table>
            <tbody>
              <tr>
                <td>HD</td>
                <td><a href="${Buffer.from(MOCK_API_RESPONSE, 'hex').toString()}">Download</a></td>
              </tr>
              <tr>
                <td>SD</td>
                <td><a href="https://example.com/video-sd.mp4">Download</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
  
  // A simplified mock of the action.php response structure
  const MOCK_ACTION_RESPONSE = {
      data: `({"status":"success","data":"${btoa(MOCK_DECODED_HTML)}"})`
  };


  beforeEach(() => {
    mockedMakeRequest.mockClear();
  });

  it('should successfully scrape a Facebook video URL', async () => {
    // Arrange
    mockedMakeRequest.mockResolvedValue(MOCK_ACTION_RESPONSE);

    // Act
    const result: NBScraperResponse<FacebookDownload[]> = await facebookDownloader(FACEBOOK_URL);

    // Assert
    expect(result).toBeSuccessfulScraperResponse();
    expect(utils.makeRequest).toHaveBeenCalled();
    expect(result.data).toHaveLength(2);
    expect(result.data?.[0].quality).toBe('HD');
    expect(result.data?.[0].url).toBe('https://example.com/video-hd.mp4');
    expect(result.data?.[1].quality).toBe('SD');
  });

  it('should return an error if API request fails', async () => {
    // Arrange
    mockedMakeRequest.mockRejectedValue(new Error('Network Error'));

    // Act
    const result = await facebookDownloader(FACEBOOK_URL);

    // Assert
    expect(result).toBeErrorScraperResponse();
    expect(result.error).toContain('Network Error');
  });

  it('should return an error if no download links are found', async () => {
    // Arrange
    const emptyResponse = { data: `({"status":"success","data":"${btoa('<html></html>')}"})` };
    mockedMakeRequest.mockResolvedValue(emptyResponse);
    
    // Act
    const result = await facebookDownloader(FACEBOOK_URL);

    // Assert
    expect(result).toBeErrorScraperResponse();
    expect(result.error).toContain('No download links found');
  });
});