# Windy.com MCP Server Walkthrough

This document outlines the implementation and verification of the Windy.com MCP Server.

## Features Implemented

1.  **Point Forecast Tool (`get_point_forecast`)**
    *   Retrieves detailed weather forecast data for a specific location.
    *   Supports various models (GFS, ECMWF, etc.) and parameters (temp, wind, rain, etc.).
    *   **Verification:** Verified against the real Windy.com API using a valid API key.

2.  **Map Link Tool (`get_map_link`)**
    *   Generates a URL to view the weather map on Windy.com.
    *   Customizable by location, zoom level, and layer (wind, rain, temp).

3.  **Webcams Tool (`get_webcams`)**
    *   Finds webcams near a specific location.
    *   Uses the **Windy Webcams API v3** (recommended) with fallback logic.
    *   **Verification:** Verified against the real API v3 endpoint, successfully retrieving webcam images.

## Verification Results

### Manual Verification Script
A verification script `src/verify_real_api.ts` was created to test the tools against the live API.

**Point Forecast Output (Theologos, Rhodos):**
```json
{
  "ts": [
    1764147600000,
    1764158400000,
    ...
  ],
  "units": { ... },
  "temp-surface": [ ... ]
}
```

**Webcams Output (Theologos, Rhodos):**
```json
{
  "total": 1,
  "webcams": [
    {
      "webcamId": "1462288000",
      "title": "Theologos: Billys Place",
      "viewCount": 18244,
      "status": "active",
      "images": {
        "current": {
          "icon": "https://imgproxy.windy.com/_/icon/plain/current/1462288000/original.jpg",
          "thumbnail": "https://imgproxy.windy.com/_/thumbnail/plain/current/1462288000/original.jpg",
          "preview": "https://imgproxy.windy.com/_/preview/plain/current/1462288000/original.jpg"
        },
        "daylight": {
          "icon": "https://imgproxy.windy.com/_/icon/plain/daylight/1462288000/original.jpg",
          "thumbnail": "https://imgproxy.windy.com/_/thumbnail/plain/daylight/1462288000/original.jpg",
          "preview": "https://imgproxy.windy.com/_/preview/plain/daylight/1462288000/original.jpg"
        }
      },
      "location": {
        "city": "Theologos",
        "region": "South Aegean",
        "country": "Greece",
        "latitude": 36.386388,
        "longitude": 28.036388
      }
    }
  ]
}
```

### Build Status
The project builds successfully using `npm run build`.

## Usage

1.  **Environment Setup:**
    Ensure the following environment variables are set:
    *   `WINDY_POINT_FORECAST_KEY`: API key for Point Forecast.
    *   `WINDY_WEBCAMS_KEY`: API key for Webcams API.
    *   (Optional) `WINDY_API_KEY`: Fallback key if specific ones are not set.

2.  **Running the Server:**
    ```bash
    node build/index.js
    ```

3.  **MCP Inspector:**
    You can use the MCP Inspector to test the tools interactively:
    ```bash
    npx @modelcontextprotocol/inspector node build/index.js
    ```
