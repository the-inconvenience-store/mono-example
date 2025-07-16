using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers;

/// <summary>
/// Controller for weather forecast operations
/// </summary>
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
[Tags("Weather")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Gets a 5-day weather forecast with random temperature data
    /// </summary>
    /// <remarks>
    /// Returns an array of weather forecasts for the next 5 days starting from tomorrow.
    /// Each forecast includes date, temperature in Celsius and Fahrenheit, and a weather summary.
    /// 
    /// Sample response:
    /// ```json
    /// [
    ///   {
    ///     "date": "2024-01-16",
    ///     "temperatureC": 15,
    ///     "temperatureF": 59,
    ///     "summary": "Mild"
    ///   }
    /// ]
    /// ```
    /// </remarks>
    /// <returns>Array of weather forecasts for the next 5 days</returns>
    /// <response code="200">Returns the weather forecast data successfully</response>
    /// <response code="500">If there was an internal server error generating the forecast</response>
    [HttpGet(Name = "GetWeatherForecast")]
    [ProducesResponseType(typeof(IEnumerable<WeatherForecast>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    [EndpointSummary("Get 5-day weather forecast")]
    [EndpointDescription("Retrieves weather forecast data for the next 5 days with randomly generated temperatures and weather conditions")]
    public IEnumerable<WeatherForecast> Get()
    {
        try
        {
            _logger.LogInformation("Generating weather forecast for the next 5 days");

            var forecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            }).ToArray();

            _logger.LogInformation("Successfully generated {Count} weather forecasts", forecasts.Length);
            return forecasts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while generating weather forecast");
            throw;
        }
    }
}
