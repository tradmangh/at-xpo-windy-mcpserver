# Windy.com MCP Server

An MCP server that provides access to Windy.com weather data and webcams.

## Configuration

You need a Windy.com API key. Get one from [Windy.com API](https://api.windy.com/).

Set the environment variable `WINDY_API_KEY` to your key.

## Tools

- `get_point_forecast`: Get forecast data for a specific location.
- `get_webcams`: Find webcams near a location.
- `get_map_link`: Generate a link to the Windy.com map.

## Usage

```bash
npm install
npm run build
npm start
```
