# Building a Weather Dashboard: React, Next.js & Full-Stack TypeScript

_A live coding walkthrough: From .NET API to Interactive React Components_

## Introduction

### What we'll build

By the end of this tutorial, you'll have built a complete weather dashboard that demonstrates core React and Next.js concepts while consuming data from a .NET API. You'll learn React fundamentals, modern JavaScript features, and full-stack TypeScript development patterns.

### Prerequisites

- Basic JavaScript knowledge
- Familiarity with .NET/C# (helpful but not required)
- Node.js installed on your machine
- A code editor (VS Code recommended)

### Our Learning Journey

We'll build features incrementally, introducing new concepts as we need them:

1. **Basic React Components** - Props and JSX
2. **TypeScript Integration** - Type safety and interfaces
3. **State Management** - useState hook
4. **Side Effects** - useEffect hook for API calls
5. **Styling** - TailwindCSS and modern UI patterns
6. **Next.js Features** - Server vs Client components
7. **API Integration** - Consuming our .NET backend

---

## Step 1: Understanding Our Foundation

> **Speaker Note:** Start by showing the existing .NET API running on localhost:5074. Demonstrate the Swagger UI and explain how the WeatherForecast endpoint works. This gives context for what we're building toward.

### Goal

Understand the API we'll be consuming and see our target outcome.

### The WeatherForecast API

Our .NET backend provides a `/WeatherForecast` endpoint that returns 5 days of weather data:

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

### Generated TypeScript Types

Thanks to OpenAPI generation, we have type-safe interfaces:

```typescript
interface WeatherForecast {
  date: Date;
  temperatureC: number;
  temperatureF?: number;
  summary?: string | null;
}
```

> **Key Concept:** TypeScript interfaces help us catch errors at compile time and provide excellent developer experience with autocomplete.

---

## Step 2: Creating Our First Component

> **Speaker Note:** Emphasize that React components are just JavaScript functions that return JSX. Start simple and build complexity gradually.

### Goal

Create a basic weather card component that displays weather data, learning about JSX and props.

### Code

Create `src/components/weather/WeatherCard.tsx`:

```tsx
interface WeatherCardProps {
  forecast: {
    date: Date;
    temperatureC: number;
    temperatureF?: number;
    summary?: string | null;
  };
}

export function WeatherCard({ forecast }: WeatherCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">
        {forecast.date.toLocaleDateString()}
      </h3>
      <div className="text-3xl font-bold text-blue-600 mb-2">
        {forecast.temperatureC}°C
      </div>
      {forecast.temperatureF && (
        <div className="text-sm text-gray-600 mb-2">
          {forecast.temperatureF}°F
        </div>
      )}
      <div className="text-sm text-gray-700">
        {forecast.summary || "No description"}
      </div>
    </div>
  );
}
```

### Key Concepts Introduced

- **Props**: How data flows into components
- **TypeScript Interfaces**: Defining component prop types
- **JSX**: Writing HTML-like syntax in JavaScript
- **Conditional Rendering**: Using `&&` and `||` operators
- **CSS Classes**: TailwindCSS utility classes

> **Speaker Note:** Point out how TypeScript catches errors if we pass wrong prop types. Show what happens if you mistype a property name.

---

## Step 3: Building a Grid Layout

> **Speaker Note:** Now we'll see how components compose together. This introduces the concept of parent-child component relationships.

### Goal

Create a grid component that displays multiple weather cards, learning about mapping over arrays and component composition.

### Code

Create `src/components/weather/WeatherGrid.tsx`:

```tsx
import { WeatherCard } from "./WeatherCard";

interface WeatherGridProps {
  forecasts: Array<{
    date: Date;
    temperatureC: number;
    temperatureF?: number;
    summary?: string | null;
  }>;
}

export function WeatherGrid({ forecasts }: WeatherGridProps) {
  // Handle empty state
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
          key={forecast.date.toString() || index}
          forecast={forecast}
        />
      ))}
    </div>
  );
}
```

### Key Concepts Introduced

- **Array Mapping**: Using `.map()` to render lists
- **Keys**: Why React needs unique keys for list items
- **Responsive Design**: TailwindCSS grid classes that adapt to screen size
- **Component Composition**: How smaller components build larger features
- **Empty States**: Always handle the case where there's no data

> **Speaker Note:** Explain why keys are important for React's reconciliation algorithm. Show what happens without keys by temporarily removing them.

---

## Step 4: Adding Type Safety with Generated APIs

> **Speaker Note:** This is where we connect to our real backend. Explain how OpenAPI generation creates type-safe API clients automatically.

### Goal

Set up our API client and use proper TypeScript types from our generated package.

### Code

Update `src/lib/api-client.ts`:

```typescript
import { BlogPostsApi, WeatherApi, Configuration } from "@mono/api";
import { env } from "@/config/env/client";

// API Configuration
const apiConfig = new Configuration({
  basePath: env.NEXT_PUBLIC_API_URL || "http://localhost:5074",
  headers: {
    "Content-Type": "application/json",
  },
});

// API Client instances
export const blogPostsApi = new BlogPostsApi(apiConfig);
export const weatherApi = new WeatherApi(apiConfig);

// Type exports for convenience
export type { BlogPost, PostMetadata, WeatherForecast } from "@mono/api";
```

### Update WeatherCard with proper types

Now update `src/components/weather/WeatherCard.tsx`:

```tsx
import { WeatherForecast } from "@/lib/api-client";

interface WeatherCardProps {
  forecast: WeatherForecast;
}

export function WeatherCard({ forecast }: WeatherCardProps) {
  const getTemperatureColor = (temp?: number) => {
    if (!temp) return "text-gray-500";
    if (temp < 0) return "text-blue-600";
    if (temp < 15) return "text-blue-400";
    if (temp < 25) return "text-green-500";
    return "text-red-500";
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        {forecast.date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </h3>
      <div
        className={`text-3xl font-bold ${getTemperatureColor(forecast.temperatureC)}`}
      >
        {forecast.temperatureC}°C
      </div>
      {forecast.temperatureF && (
        <div className="text-sm text-gray-600 mb-2">
          {forecast.temperatureF}°F
        </div>
      )}
      <div className="text-sm font-medium text-gray-700 capitalize">
        {forecast.summary || "Clear skies"}
      </div>
    </div>
  );
}
```

### Key Concepts Introduced

- **Generated Types**: Using types from our API package
- **Environment Variables**: Configuring API endpoints safely
- **Date Formatting**: Using `toLocaleDateString()` with options
- **Import/Export**: ES6 module system

---

## Step 5: Our First Next.js Page (Server Component)

> **Speaker Note:** This is a big conceptual shift. Explain the difference between server and client components in Next.js 13+. Server components run on the server and can directly access APIs.

### Goal

Create a server-rendered page that fetches data at build time, learning about Next.js App Router and server components.

### Code

Create `src/app/weather/page.tsx`:

```tsx
import { weatherApi } from "@/lib/api-client";
import { WeatherGrid } from "@/features/weather/components/WeatherGrid";

// This is metadata for the page
export const metadata = {
  title: "Weather Forecast",
  description: "Current weather forecast data",
};

// This is a Server Component - it runs on the server
export default async function WeatherPage() {
  try {
    // This API call happens on the server
    const forecasts = await weatherApi.getWeatherForecast();

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Weather Forecast
        </h1>
        <WeatherGrid forecasts={forecasts} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Weather Forecast
        </h1>
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

### Key Concepts Introduced

- **Server Components**: Components that run on the server
- **Async/Await**: Modern JavaScript for handling promises
- **Next.js App Router**: File-based routing system
- **Metadata**: SEO and page information
- **Error Handling**: Try/catch blocks and error states
- **Container Layouts**: Responsive container patterns

> **Speaker Note:** Navigate to `/weather` and show the page rendering with real data. Explain that this happened on the server - view source to show the HTML is already populated.

---

## Step 6: Adding Interactivity with Client Components

> **Speaker Note:** Now we introduce the React hooks and client-side state management. This is where React really shines.

### Goal

Create an interactive dashboard with refresh functionality, learning about useState, useEffect, and client-side data fetching.

### Code

Create `src/app/weather/interactive/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { weatherApi, WeatherForecast } from "@/lib/api-client";
import { WeatherGrid } from "@/features/weather/components/WeatherGrid";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

export default function InteractiveWeatherPage() {
  // State management with useState hook
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to load weather data
  const loadForecasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherApi.getWeatherForecast();
      setForecasts(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  // Effect hook - runs when component mounts
  useEffect(() => {
    loadForecasts();
  }, []); // Empty dependency array means "run once on mount"

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive Weather Dashboard
          </h1>
          {lastUpdated && (
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <Button
          onClick={loadForecasts}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
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

### Key Concepts Introduced

- **"use client" directive**: Marking components for client-side rendering
- **useState Hook**: Managing component state
- **useEffect Hook**: Side effects and lifecycle
- **Event Handlers**: onClick functions
- **Loading States**: UX patterns for async operations
- **Conditional Rendering**: Multiple states (loading, error, success)
- **Icons**: Using Lucide React icons

> **Speaker Note:** Demonstrate the refresh button working, show the loading spinner, and explain how state updates trigger re-renders. This is the heart of React's reactivity.

---

## Step 7: Building Reusable UI Components

> **Speaker Note:** Introduce the concept of design systems and reusable components. This teaches component abstraction and props patterns.

### Goal

Create a reusable Button component with variants, learning about component APIs and styling patterns.

### Code

Create `src/components/ui/button.tsx`:

```tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

// Define button variants
const buttonVariants = {
  variant: {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  },
  size: {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
    lg: "h-12 px-8 text-lg",
  },
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variant styles
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

### Create the utility function

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Key Concepts Introduced

- **forwardRef**: Passing refs through components
- **Spread Operator**: `...props` for passing through props
- **Type Unions**: `keyof typeof` for type-safe variants
- **Interface Extending**: Extending HTML element props
- **Utility Functions**: Combining and merging CSS classes
- **Component Variants**: Design system patterns

> **Speaker Note:** Explain how this Button component can now be used anywhere in the app with consistent styling and behavior. Show different variants and sizes.

---

## Step 8: Advanced State Management

> **Speaker Note:** Introduce more complex state patterns and custom hooks. This teaches state encapsulation and reusable logic.

### Goal

Create a custom hook for weather data management, learning about custom hooks and advanced state patterns.

### Code

Create `src/hooks/useWeatherData.ts`:

```typescript
import { useState, useEffect, useCallback } from "react";
import { weatherApi, WeatherForecast } from "@/lib/api-client";

interface UseWeatherDataReturn {
  forecasts: WeatherForecast[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useWeatherData(): UseWeatherDataReturn {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // useCallback prevents unnecessary re-renders
  const refresh = useCallback(async () => {
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
  }, []);

  // Load data on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    forecasts,
    loading,
    error,
    lastUpdated,
    refresh,
  };
}
```

### Refactor our interactive page

Update `src/app/weather/interactive/page.tsx`:

```tsx
"use client";

import { useWeatherData } from "@/hooks/useWeatherData";
import { WeatherGrid } from "@/components/weather/WeatherGrid";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

export default function InteractiveWeatherPage() {
  const { forecasts, loading, error, lastUpdated, refresh } = useWeatherData();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive Weather Dashboard
          </h1>
          {lastUpdated && (
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <Button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {loading && forecasts.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </div>
      ) : (
        <WeatherGrid forecasts={forecasts} />
      )}
    </div>
  );
}
```

### Key Concepts Introduced

- **Custom Hooks**: Extracting and reusing stateful logic
- **useCallback**: Optimizing function references
- **Hook Composition**: Building complex logic from simple hooks
- **Return Types**: TypeScript interfaces for hook returns
- **Error Recovery**: "Try Again" functionality

> **Speaker Note:** Explain how custom hooks make logic reusable across components. This weather data logic could now be used in multiple components throughout the app.

---

## Step 9: Enhanced UI with Advanced Components

> **Speaker Note:** Now we'll add more sophisticated UI elements. This teaches about accessibility, advanced styling, and component composition patterns.

### Goal

Add visual indicators and improved UX elements, learning about icons, animations, and accessibility.

### Code

Create `src/components/weather/WeatherStats.tsx`:

```tsx
import { WeatherForecast } from "@/lib/api-client";
import { Thermometer, Droplets, Wind } from "lucide-react";

interface WeatherStatsProps {
  forecasts: WeatherForecast[];
}

export function WeatherStats({ forecasts }: WeatherStatsProps) {
  if (forecasts.length === 0) return null;

  // Calculate statistics
  const temps = forecasts.map((f) => f.temperatureC);
  const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);

  const summaries = forecasts.map((f) => f.summary).filter(Boolean);
  const mostCommonSummary = summaries.length > 0 ? summaries[0] : "Variable";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Thermometer className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-gray-900">Temperature</h3>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">{avgTemp}°C</p>
          <p className="text-sm text-gray-600">
            Range: {minTemp}° - {maxTemp}°
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Conditions</h3>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-900 capitalize">
            {mostCommonSummary}
          </p>
          <p className="text-sm text-gray-600">
            Across {forecasts.length} days
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Wind className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold text-gray-900">Forecast</h3>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-900">5 Days</p>
          <p className="text-sm text-gray-600">Next update in 30 min</p>
        </div>
      </div>
    </div>
  );
}
```

### Update the interactive page

Add the stats to `src/app/weather/interactive/page.tsx`:

```tsx
"use client";

import { useWeatherData } from "@/hooks/useWeatherData";
import { WeatherGrid } from "@/components/weather/WeatherGrid";
import { WeatherStats } from "@/components/weather/WeatherStats";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InteractiveWeatherPage() {
  const { forecasts, loading, error, lastUpdated, refresh } = useWeatherData();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/weather">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Static
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive Weather Dashboard
          </h1>
          {lastUpdated && (
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <Button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800 mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={refresh}>
            Try Again
          </Button>
        </div>
      )}

      {loading && forecasts.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </div>
      ) : (
        <>
          <WeatherStats forecasts={forecasts} />
          <WeatherGrid forecasts={forecasts} />
        </>
      )}
    </div>
  );
}
```

### Key Concepts Introduced

- **Data Processing**: Calculating statistics from arrays
- **Array Methods**: `map`, `filter`, `reduce`, `Math.max/min`
- **Early Returns**: Conditional component rendering
- **Navigation**: Link components and routing
- **Layout Composition**: Building complex layouts from simple components

---

## Step 10: Navigation and Layout

> **Speaker Note:** Complete the application with proper navigation. This teaches about Next.js routing and application structure.

### Goal

Add navigation between our pages and improve the overall application structure.

### Code

Update `src/app/weather/page.tsx` to include navigation:

```tsx
import { weatherApi } from "@/lib/api-client";
import { WeatherGrid } from "@/components/weather/WeatherGrid";
import { WeatherStats } from "@/components/weather/WeatherStats";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Weather Forecast",
  description: "Current weather forecast data",
};

export default async function WeatherPage() {
  try {
    const forecasts = await weatherApi.getWeatherForecast();

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Weather Forecast
            </h1>
            <p className="text-gray-600">Server-rendered weather data</p>
          </div>

          <Button asChild>
            <Link href="/weather/interactive">
              <Zap className="h-4 w-4 mr-2" />
              Interactive Dashboard
            </Link>
          </Button>
        </div>

        <WeatherStats forecasts={forecasts} />
        <WeatherGrid forecasts={forecasts} />

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 About this page
          </h3>
          <p className="text-sm text-blue-800">
            This page is server-rendered, meaning the weather data is fetched on
            the server and the HTML is sent to your browser pre-populated. Great
            for SEO and initial page load performance!
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Weather Forecast
        </h1>
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

### Add to the main page

Update `src/app/page.tsx`:

```tsx
import { BlogPosts } from "@/features/blog/components/posts";
import { Button } from "@/components/ui/button";
import { CloudSun } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">My Blog</h1>

      {/* Weather Feature Showcase */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <CloudSun className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Weather Dashboard
          </h2>
        </div>
        <p className="text-gray-700 mb-4">
          Explore our weather forecast feature showcasing React fundamentals,
          Next.js server/client components, and TypeScript integration.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/weather">Server Component</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/weather/interactive">Interactive Dashboard</Link>
          </Button>
        </div>
      </div>

      <p className="mb-4">
        {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
      </p>

      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
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
/>
()
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

## Recap: What We've Built and Learned

### 🎯 **Core React Concepts Mastered**

- **Components & JSX**: Building UIs with component functions
- **Props**: Passing data between components
- **State Management**: `useState` for interactive features
- **Effects**: `useEffect` for side effects and API calls
- **Custom Hooks**: Extracting reusable stateful logic
- **Event Handling**: User interactions and callbacks

### 🎯 **TypeScript Integration**

- **Interface Definitions**: Type-safe component props
- **API Types**: Generated types from OpenAPI schemas
- **Generic Types**: Flexible, reusable type definitions
- **Type Safety**: Catching errors at compile time

### 🎯 **Next.js Features**

- **App Router**: File-based routing system
- **Server Components**: Server-side rendering for performance
- **Client Components**: Interactive, browser-based components
- **Static Generation**: Build-time data fetching
- **Navigation**: `Link` component and routing

### 🎯 **Modern Development Patterns**

- **Component Composition**: Building complex UIs from simple parts
- **Error Boundaries**: Graceful error handling
- **Loading States**: Better user experience during async operations
- **Responsive Design**: Mobile-first CSS with TailwindCSS
- **Accessibility**: Semantic HTML and keyboard navigation

### 🎯 **Full-Stack Integration**

- **API Consumption**: Connecting to .NET backend
- **Type Generation**: OpenAPI to TypeScript workflow
- **Environment Configuration**: Managing different environments
- **Error Handling**: Network failures and user feedback

---

## Next Steps: Extending Your Knowledge

### 🚀 **Immediate Enhancements**

1. **Add more weather details** (humidity, wind speed, pressure)
2. **Implement weather icons** based on conditions
3. **Add location selection** for different cities
4. **Create weather charts** with data visualization

### 🚀 **Advanced Features**

1. **Caching Strategies** - React Query or SWR for data management
2. **Real-time Updates** - WebSocket integration for live data
3. **Progressive Web App** - Service workers and offline support
4. **Testing** - Unit tests with Jest and React Testing Library

### 🚀 **Deployment**

1. **Vercel Deployment** - Deploy your Next.js app
2. **Docker Containers** - Containerize the full stack
3. **CI/CD Pipelines** - Automate testing and deployment

---

> **Final Speaker Note:** Congratulate the participants on building a complete, type-safe, full-stack application! They've learned the fundamentals of modern React development while building something practical and extensible. The patterns they've learned here apply to any React application they'll build in the future.
