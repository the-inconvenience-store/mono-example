/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Mono API
 * API for managing blog posts with MDX content parsing & retrieving the weather forecast
 * OpenAPI spec version: 1.0.0
 */

/**
 * Represents a weather forecast for a specific date
 */
export interface WeatherForecast {
  /** The date for this weather forecast */
  date: string
  /**
   * Temperature in Celsius
   * @minimum -20
   * @maximum 55
   */
  temperatureC: number
  /** Temperature in Fahrenheit (automatically calculated from Celsius) */
  readonly temperatureF?: number
  /**
   * Brief description of the weather conditions
   * @nullable
   */
  summary?: string | null
}
