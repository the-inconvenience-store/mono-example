# Full-Stack TypeScript Tutorial: From .NET API to React & React Native

> **A complete guide for .NET developers learning React, Next.js, and React Native in a monorepo architecture**

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Monorepo Structure](#2-monorepo-structure)
3. [The .NET Backend Foundation](#3-the-net-backend-foundation)
4. [OpenAPI Client Generation](#4-openapi-client-generation)
5. [React Fundamentals](#5-react-fundamentals)
6. [Next.js Application Structure](#6-nextjs-application-structure)
7. [Environment Variables with T3](#7-environment-variables-with-t3)
8. [TailwindCSS & UI Components](#8-tailwindcss--ui-components)
9. [Implementing WeatherForecast in Next.js](#9-implementing-weatherforecast-in-nextjs)
10. [React Native Implementation](#10-react-native-implementation)
11. [Advanced Patterns & Best Practices](#11-advanced-patterns--best-practices)

---

## 1. Overview & Architecture

### 🎯 **Presentation Points:**

- Compare to .NET solution structure
- Explain shared API client approach
- Benefits of type-safe communication
- Development workflow overview

### **What We're Building**

This monorepo demonstrates how to share TypeScript types and API clients between web and mobile applications, consuming a .NET API. Think of it like having a shared class library in .NET, but for frontend applications.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   .NET API      │    │    Next.js      │    │  React Native   │
│   (Backend)     │    │     (Web)       │    │    (Mobile)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Shared API     │
                    │   Client        │
                    │  (Package)      │
                    └─────────────────┘
```

### **Key Benefits:**

- **Type Safety**: Same TypeScript interfaces across all apps
- **Code Reuse**: Shared API client logic
- **Single Source of Truth**: API changes propagate automatically
- **Consistent Data Models**: No manual interface synchronization

---

## 2. Monorepo Structure

### 🎯 **Presentation Points:**

- Compare to .NET solution with multiple projects
- Explain workspace concept (like project references)
- Package management with pnpm
- Workspace dependencies

### **Understanding the Structure**

Our monorepo is organized like a .NET solution with multiple projects:

```
mono-example/
├── package.json                 # Root workspace (like .sln file)
├── pnpm-workspace.yaml         # Workspace configuration
├── apps/                       # Applications (like executable projects)
│   ├── backend/               # .NET API
│   ├── web/                   # Next.js application
│   └── mobile/                # React Native app
└── packages/                   # Shared libraries (like class libraries)
    └── api-client/            # Generated TypeScript client
```

### **Workspace Configuration**

**`pnpm-workspace.yaml`** - Defines which folders contain packages:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Root `package.json`** - Manages scripts for the entire workspace:

```json
{
  "name": "mono-example",
  "private": true,
  "scripts": {
    "dev": "pnpm run --parallel dev",
    "build": "pnpm run --recursive build"
  }
}
```

---

## 3. The .NET Backend Foundation

### 🎯 **Presentation Points:**

- Familiar .NET API structure
- OpenAPI/Swagger integration
- Controller patterns you already know
- How OpenAPI enables client generation

### **WeatherForecast API** (Already Implemented)

Our backend already has a working WeatherForecast API. Let's examine the structure:

**`WeatherForecast.cs`** - The data model:

```csharp
namespace backend;

public class WeatherForecast
{
    public DateOnly Date { get; set; }
    public int TemperatureC { get; set; }
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    public string? Summary { get; set; }
}
```

**`WeatherForecastController.cs`** - The API endpoint:

```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild",
        "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }).ToArray();
    }
}
```

### **OpenAPI Integration** (Already Configured)

The backend uses OpenAPI to automatically generate API documentation:

**`Program.cs`** - OpenAPI setup:

```csharp
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info = new()
        {
            Title = "Blog API",
            Version = "v1",
            Description = "API for managing blog posts with MDX content parsing"
        };
        return Task.CompletedTask;
    });
});

// In the pipeline:
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}
```

---

## 4. OpenAPI Client Generation

### 🎯 **Presentation Points:**

- Like adding service reference in .NET
- Automatic type generation from API
- Benefits of generated clients
- How updates propagate

### **How It Works**

The OpenAPI generator creates TypeScript clients from your .NET API, similar to how you'd generate a service reference in .NET:

1. **API runs** and exposes OpenAPI schema at `/openapi/v1.json`
2. **Generator reads** the schema and creates TypeScript interfaces
3. **Clients use** the generated code with full type safety

### **Package Structure**

**`packages/api-client/package.json`**:

```json
{
  "name": "api-client",
  "main": "src/api/index.ts",
  "scripts": {
    "openapi:generate": "openapi-generator-cli generate -i http://localhost:5074/openapi/v1.json --generator-name typescript-fetch -o src/api"
  }
}
```

### **Generated Code Examples**

**WeatherForecast Interface** (Generated):

```typescript
export interface WeatherForecast {
  date?: Date;
  temperatureC?: number;
  temperatureF?: number;
  summary?: string | null;
}
```

**WeatherForecast API Client** (Generated):

```typescript
export class WeatherForecastApi extends runtime.BaseAPI {
  async getWeatherForecastRaw(): Promise<
    runtime.ApiResponse<Array<WeatherForecast>>
  > {
    // Generated implementation
  }

  async getWeatherForecast(): Promise<Array<WeatherForecast>> {
    const response = await this.getWeatherForecastRaw();
    return await response.value();
  }
}
```

### **Regenerating After API Changes**

```bash
# Run from packages/api-client
pnpm run openapi:generate
```

---

## 5. React Fundamentals

### 🎯 **Presentation Points:**

- Components are like Blazor components
- Props are like parameters
- State management with hooks
- Effect hooks for lifecycle events

### **Understanding React Components**

React components are similar to Blazor components - they encapsulate UI and logic:

**Function Component** (Modern React):

```tsx
// Like a method that returns HTML
function WeatherCard({ forecast }: { forecast: WeatherForecast }) {
  return (
    <div className="weather-card">
      <h3>{forecast.summary}</h3>
      <p>{forecast.temperatureC}°C</p>
    </div>
  );
}
```

### **React Hooks (State Management)**

Hooks are React's way of managing state and lifecycle, similar to properties and events in .NET:

**useState Hook** - Like a property with getter/setter:

```tsx
function WeatherDashboard() {
  // Like: public List<WeatherForecast> Forecasts { get; set; } = new();
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component logic here
}
```

**useEffect Hook** - Like lifecycle events:

```tsx
function WeatherDashboard() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);

  // Like OnInitializedAsync in Blazor
  useEffect(() => {
    loadWeatherData();
  }, []); // Empty array = run once on mount

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const data = await weatherApi.getWeatherForecast();
      setForecasts(data);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };
}
```

### **Component Props (Parameters)**

Props are like method parameters, but for components:

```tsx
// Interface definition (like method signature)
interface WeatherCardProps {
  forecast: WeatherForecast;
  onSelect?: (forecast: WeatherForecast) => void;
}

// Component usage
function WeatherCard({ forecast, onSelect }: WeatherCardProps) {
  return (
    <div className="weather-card" onClick={() => onSelect?.(forecast)}>
      <h3>{forecast.summary}</h3>
      <p>
        {forecast.temperatureC}°C / {forecast.temperatureF}°F
      </p>
      <small>{forecast.date?.toLocaleDateString()}</small>
    </div>
  );
}
```

---

## 6. Next.js Application Structure

### 🎯 **Presentation Points:**

- App Router vs Pages Router
- File-based routing (like MVC routing)
- Server vs Client components
- Static vs Dynamic pages

### **Next.js App Router Structure**

Next.js uses file-based routing, similar to how MVC maps URLs to controllers:

```
src/app/
├── layout.tsx              # Like _Layout.cshtml
├── page.tsx               # Home page (/)
├── blog/
│   ├── page.tsx          # Blog list (/blog)
│   └── [slug]/
│       └── page.tsx      # Individual post (/blog/my-post)
└── weather/
    └── page.tsx          # Weather page (/weather)
```

### **Server vs Client Components**

**Server Components** (Default) - Rendered on server:

```tsx
// Runs on server, like Razor Pages
export default async function WeatherPage() {
  // This runs on the server
  const forecasts = await weatherApi.getWeatherForecast();

  return (
    <div>
      <h1>Weather Forecast</h1>
      {forecasts.map((forecast) => (
        <WeatherCard key={forecast.date} forecast={forecast} />
      ))}
    </div>
  );
}
```

**Client Components** - Interactive on client:

```tsx
"use client"; // Mark as client component

import { useState, useEffect } from "react";

export function WeatherDashboard() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);

  // This runs in the browser
  useEffect(() => {
    loadForecasts();
  }, []);

  // Component can handle user interactions
  return (
    <div>
      <button onClick={loadForecasts}>Refresh</button>
      {/* Weather cards */}
    </div>
  );
}
```

### **Static vs Dynamic Pages**

**Static Generation** - Like static site generation:

```tsx
// Generates all possible pages at build time
export async function generateStaticParams() {
  const forecasts = await weatherApi.getWeatherForecast();

  // Generate static pages for each forecast
  return forecasts.map((forecast) => ({
    id: forecast.date?.toString(),
  }));
}

export default async function ForecastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Page content
}
```

---

## 7. Environment Variables with T3

### 🎯 **Presentation Points:**

- Type-safe environment variables
- Client vs Server variables
- Build-time validation
- Similar to appsettings.json validation

### **T3 Environment Setup**

T3 provides type-safe environment variables, similar to strongly-typed configuration in .NET:

**`src/config/env/server.ts`** - Server-side variables:

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    API_SECRET_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
```

**`src/config/env/client.ts`** - Client-side variables:

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
```

**`.env.local`** - Local development variables:

```bash
# Server-side (like appsettings.Development.json)
DATABASE_URL="postgresql://localhost:5432/myapp"
API_SECRET_KEY="development-secret"

# Client-side (exposed to browser)
NEXT_PUBLIC_API_URL="http://localhost:5074/api"
NEXT_PUBLIC_APP_NAME="Weather App"
```

---

## 8. TailwindCSS & UI Components

### 🎯 **Presentation Points:**

- Utility-first CSS approach
- Like Bootstrap but more granular
- Component composition patterns
- Shadcn/ui component library

### **TailwindCSS Fundamentals**

Tailwind provides utility classes for styling, similar to Bootstrap but more granular:

```tsx
// Traditional CSS approach
<div className="weather-card">
    <h3 className="title">Sunny</h3>
    <p className="temperature">25°C</p>
</div>

// Tailwind approach
<div className="bg-white rounded-lg shadow-md p-6 m-4">
    <h3 className="text-lg font-semibold text-gray-800">Sunny</h3>
    <p className="text-2xl font-bold text-blue-600">25°C</p>
</div>
```

### **Installing Shadcn/ui Components**

Shadcn/ui provides pre-built, customizable components:

```bash
# Install shadcn/ui
npx shadcn@latest init

# Add specific components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
```

**Using Shadcn Components**:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherForecast } from "@/lib/api-client";

interface WeatherCardProps {
  forecast: WeatherForecast;
}

export function WeatherCard({ forecast }: WeatherCardProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getTemperatureColor = (temp?: number) => {
    if (!temp) return "text-gray-500";
    if (temp < 0) return "text-blue-600";
    if (temp < 15) return "text-blue-400";
    if (temp < 25) return "text-green-500";
    return "text-red-500";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {formatDate(forecast.date)}
          </CardTitle>
          <Badge variant="outline">{forecast.summary || "Unknown"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span
            className={`text-2xl font-bold ${getTemperatureColor(forecast.temperatureC)}`}
          >
            {forecast.temperatureC}°C
          </span>
          <span className="text-sm text-gray-500">
            {forecast.temperatureF}°F
          </span>
          <Button variant="weather">View More</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **Customizing Components**

Shadcn components are copied to your project, so you can modify them:

```typescript
// components/ui/button.tsx (generated by shadcn)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Add your custom variant
        weather: "bg-blue-500 text-white hover:bg-blue-500/90",
      },
    },
  }
);
```

---

## 9. Implementing WeatherForecast in Next.js

### 🎯 **Presentation Points:**

- Setting up API client
- Creating reusable components
- Implementing server and client patterns
- Error handling and loading states

### **Step 1: Configure API Client**

**`src/lib/api-client.ts`** - Centralized API configuration:

```typescript
import { WeatherForecastApi, Configuration } from "api-client";

const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5074",
  headers: {
    "Content-Type": "application/json",
  },
});

export const weatherApi = new WeatherForecastApi(apiConfig);

// Re-export types for convenience
export type { WeatherForecast } from "api-client";
```

### **Step 2: Create Weather Components**

**`src/components/weather/WeatherGrid.tsx`** - Grid of weather cards:

```tsx
import { WeatherForecast } from "@/lib/api-client";
import { WeatherCard } from "./WeatherCard";

interface WeatherGridProps {
  forecasts: WeatherForecast[];
}

export function WeatherGrid({ forecasts }: WeatherGridProps) {
  if (forecasts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No weather data available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {forecasts.map((forecast, index) => (
        <WeatherCard
          key={forecast.date?.toString() || index}
          forecast={forecast}
        />
      ))}
    </div>
  );
}
```

### **Step 3: Server Component Implementation**

**`src/app/weather/page.tsx`** - Server-rendered weather page:

```tsx
import { weatherApi } from "@/lib/api-client";
import { WeatherGrid } from "@/components/weather/WeatherGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Weather Forecast",
  description: "Current weather forecast data",
};

export default async function WeatherPage() {
  try {
    // This runs on the server
    const forecasts = await weatherApi.getWeatherForecast();

    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Weather Forecast</h1>
          <Button asChild>
            <Link href="/weather/interactive">Interactive Dashboard</Link>
          </Button>
        </div>

        <WeatherGrid forecasts={forecasts} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Weather Forecast</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            Failed to load weather data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
```

### **Step 4: Client Component with Interactivity**

**`src/app/weather/interactive/page.tsx`** - Client-side weather dashboard:

```tsx
"use client";

import { useState, useEffect } from "react";
import { weatherApi, WeatherForecast } from "@/lib/api-client";
import { WeatherGrid } from "@/components/weather/WeatherGrid";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

export default function InteractiveWeatherPage() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadForecasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherApi.getWeatherForecast();
      setForecasts(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load weather data");
      console.error("Weather API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadForecasts();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(loadForecasts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Interactive Weather Dashboard</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <Button onClick={loadForecasts} disabled={loading} variant="outline">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <Button
            onClick={loadForecasts}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {loading && forecasts.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading weather data...</span>
        </div>
      ) : (
        <WeatherGrid forecasts={forecasts} />
      )}
    </div>
  );
}
```

### **Step 5: Add to Navigation**

**Update `src/components/nav/index.tsx`**:

```typescript
const navItems = {
  "/": { name: "home" },
  "/blog": { name: "blog" },
  "/weather": { name: "weather" }, // Add this line
};
```

---

## 10. React Native Implementation

### 🎯 **Presentation Points:**

- Shared API client between web and mobile
- React Native navigation
- Platform-specific styling
- Mobile-optimized components

### **Step 1: API Client Setup** (Already Done)

The mobile app already uses the same API client. Let's examine the configuration:

**`apps/mobile/src/lib/api-client.ts`**:

```typescript
import "../types/api-polyfills";
import { WeatherForecastApi, Configuration } from "api-client";

const apiConfig = new Configuration({
  basePath: __DEV__
    ? "http://localhost:5074"
    : "https://your-production-api.com/",
  headers: {
    "Content-Type": "application/json",
  },
  fetchApi: fetch,
});

export const weatherApi = new WeatherForecastApi(apiConfig);
export type { WeatherForecast } from "api-client";
```

### **Step 2: Create Weather Components**

**`src/components/WeatherCard.tsx`** - Mobile weather card:

```tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WeatherForecast } from "../lib/api-client";

interface WeatherCardProps {
  forecast: WeatherForecast;
  onPress?: () => void;
}

export function WeatherCard({ forecast, onPress }: WeatherCardProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getTemperatureColor = (temp?: number) => {
    if (!temp) return "#666";
    if (temp < 0) return "#2563eb";
    if (temp < 15) return "#3b82f6";
    if (temp < 25) return "#10b981";
    return "#ef4444";
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(forecast.date)}</Text>
        <View style={styles.summaryBadge}>
          <Text style={styles.summaryText}>
            {forecast.summary || "Unknown"}
          </Text>
        </View>
      </View>

      <View style={styles.temperatureContainer}>
        <Text
          style={[
            styles.temperatureC,
            { color: getTemperatureColor(forecast.temperatureC) },
          ]}
        >
          {forecast.temperatureC}°C
        </Text>
        <Text style={styles.temperatureF}>{forecast.temperatureF}°F</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  summaryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  temperatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  temperatureC: {
    fontSize: 24,
    fontWeight: "bold",
  },
  temperatureF: {
    fontSize: 14,
    color: "#666",
  },
});
```

### **Step 3: Weather Screen**

**`src/screens/WeatherScreen.tsx`** - Main weather screen:

```tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { weatherApi, WeatherForecast } from "../lib/api-client";
import { WeatherCard } from "../components/WeatherCard";

export function WeatherScreen() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadForecasts = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const data = await weatherApi.getWeatherForecast();
      setForecasts(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load weather data");
      console.error("Weather API error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadForecasts(true);
  };

  useEffect(() => {
    loadForecasts();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Weather Forecast</Text>
      {lastUpdated && (
        <Text style={styles.lastUpdated}>
          Updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      )}
    </View>
  );

  const renderForecast = ({ item }: { item: WeatherForecast }) => (
    <WeatherCard forecast={item} />
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadForecasts()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No weather data available</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={forecasts}
        renderItem={renderForecast}
        keyExtractor={(item, index) =>
          item.date?.toString() || index.toString()
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#666",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
```

### **Step 4: Add to Navigation**

**Update `App.tsx`** to include the weather screen:

```tsx
import { WeatherScreen } from "./src/screens/WeatherScreen";

// Update the RootStackParamList
export type RootStackParamList = {
  Home: undefined;
  BlogPost: { slug: string };
  Weather: undefined; // Add this line
};

// In the Stack.Navigator:
<Stack.Screen
  name="Weather"
  component={WeatherScreen}
  options={{
    title: "Weather Forecast",
  }}
/>;
```

**Update HomeScreen** to navigate to weather:

```tsx
// Add to HomeScreen.tsx
import { TouchableOpacity } from 'react-native';

const renderHeader = () => (
    <View style={styles.headerContent}>
        {/* Existing content */}

        <TouchableOpacity
            style={styles.weatherButton}
            onPress={() => navigation.navigate('Weather')}
        >
            <Text style={styles.weatherButtonText}>View Weather</Text>
        </TouchableOpacity>
    </View>
);

// Add to styles
weatherButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 16,
},
weatherButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
},
```

---

## 11. Advanced Patterns & Best Practices

### 🎯 **Presentation Points:**

- Error boundaries for resilient apps
- Custom hooks for reusable logic
- Performance optimization
- Testing strategies

### **Custom Hooks for API Calls**

Create reusable hooks for common patterns:

**`src/hooks/useWeatherData.ts`** (Next.js):

```typescript
import { useState, useEffect } from "react";
import { weatherApi, WeatherForecast } from "@/lib/api-client";

export function useWeatherData() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadForecasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherApi.getWeatherForecast();
      setForecasts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecasts();
  }, []);

  return {
    forecasts,
    loading,
    error,
    refresh: loadForecasts,
  };
}
```

**Usage in components**:

```tsx
function WeatherDashboard() {
  const { forecasts, loading, error, refresh } = useWeatherData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <WeatherGrid forecasts={forecasts} />
    </div>
  );
}
```

### **Error Boundaries**

**`src/components/ErrorBoundary.tsx`**:

```tsx
"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-red-300 rounded-md bg-red-50">
            <h2 className="text-lg font-semibold text-red-800">
              Something went wrong
            </h2>
            <p className="text-red-600">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### **Performance Optimization**

**React.memo for expensive components**:

```tsx
import React, { memo } from "react";

export const WeatherCard = memo(function WeatherCard({
  forecast,
}: {
  forecast: WeatherForecast;
}) {
  // Component implementation
});

// Only re-render if forecast changes
```

**useMemo for expensive calculations**:

```tsx
function WeatherStats({ forecasts }: { forecasts: WeatherForecast[] }) {
  const stats = useMemo(() => {
    const temps = forecasts.map((f) => f.temperatureC || 0);
    return {
      avg: temps.reduce((a, b) => a + b, 0) / temps.length,
      max: Math.max(...temps),
      min: Math.min(...temps),
    };
  }, [forecasts]); // Only recalculate when forecasts change

  return (
    <div>
      <p>Average: {stats.avg.toFixed(1)}°C</p>
      <p>Max: {stats.max}°C</p>
      <p>Min: {stats.min}°C</p>
    </div>
  );
}
```

### **Development Workflow**

**Starting the full stack**:

```bash
# Terminal 1: Start .NET API
cd apps/backend
dotnet run --launch-profile http

# Terminal 2: Start Next.js
cd apps/web
pnpm dev

# Terminal 3: Start React Native
cd apps/mobile
pnpm start
```

**Regenerating API client after backend changes**:

```bash
cd packages/api-client
pnpm run openapi:generate
```

**Building for production**:

```bash
# Build all apps
pnpm build

# Build specific app
cd apps/web
pnpm build
```

---

## Summary

### **Key Takeaways:**

1. **Shared Types**: One source of truth for data models across all platforms
2. **Monorepo Benefits**: Coordinated development and deployment
3. **React Patterns**: Hooks, components, and lifecycle management
4. **Next.js Features**: Server/client components, routing, and optimization
5. **Mobile Adaptation**: Same logic, platform-specific UI

### **Next Steps:**

- Implement authentication flow across all apps
- Add real-time updates with SignalR
- Implement offline support in React Native
- Add comprehensive testing (Jest, Playwright)
- Set up CI/CD pipeline for the monorepo

### **Resources:**

- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)

---
