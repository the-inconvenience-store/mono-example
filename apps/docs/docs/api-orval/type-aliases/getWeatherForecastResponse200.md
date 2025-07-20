# Type Alias: getWeatherForecastResponse200

> **getWeatherForecastResponse200** = `object`

Defined in: [packages/api-orval/gen/apis/weather/weather.ts:43](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/apis/weather/weather.ts#L43)

Returns an array of weather forecasts for the next 5 days starting from tomorrow.
Each forecast includes date, temperature in Celsius and Fahrenheit, and a weather summary.

Sample response:
```json
[
 {
   "date": "2024-01-16",
   "temperatureC": 15,
   "temperatureF": 59,
   "summary": "Mild"
 }
]
```

## Properties

### data

> **data**: [`WeatherForecast`](../interfaces/WeatherForecast.md)[]

Defined in: [packages/api-orval/gen/apis/weather/weather.ts:44](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/apis/weather/weather.ts#L44)

***

### status

> **status**: `200`

Defined in: [packages/api-orval/gen/apis/weather/weather.ts:45](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/apis/weather/weather.ts#L45)
