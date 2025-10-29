# SD Auto - Dynamic Header API Integration

This document explains how the dynamic header integration works with your Laravel API.

## Overview

The header component now fetches data dynamically from your Laravel API at `http://192.168.1.8:8000/api/home-settings` and displays:

- Company address
- Email address  
- Phone number
- Logo image
- Company title
- Company description

## Files Created/Modified

### New Files:
1. **`src/types/settings.ts`** - TypeScript interfaces for API data
2. **`src/services/api.ts`** - API service for making HTTP requests
3. **`src/hooks/useHomeSettings.ts`** - React hook for managing settings data
4. **`test-integration.html`** - Visual test page for API integration
5. **`test-api-integration.js`** - Simple API test script

### Modified Files:
1. **`src/components/layout/header.tsx`** - Updated to use dynamic data
2. **`.env.local`** - Added API base URL configuration

## How It Works

1. **API Service** (`src/services/api.ts`):
   - Handles HTTP requests to Laravel API
   - Includes error handling for network issues, authentication, etc.
   - Provides TypeScript-safe methods for CRUD operations

2. **React Hook** (`src/hooks/useHomeSettings.ts`):
   - Fetches settings data on component mount
   - Manages loading states and error handling
   - Includes retry logic for network failures
   - Gracefully handles API unavailability

3. **Header Component** (`src/components/layout/header.tsx`):
   - Uses the `useHomeSettings` hook to get data
   - Shows loading states while fetching
   - Falls back to hardcoded data if API is unavailable
   - Updates both desktop and mobile header sections

## Fallback Behavior

If the API is unavailable, the header will display fallback data:
- Address: "SD AUTO Werribee, Victoria 3030 Australia"
- Email: "sdautoaustralia@gmail.com"  
- Phone: "+61 460 786 533"
- Logo: "/assets/logo.png"
- Title: "SD AUTO"
- Description: "Parts and Accessories"

## Current API Status

⚠️ **Authentication Required**: Your Laravel API currently returns "Unauthorized" for the `/home-settings` endpoint. This suggests authentication middleware is applied.

## Next Steps

### Option 1: Remove Authentication (Recommended for Public Data)
If home settings should be publicly accessible, remove authentication middleware from the route:

```php
// In your Laravel routes file
Route::prefix('home-settings')->group(function () {
    Route::get('/', [SettingController::class, 'index']); // Remove auth middleware
    Route::post('/', [SettingController::class, 'store']);
    Route::get('/{id}', [SettingController::class, 'show']); // Remove auth middleware  
    Route::put('/{id}', [SettingController::class, 'update']);
    Route::patch('/{id}', [SettingController::class, 'update']);
});
```

### Option 2: Add CORS Support
Ensure your Laravel API allows cross-origin requests from your frontend:

```php
// In config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000', 'http://localhost:9002', '*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Option 3: Add Authentication Support
If authentication is required, we can modify the frontend to include API tokens:

```typescript
// In src/services/api.ts - add authorization header
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, // Add this
};
```

## Testing

### 1. Visual Test
Open `test-integration.html` in your browser to:
- Test API connectivity
- See live data from your Laravel API
- View fallback behavior when API is unavailable

### 2. Console Test  
Run `node test-api-integration.js` to test API connectivity from command line.

### 3. Frontend Test
Start your Next.js development server and check the header:
```bash
npm run dev
```

## Configuration

The API base URL is configured in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.8:8000/api
```

Change this URL if your Laravel API moves to a different address.

## Error Handling

The integration includes comprehensive error handling:
- Network errors → Uses fallback data
- Authentication errors → Uses fallback data  
- Server errors → Retries then uses fallback data
- Invalid responses → Uses fallback data

This ensures your website always displays properly even if the API is temporarily unavailable.
