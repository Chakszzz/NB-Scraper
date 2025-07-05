import axios from "axios";
import CryptoJS from "crypto-js";
import {
  NBScraperResponse,
  ScraperErrorType,
  WeatherMasterOptions,
  TimezoneResponse,
  WeatherData,
  WeatherAPIResponse
} from '../types';
import { createErrorResponse, createSuccessResponse } from '../utils';

/**
 * Get Weater Info
 * @example
 * ```
 * import { WeatherMaster } from 'nb-scraper';
 * // with default location (jakarta)
 * const weather = new WeatherMaster();
 * console.log(weather)
 * 
 * // or with specific coordinates
 * const customWeather = new WeatherMaster({
 * lat: "-6.200000",
 * lon: "106.816666"
 * });
 * console.log(customWeather)
 * ```
 * @author Fgsi (FongsiDev)
 */
export class WeatherMaster {
  private lat: string;
  private lon: string;
  private encryptedKeyV1: string;
  private encryptedKeyV2: string;
  private secret: string;
  private headers: Record < string, string > ;
  private keyV1: string;
  private keyV2: string;
  
  /**
   * Initializes the WeatherMaster scraper.
   * @param options - Optional latitude and longitude. Defaults to Jakarta.
   */
  constructor(options: WeatherMasterOptions = {}) {
    this.lat = options.lat || "-6.1818";
    this.lon = options.lon || "106.8223";
    
    this.encryptedKeyV1 = "U2FsdGVkX1+p9rpuXLFpvZ38oYgNYcOWp7jPyv//ABw=";
    this.encryptedKeyV2 =
      "U2FsdGVkX1+CQzjswYNymYH/fuGRQF5wttP0PVxhBLXfepyhHKbz/v4PaBwan5pt";
    this.secret =
      "U2FsdGVkX1+abcd12345=="; // This is a hardcoded secret key, because is too simplify user to use without fill in the secret
    
    this.headers = {
      "User-Agent": "Mozilla/5.0 (Linux; Android 11; 220333QAG Build/RKQ1.211001.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/137.0.7151.89 Mobile Safari/537.36",
      Referer: "file:///android_asset/index.html",
    };
    
    this.keyV1 = this.decrypt(this.encryptedKeyV1);
    this.keyV2 = this.decrypt(this.encryptedKeyV2);
  }
  
  /**
   * Decrypts an encrypted string using AES.
   * @param encrypted - The encrypted string.
   * @returns The decrypted string.
   * 
   */
  private decrypt(encrypted: string): string {
    return CryptoJS.AES.decrypt(encrypted, this.secret).toString(
      CryptoJS.enc.Utf8,
    );
  }
  
  /**
   * Fetches time zone information from TimeZoneDB.
   * @returns Promise<NBScraperResponse<TimezoneResponse>>
   */
  async getTimeZoneDB(): Promise < NBScraperResponse < TimezoneResponse >> {
    try {
      const url = "https://api.timezonedb.com/v2.1/get-time-zone";
      const res = await axios.get < TimezoneResponse > (url, { // Updated type
        params: {
          key: this.keyV1,
          format: "json",
          by: "position",
          lat: this.lat,
          lng: this.lon,
        },
        headers: this.headers,
      });
      return createSuccessResponse(res.data);
    } catch (error) {
      return createErrorResponse(error as Error, {
        context: { service: 'TimeZoneDB', lat: this.lat, lon: this.lon }
      });
    }
  }
  
  /**
   * Fetches weather forecast data from Open-Meteo.
   * @returns Promise<NBScraperResponse<WeatherData>>
   */
  async getOpenMeteoForecast(): Promise < NBScraperResponse < WeatherData >> {
    try {
      const url = "https://api.open-meteo.com/v1/forecast";
      const res = await axios.get < WeatherData > (url, { // Updated type
        params: {
          latitude: this.lat,
          longitude: this.lon,
          current: "temperature_2m,is_day,apparent_temperature,pressure_msl,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
          hourly: "wind_speed_10m,wind_direction_10m,relative_humidity_2m,pressure_msl,cloud_cover,temperature_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,uv_index",
          daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,uv_index_max,precipitation_sum,daylight_duration,precipitation_probability_max,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max",
          timezone: "Asia/Jakarta",
          forecast_days: 14,
          forecast_hours: 24,
          models: "best_match",
        },
        headers: this.headers,
      });
      return createSuccessResponse(res.data);
    } catch (error) {
      return createErrorResponse(error as Error, {
        context: { service: 'WheaterMeteo', lat: this.lat, lon: this.lon }
      });
    }
  }
  
  /**
   * Fetches weather forecast data from WeatherAPI.com.
   * @returns Promise<NBScraperResponse<WeatherAPIResponse>>
   */
  async getWeatherAPI_Forecast(): Promise < NBScraperResponse <
    WeatherAPIResponse >> {
      try {
        const url = "https://api.weatherapi.com/v1/forecast.json";
        const res = await axios.get < WeatherAPIResponse > (
          url, { // Updated type
            params: {
              key: this.keyV2,
              q: `${this.lat},${this.lon}`,
            },
            headers: this.headers,
          });
        return createSuccessResponse(res.data);
      } catch (error) {
        return createErrorResponse(error as Error, {
          context: { service: 'Wheater_forecast', lat: this.lat, lon: this.lon }
        });
      }
    }
  
  /**
   * Fetches astronomy data (sunrise, sunset, moon phase) from WeatherAPI.com.
   * @returns Promise<NBScraperResponse<WeatherAPIResponse>>
   */
  async getWeatherAPI_Astronomy(): Promise < NBScraperResponse <
    WeatherAPIResponse >> {
      try {
        const url = "https://api.weatherapi.com/v1/astronomy.json";
        const res = await axios.get < WeatherAPIResponse > (
          url, { // Updated type
            params: {
              key: this.keyV2,
              q: `${this.lat},${this.lon}`,
            },
            headers: this.headers,
          });
        return createSuccessResponse(res.data);
      } catch (error) {
        return createErrorResponse(error as Error, {
          context: {
            service: 'WeatherAPI_Astronomy',
            lat: this.lat,
            lon: this.lon
          }
        });
      }
    }
  
  /**
   * Fetches weather alerts from WeatherAPI.com.
   * @returns Promise<NBScraperResponse<WeatherAPIResponse>>
   */
  async getWeatherAPI_Alerts(): Promise < NBScraperResponse <
    WeatherAPIResponse >> {
      try {
        const url = "https://api.weatherapi.com/v1/alerts.json";
        const res = await axios.get < WeatherAPIResponse > (
          url, { // Updated type
            params: {
              key: this.keyV2,
              q: `${this.lat},${this.lon}`,
            },
            headers: this.headers,
          });
        return createSuccessResponse(res.data);
      } catch (error) {
        return createErrorResponse(error as Error, {
          context: {
            service: 'WeatherAPI_Alerts',
            lat: this.lat,
            lon: this
              .lon
          }
        });
      }
    }
  
  // Extract shared Open-Meteo call logic into a private helper
  private async fetchOpenMeteoData(
    params: Record<string, any>
  ): Promise<NBScraperResponse<WeatherData>> {
    try {
      const url = "https://api.open-meteo.com/v1/forecast";
      const res = await axios.get<WeatherData>(url, {
        params: {
          latitude: this.lat,
          longitude: this.lon,
          timezone: "Asia/Jakarta",
          ...params,
        },
        headers: this.headers,
      });
      return createSuccessResponse(res.data);
    } catch (error) {
      return createErrorResponse(error as Error, {
        context: { service: 'OpenMeteo', lat: this.lat, lon: this.lon }
      });
    }
  }
  public async getOpenMeteoHourly(): Promise<NBScraperResponse<WeatherData>> {
    return this.fetchOpenMeteoData({
      hourly: "relative_humidity_2m,pressure_msl,cloud_cover,temperature_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,uv_index",
      forecast_days: 14,
    });
  }
}