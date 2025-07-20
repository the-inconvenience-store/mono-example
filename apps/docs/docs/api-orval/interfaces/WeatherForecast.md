# Interface: WeatherForecast

Defined in: [packages/api-orval/gen/models/weatherForecast.ts:12](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/models/weatherForecast.ts#L12)

Represents a weather forecast for a specific date

## Properties

### date

> **date**: `string`

Defined in: [packages/api-orval/gen/models/weatherForecast.ts:14](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/models/weatherForecast.ts#L14)

The date for this weather forecast

***

### summary?

> `optional` **summary**: `string`

Defined in: [packages/api-orval/gen/models/weatherForecast.ts:27](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/models/weatherForecast.ts#L27)

Brief description of the weather conditions

#### Nullable

***

### temperatureC

> **temperatureC**: `number`

Defined in: [packages/api-orval/gen/models/weatherForecast.ts:20](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/models/weatherForecast.ts#L20)

Temperature in Celsius

#### Minimum

-20

#### Maximum

55

***

### temperatureF?

> `readonly` `optional` **temperatureF**: `number`

Defined in: [packages/api-orval/gen/models/weatherForecast.ts:22](https://github.com/the-inconvenience-store/mono-example/blob/a3e1f4667d455f254c4a536af743fc2dff215781/packages/api-orval/gen/models/weatherForecast.ts#L22)

Temperature in Fahrenheit (automatically calculated from Celsius)
