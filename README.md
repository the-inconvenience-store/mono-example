# Full-Stack TypeScript Monorepo

> **Modern development with .NET API, Next.js Web App, and React Native Mobile App sharing generated TypeScript clients**

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?logo=nextjs)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.80.1-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PNPM](https://img.shields.io/badge/PNPM-10.5.0-F69220?logo=pnpm)](https://pnpm.io/)

## Architecture Overview

This monorepo demonstrates modern full-stack development with type-safe communication between platforms:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   .NET API      │    │    Next.js      │    │  React Native   │
│   (Backend)     │◄──►│     (Web)       │    │    (Mobile)     │
│                 │    │                 │    │                 │
│ • ASP.NET Core  │    │ • App Router    │    │ • Navigation    │
│ • OpenAPI/Swagger│   │ • TailwindCSS   │    │ • Shared Types  │
│ • MDX Blog Posts│    │ • Storybook     │    │ • API Client    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Shared API     │
                    │   Client        │
                    │  (@mono/api)    │
                    │                 │
                    │ • TypeScript    │
                    │ • Auto-generated│
                    │ • Type Safety   │
                    └─────────────────┘
```

## Features

### **Backend (.NET 9.0)**

- **RESTful APIs** with OpenAPI/Swagger documentation
- **Blog System** with MDX file parsing and frontmatter extraction
- **Weather API** with comprehensive data models
- **CORS Configuration** for cross-origin requests
- **XML Documentation** for enhanced API client generation

### **Web App (Next.js 15.4.1)**

- **App Router** with server and client components
- **Blog Platform** with MDX content rendering
- **Weather Dashboard** with interactive features
- **TailwindCSS** for utility-first styling
- **Storybook** for component development and testing
- **TypeScript** integration with generated API types

### **Mobile App (React Native 0.80.1)**

- **Native Navigation** with React Navigation
- **Shared API Client** with the web application
- **Cross-platform** iOS and Android support
- **Type-safe** API consumption
- **Performance optimized** with proper list rendering

### **Shared Package (@mono/api)**

- **Auto-generated** TypeScript client from OpenAPI specification
- **Type-safe** API communication
- **Shared across** web and mobile applications
- **Fetch-based** HTTP client with full TypeScript support

## Project Structure

```
mono-example/
├── apps/
│   ├── backend/              # .NET API Server
│   │   ├── Controllers/      # API Controllers
│   │   ├── Models/           # Data Models
│   │   ├── Services/         # Business Logic
│   │   └── posts/            # MDX Blog Content
│   ├── web/                  # Next.js Web Application
│   │   ├── src/
│   │   │   ├── app/          # App Router Pages
│   │   │   ├── components/   # Reusable Components
│   │   │   ├── features/     # Feature-based Components
│   │   │   └── lib/          # Utilities & API Client
│   │   └── .storybook/       # Storybook Configuration
│   └── mobile/               # React Native Mobile App
│       ├── src/
│       │   ├── screens/      # Navigation Screens
│       │   ├── components/   # Mobile Components
│       │   └── lib/          # API Client & Utils
│       └── ios/              # iOS Platform Files
├── packages/
│   └── api/                  # Generated TypeScript API Client
│       ├── src/
│       │   ├── apis/         # API Endpoint Classes
│       │   └── models/       # TypeScript Interfaces
│       └── dist/             # Compiled JavaScript
└── infra/                    # Infrastructure & Deployment
```

## Tech Stack

### **Backend**

- **Framework**: ASP.NET Core 9.0
- **Documentation**: OpenAPI/Swagger with XML comments
- **Data**: Entity Framework Core (In-Memory)
- **Logging**: Built-in ASP.NET Core logging
- **Content**: MDX parsing for blog posts

### **Frontend**

- **Framework**: Next.js 15.4.1 with App Router
- **Styling**: TailwindCSS with custom components
- **Components**: Shadcn/ui design system
- **Development**: Storybook for component development
- **Testing**: Vitest with Storybook integration
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

### **Mobile**

- **Framework**: React Native 0.80.1
- **Navigation**: React Navigation 7.x
- **Components**: Native components with shared styling
- **Development**: Metro bundler with symlink support

### **Shared**

- **Package Manager**: PNPM with workspace support
- **Language**: TypeScript 5.0+
- **API Generation**: OpenAPI Generator CLI
- **Environment**: T3 Environment Variables
- **Code Quality**: ESLint, Prettier

## Quick Start

### **Prerequisites**

- [Node.js](https://nodejs.org/) 18+
- [.NET SDK](https://dotnet.microsoft.com/download) 9.0+
- [PNPM](https://pnpm.io/) 10.5.0+
- [React Native CLI](https://reactnative.dev/docs/environment-setup) (for mobile development)

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/the-inconvenience-store/mono-example.git
   cd mono-example
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the backend API**

   ```bash
   cd apps/backend
   dotnet restore
   dotnet run
   ```

   Backend will be available at `http://localhost:5074`

4. **Generate API client** (in a new terminal)

   ```bash
   pnpm generate:api
   ```

5. **Start the web application** (in a new terminal)

   ```bash
   cd apps/web
   pnpm dev
   ```

   Web app will be available at `http://localhost:3000`

6. **Start the mobile application** (in a new terminal)
   ```bash
   cd apps/mobile
   # For iOS
   pnpm ios
   # For Android
   pnpm android
   ```

## Available Scripts

### **Root Level**

```bash
pnpm dev           # Start all applications in parallel
pnpm build         # Build all applications
pnpm generate:api  # Generate TypeScript client from OpenAPI spec
```

### **Backend (apps/backend)**

```bash
dotnet run         # Start the API server
dotnet build       # Build the application
dotnet test        # Run tests
```

### **Web (apps/web)**

```bash
pnpm dev           # Start Next.js development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm storybook     # Start Storybook development server
pnpm lint          # Run ESLint
```

### **Mobile (apps/mobile)**

```bash
pnpm start         # Start Metro bundler, add --reset-cache arg when updating packages
pnpm ios           # Run on iOS simulator
pnpm android       # Run on Android emulator
pnpm test          # Run Jest tests
```

## API Endpoints

### **Blog Posts**

- `GET /api/blogposts` - Get all blog posts
- `GET /api/blogposts/{slug}` - Get specific blog post

### **Weather**

- `GET /WeatherForecast` - Get 5-day weather forecast

### **Documentation**

- `GET /swagger` - Interactive API documentation
- `GET /openapi/v1.json` - OpenAPI specification

## Environment Configuration

### **Backend**

- Default port: `5074`
- Swagger UI: `/swagger`
- CORS enabled for `localhost:3000` and `localhost:3001`

### **Web Application**

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5074
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

### **Mobile Application**

- API URL automatically detected via `__DEV__` flag
- Development: `http://localhost:5074`
- Production: Configure in `src/lib/api-client.ts`

## Mobile Development

### **iOS Setup**

```bash
cd apps/mobile
cd ios && pod install && cd ..
pnpm ios
```

### **Android Setup**

```bash
cd apps/mobile
pnpm android
```

### **Metro Configuration**

The project includes Metro configuration for monorepo symlink support and workspace package resolution.

## Testing

### **Web Application**

```bash
cd apps/web
pnpm test          # Run Vitest tests
pnpm storybook     # Visual component testing
```

### **Mobile Application**

```bash
cd apps/mobile
pnpm test          # Run Jest tests
```

## Documentation

- **[API Documentation](http://localhost:5074/swagger)** - Interactive API docs (when backend is running)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)

---

**Built with ❤️ by [the-inconvenience-store](https://github.com/the-inconvenience-store)**
