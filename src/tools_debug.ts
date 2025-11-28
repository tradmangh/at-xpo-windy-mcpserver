import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";

export const TOOLS = [
    {
        name: "get_point_forecast",
        description: "Get weather forecast data for a specific location using Windy.com API",
        inputSchema: {
            type: "object",
            properties: {
                lat: { type: "number", description: "Latitude of the location" },
                lon: { type: "number", description: "Longitude of the location" },
                model: {
                    type: "string",
                    description: "Forecast model (e.g., gfs, ecmwf, iconEu). Defaults to gfs.",
                    default: "gfs"
                },
                parameters: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of weather parameters (e.g., temp, wind, rain, clouds). Defaults to common set.",
                    default: ["temp", "wind", "rain", "clouds"]
                },
                levels: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of levels (e.g., surface, 850h). Defaults to surface.",
                    default: ["surface"]
                }
            },
            required: ["lat", "lon"],
        },
    },
    {
        name: "get_webcams",
        description: "Find webcams near a specific location using Windy.com API",
        inputSchema: {
            type: "object",
            properties: {
                lat: { type: "number", description: "Latitude of the location" },
                lon: { type: "number", description: "Longitude of the location" },
                radius: {
                    type: "number",
                    description: "Search radius in kilometers. Defaults to 30.",
                    default: 30
                },
            },
            required: ["lat", "lon"],
        },
    },
    {
        name: "get_map_link",
        description: "Generate a Windy.com map URL for visualization",
        inputSchema: {
            type: "object",
            properties: {
                lat: { type: "number", description: "Latitude" },
                lon: { type: "number", description: "Longitude" },
                zoom: { type: "number", description: "Zoom level (1-19). Defaults to 10.", default: 10 },
                layer: { type: "string", description: "Map layer (e.g., wind, rain, temp). Defaults to wind.", default: "wind" },
            },
            required: ["lat", "lon"],
        },
    },
];

export async function handleCallTool(name: string, args: any, apiKeys: { pointForecast?: string, webcams?: string }) {
    if (name === "get_point_forecast") {
        if (!apiKeys.pointForecast) {
            // throw new McpError(ErrorCode.InvalidRequest, "Point Forecast API key not configured");
            throw new Error("Point Forecast API key not configured");
        }
        const schema = z.object({
            lat: z.number(),
            lon: z.number(),
            model: z.string().optional().default("gfs"),
            parameters: z.array(z.string()).optional().default(["temp", "wind", "rain", "clouds"]),
            levels: z.array(z.string()).optional().default(["surface"]),
        });

        const { lat, lon, model, parameters, levels } = schema.parse(args);

        const response = await axios.post("https://api.windy.com/api/point-forecast/v2", {
            lat,
            lon,
            model,
            parameters,
            levels,
            key: apiKeys.pointForecast,
        });

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(response.data, null, 2),
                },
            ],
        };
    }
    return { content: [] };
}
