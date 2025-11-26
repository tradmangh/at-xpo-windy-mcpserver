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
            throw new McpError(ErrorCode.InvalidRequest, "Point Forecast API key not configured");
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

    if (name === "get_webcams") {
        if (!apiKeys.webcams) {
            throw new McpError(ErrorCode.InvalidRequest, "Webcams API key not configured");
        }
        const schema = z.object({
            lat: z.number(),
            lon: z.number(),
            radius: z.number().optional().default(30),
        });

        const { lat, lon, radius } = schema.parse(args);

        // Try Webcams API v3
        // Endpoint: https://api.windy.com/webcams/api/v3/webcams
        // Header: x-windy-api-key
        // Filter: nearby={lat},{lon},{radius} (assuming similar to v2 or standard)

        try {
            const response = await axios.get(`https://api.windy.com/webcams/api/v3/webcams`, {
                params: {
                    nearby: `${lat},${lon},${radius}`,
                    include: "images"
                },
                headers: {
                    "x-windy-api-key": apiKeys.webcams
                }
            });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error: any) {
            const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
            console.error(`Webcams v3 failed: ${errorDetails}`);

            // Try v2 as fallback
            try {
                const responseV2 = await axios.get(`https://api.windy.com/api/webcams/v2/list/nearby=${lat},${lon},${radius}`, {
                    headers: {
                        "x-windy-key": apiKeys.webcams
                    }
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(responseV2.data, null, 2),
                        },
                    ],
                };
            } catch (errorV2: any) {
                const errorDetailsV2 = errorV2.response ? JSON.stringify(errorV2.response.data) : errorV2.message;
                throw new McpError(ErrorCode.InternalError, `Webcams API failed. v3: ${errorDetails}, v2: ${errorDetailsV2}`);
            }
        }
    }

    if (name === "get_map_link") {
        const schema = z.object({
            lat: z.number(),
            lon: z.number(),
            zoom: z.number().optional().default(10),
            layer: z.string().optional().default("wind"),
        });

        const { lat, lon, zoom, layer } = schema.parse(args);
        const url = `https://www.windy.com/?${layer},${lat},${lon},${zoom}`;

        return {
            content: [
                {
                    type: "text",
                    text: `Windy Map URL: ${url}`,
                },
            ],
        };
    }

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
}
