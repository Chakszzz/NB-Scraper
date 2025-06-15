import { Ytdl } from '../scrapers/youtube';
import type { NBScraperResponse, YouTubeDownloadResult } from '../types';
import * as utils from '../utils';

// Mock the makeRequest utility to prevent actual HTTP calls
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  makeRequest: jest.fn(),
}));

// We will also use fake timers to control setTimeout during tests
jest.useFakeTimers();

const mockedMakeRequest = utils.makeRequest as jest.Mock;

describe('Ytdl Scraper', () => {
  const YOUTUBE_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  
  // Custom mock to simulate FormData, since it's used in the mp3 function
  // In a test environment, we don't need the real FormData implementation.
  global.FormData = jest.fn(() => ({
    append: jest.fn(),
    getHeaders: () => ({ 'content-type': 'multipart/form-data' }),
  })) as any;

  beforeEach(() => {
    // Clear mock history and reset timers before each test
    mockedMakeRequest.mockClear();
    jest.clearAllTimers();
  });

  describe('Ytdl.mp3()', () => {
    it('should successfully download an MP3 link', async () => {
      // Arrange
      const mockApiResponse = {
        link: 'https://download.mp3/test-song.mp3',
        filename: 'Test Song Title',
      };
      mockedMakeRequest.mockResolvedValue({ data: mockApiResponse });

      // Act
      const result: NBScraperResponse<YouTubeDownloadResult> = await Ytdl.mp3(YOUTUBE_URL);

      // Assert
      expect(result).toBeSuccessfulScraperResponse();
      expect(utils.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://www.youtubemp3.ltd/convert',
        }),
      );
      expect(result.data?.downloadUrl).toBe(mockApiResponse.link);
      expect(result.data?.title).toBe(mockApiResponse.filename);
      expect(result.data?.type).toBe('mp3');
    });

    it('should return an error if API call fails', async () => {
      // Arrange
      mockedMakeRequest.mockRejectedValue(new Error('Network Failure'));

      // Act
      const result = await Ytdl.mp3(YOUTUBE_URL);

      // Assert
      expect(result).toBeErrorScraperResponse();
      expect(result.error).toContain('Network Failure');
    });
  });

  describe('Ytdl.mp4()', () => {
    it('should successfully poll and get an MP4 link', async () => {
      // Arrange
      const progressUrl = 'https://p.oceansaver.in/progress/123';
      
      // 1. Initial request to start the download
      mockedMakeRequest.mockResolvedValueOnce({
        data: {
          progress_url: progressUrl,
          info: { title: 'Test Video', image: 'thumb.jpg' },
        },
      });

      // 2. First polling attempt (still processing)
      mockedMakeRequest.mockResolvedValueOnce({
        data: { progress: 50, download_url: null },
      });

      // 3. Second polling attempt (success)
      mockedMakeRequest.mockResolvedValueOnce({
        data: { progress: 100, download_url: 'https://download.mp4/final-video.mp4' },
      });
      
      // Act
      const promise = Ytdl.mp4(YOUTUBE_URL, '720');

      // Advance timers to simulate waiting for polling
      await jest.advanceTimersByTimeAsync(3000); // First poll
      await jest.advanceTimersByTimeAsync(3000); // Second poll

      const result = await promise;

      // Assert
      expect(result).toBeSuccessfulScraperResponse();
      expect(result.data?.downloadUrl).toBe('https://download.mp4/final-video.mp4');
      expect(result.data?.title).toBe('Test Video');
      expect(result.data?.type).toBe('mp4');
      expect(mockedMakeRequest).toHaveBeenCalledTimes(3); // 1 initial + 2 polls
    });

    it('should return an error if polling times out', async () => {
       // Arrange
       const progressUrl = 'https://p.oceansaver.in/progress/timeout';
       mockedMakeRequest.mockResolvedValue({ // Mock all calls to return the same response
         data: { progress_url: progressUrl, progress: 50, download_url: null },
       });
       
       // Act
       const promise = Ytdl.mp4(YOUTUBE_URL, '1080');

       // Fast-forward time past the timeout threshold (40 attempts * 3s = 120s)
       await jest.advanceTimersByTimeAsync(121000);
       
       const result = await promise;

       // Assert
       expect(result).toBeErrorScraperResponse();
       expect(result.error).toContain('Timeout: please try again');
    });

    it('should return an error for invalid quality', async () => {
      // Act
      const result = await Ytdl.mp4(YOUTUBE_URL, '144p'); // 144p is not a valid key

      // Assert
      expect(result).toBeErrorScraperResponse();
      expect(result.error).toContain('Quality not valid!');
      expect(result.error).toContain('availableQuality');
    });
  });
});