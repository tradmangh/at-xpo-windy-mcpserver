# 🌤️ Windy MCP Server

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MCP SDK](https://img.shields.io/badge/MCP%20SDK-0.6.0-orange.svg)](https://github.com/modelcontextprotocol)

**Connect AI assistants to real-time weather data from Windy.com**

## Overview

The **Windy MCP Server** is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that bridges AI assistants with the comprehensive weather data from [Windy.com](https://www.windy.com). MCP is an open protocol that enables seamless integration between AI applications (like Claude Desktop) and external data sources.

This server empowers AI assistants to:
- Fetch detailed weather forecasts for any location worldwide
- Discover nearby webcams for visual weather verification
- Generate shareable Windy.com map links with customized layers

**Use Cases:**
- **Claude Desktop**: Enhance conversations with real-time weather insights
- **AI Automation**: Build weather-aware workflows and decision systems
- **Chatbots**: Integrate live weather data into customer support or travel bots
- **Personal Assistants**: Create weather-informed task planning and recommendations

## Features

### 🎯 get_point_forecast
Get detailed weather forecasts for any coordinates with precision and flexibility.

**Capabilities:**
- **Temperature**: Current and forecasted temperature data
- **Wind**: Speed, direction, and gusts - perfect for sailors, pilots, and outdoor enthusiasts
- **Precipitation**: Rain, snow, and precipitation probability
- **Pressure**: Atmospheric pressure readings for weather pattern analysis
- **Multiple Forecast Models**: Choose from GFS, ECMWF, ICON-EU, and more for different accuracy levels and update frequencies

### 📷 get_webcams
Discover webcams near any location for visual weather verification and real-time conditions.

**Capabilities:**
- **Location-Based Search**: Find webcams within a specified radius
- **Visual Verification**: Perfect for confirming actual weather conditions
- **Webcam Metadata**: Access webcam details, titles, and locations
- **Image URLs**: Direct links to current webcam images

### 🗺️ get_map_link
Generate shareable Windy.com map URLs with customizable views.

**Capabilities:**
- **Customizable Layers**: Wind, rain, temperature, clouds, waves, and more
- **Zoom Configuration**: Set the perfect zoom level (1-19) for your needs
- **Center Point**: Focus the map on any coordinates
- **Instant Sharing**: Create links to share weather visualizations with others

## Quick Start

Follow these steps to get the Windy MCP Server up and running:

```bash
# Clone the repository
git clone https://github.com/tradmangh/at-xpo-windy-mcpserver.git
cd at-xpo-windy-mcpserver

# Install dependencies
npm install

# Set up your API key
cp .env.example .env
# Edit .env and add your WINDY_API_KEY

# Build the server
npm run build

# Start the server
npm start
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WINDY_API_KEY` | Yes | Your Windy.com API key. Get one from [api.windy.com](https://api.windy.com/) |

### Getting a Windy API Key

1. Visit [https://api.windy.com/](https://api.windy.com/)
2. Create an account or sign in
3. Navigate to the API keys section
4. Generate a new API key for your application
5. Copy the key and add it to your `.env` file

## Integration Examples

### Claude Desktop Configuration

To use this MCP server with Claude Desktop, add the following configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "windy": {
      "command": "node",
      "args": ["/absolute/path/to/at-xpo-windy-mcpserver/build/index.js"],
      "env": {
        "WINDY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace `/absolute/path/to/at-xpo-windy-mcpserver` with the actual path where you cloned the repository, and `your-api-key-here` with your actual Windy.com API key.

### Example Prompts for AI Assistants

Once configured, you can use natural language prompts like:

- "What's the wind forecast for Lake Neusiedl tomorrow?"
- "Find webcams near Podersdorf, Austria"
- "Show me the temperature forecast for Tarifa, Spain for the next 3 days"
- "Generate a Windy map link for kitesurfing conditions in Tarifa with wind overlay"
- "What's the weather like at coordinates 47.8095, 16.7644?"
- "Are there any webcams near the Golden Gate Bridge?"

## API Reference

### get_point_forecast

Retrieve weather forecast data for specific coordinates.

**Input Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | number | Yes | - | Latitude (-90 to 90) |
| `lon` | number | Yes | - | Longitude (-180 to 180) |
| `model` | string | No | `"gfs"` | Forecast model: `gfs`, `ecmwf`, `iconEu`, etc. |
| `parameters` | array | No | `["temp", "wind", "rain", "clouds"]` | Weather parameters to fetch |
| `levels` | array | No | `["surface"]` | Atmospheric levels: `surface`, `850h`, etc. |

**Example Request:**
```json
{
  "lat": 47.8095,
  "lon": 16.7644,
  "model": "gfs",
  "parameters": ["temp", "wind", "rain"],
  "levels": ["surface"]
}
```

**Example Response:**
```json
{
  "lat": 47.8095,
  "lon": 16.7644,
  "model": "gfs",
  "parameters": {
    "temp": [15, 16, 17, ...],
    "wind": [5.2, 6.1, 7.3, ...],
    "rain": [0, 0, 0.5, ...]
  },
  "ts": [1234567890, 1234571490, ...]
}
```

### get_webcams

Find webcams near a specific location.

**Input Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | number | Yes | - | Latitude (-90 to 90) |
| `lon` | number | Yes | - | Longitude (-180 to 180) |
| `radius` | number | No | `30` | Search radius in kilometers |

**Example Request:**
```json
{
  "lat": 47.8095,
  "lon": 16.7644,
  "radius": 50
}
```

**Example Response:**
```json
{
  "result": {
    "total": 5,
    "webcams": [
      {
        "id": "1234567890",
        "title": "Podersdorf Beach",
        "location": {
          "latitude": 47.8123,
          "longitude": 16.7701
        },
        "image": {
          "current": "https://..."
        }
      }
    ]
  }
}
```

### get_map_link

Generate a shareable Windy.com map URL.

**Input Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | number | Yes | - | Latitude (-90 to 90) |
| `lon` | number | Yes | - | Longitude (-180 to 180) |
| `zoom` | number | No | `10` | Zoom level (1-19) |
| `layer` | string | No | `"wind"` | Map layer: `wind`, `rain`, `temp`, `clouds`, `waves`, etc. |

**Example Request:**
```json
{
  "lat": 47.8095,
  "lon": 16.7644,
  "zoom": 12,
  "layer": "wind"
}
```

**Example Response:**
```
Windy Map URL: https://www.windy.com/?wind,47.8095,16.7644,12
```

## Development

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Windy.com API Key**: Required for accessing weather data

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode (with ts-node)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run the built server
npm start

# Run tests (when available)
npm test
```

### Project Structure

```
at-xpo-windy-mcpserver/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── tools.ts          # Tool definitions and handlers
│   └── *.test.ts         # Test files
├── build/                # Compiled JavaScript output
├── .env.example          # Environment variable template
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Related Projects

> **🌐 [windy.at](https://windy.at)** - A companion web portal that provides weather forecasts tailored for windsurfers, kiters, sailors, and outdoor enthusiasts. Visit [windy.at](https://windy.at) to explore weather conditions, forecasts, and spot information for locations worldwide. Perfect for planning your next adventure on the water or in the mountains!

## Contributing

We welcome contributions! Whether it's bug reports, feature requests, documentation improvements, or code contributions, your input is valuable.

### How to Contribute

1. **Report Issues**: Use the [GitHub Issues](https://github.com/tradmangh/at-xpo-windy-mcpserver/issues) page to report bugs or request features
2. **Submit Pull Requests**: Fork the repository, make your changes, and submit a PR
3. **Improve Documentation**: Help us make the docs better by submitting corrections or additions
4. **Share Feedback**: Let us know how you're using the Windy MCP Server

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

This means:
- ✅ You can use this software for any purpose
- ✅ You can modify the software
- ✅ You can distribute the software
- ✅ You can use the software privately
- ⚠️ If you run a modified version on a server, you must make the source code available to users

See [LICENSE](LICENSE) for the full license text.

## Acknowledgments

- **[Windy.com](https://www.windy.com)** - For providing the excellent weather API and visualization platform
- **[Anthropic](https://www.anthropic.com)** - For developing the Model Context Protocol specification and Claude
- **MCP Community** - For building an ecosystem of tools and integrations

---

**Questions or Need Help?** Open an issue on [GitHub](https://github.com/tradmangh/at-xpo-windy-mcpserver/issues) or check out the [Windy API documentation](https://api.windy.com/).
