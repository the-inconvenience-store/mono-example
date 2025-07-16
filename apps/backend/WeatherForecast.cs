using System.ComponentModel.DataAnnotations;

namespace backend;

/// <summary>
/// Represents a weather forecast for a specific date
/// </summary>
public class WeatherForecast
{
    /// <summary>
    /// The date for this weather forecast
    /// </summary>
    /// <example>2024-01-16</example>
    [Required]
    public DateOnly Date { get; set; }

    /// <summary>
    /// Temperature in Celsius
    /// </summary>
    /// <example>15</example>
    /// <remarks>Temperature range: -20°C to 55°C</remarks>
    [Required]
    [Range(-20, 55)]
    public int TemperatureC { get; set; }

    /// <summary>
    /// Temperature in Fahrenheit (automatically calculated from Celsius)
    /// </summary>
    /// <example>59</example>
    /// <remarks>Calculated automatically from TemperatureC</remarks>
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

    /// <summary>
    /// Brief description of the weather conditions
    /// </summary>
    /// <example>Mild</example>
    /// <remarks>Possible values: Freezing, Bracing, Chilly, Cool, Mild, Warm, Balmy, Hot, Sweltering, Scorching</remarks>
    public string? Summary { get; set; }
}
