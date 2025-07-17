# Mobile Blog App Setup

This React Native app displays blog posts from the .NET API using the shared `@mono/api` package.

## Features

- **Home Screen**: Portfolio introduction with blog posts list
- **Blog Post Screen**: Individual post details with markdown rendering
- **Shared API Client**: Same API client as the Next.js web app
- **Navigation**: React Navigation for screen transitions

## Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **For iOS development:**

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start the backend API:**
   Make sure the .NET backend is running on `http://localhost:5074`

4. **Run the app:**

   ```bash
   # For iOS
   pnpm ios

   # For Android
   pnpm android
   ```

## Architecture

The mobile app mirrors the Next.js web app structure:

- **HomeScreen** → Equivalent to `/pages/index.tsx`
- **BlogPostScreen** → Equivalent to `/pages/blog/[slug].tsx`
- **BlogPosts component** → Same functionality as web version
- **Shared API client** → Same `api-client` package

## API Configuration

- Development: `http://localhost:5074/`
- Production: Update `src/lib/api-client.ts`

## Troubleshooting

- Ensure backend is running on correct port
- Check Metro bundler is started
- Verify iOS simulator/Android emulator is running
