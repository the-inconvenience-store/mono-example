# Function: getGetWeatherForecastQueryOptions()

> **getGetWeatherForecastQueryOptions**\<`TData`, `TError`\>(`options?`): `UseQueryOptions`\<[`getWeatherForecastResponse`](../type-aliases/getWeatherForecastResponse.md), `TError`, `TData`, readonly `unknown`[]\> & `object`

Defined in: [packages/api-orval/gen/apis/weather/weather.ts:78](https://github.com/the-inconvenience-store/mono-example/blob/d567288f2dff3ffa4a2fdf7eb46acac0b7cd0929/packages/api-orval/gen/apis/weather/weather.ts#L78)

## Type Parameters

### TData

`TData` = [`getWeatherForecastResponse`](../type-aliases/getWeatherForecastResponse.md)

### TError

`TError` = [`ProblemDetails`](../interfaces/ProblemDetails.md)

## Parameters

### options?

#### query?

`UseQueryOptions`\<[`getWeatherForecastResponse`](../type-aliases/getWeatherForecastResponse.md), `TError`, `TData`\>

#### request?

`RequestInit`

## Returns

`UseQueryOptions`\<[`getWeatherForecastResponse`](../type-aliases/getWeatherForecastResponse.md), `TError`, `TData`, readonly `unknown`[]\> & `object`
