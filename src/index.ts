#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import { z } from "zod";
import { TOOLS, handleCallTool } from "./tools.js";

dotenv.config();

const POINT_FORECAST_KEY = process.env.WINDY_POINT_FORECAST_KEY || process.env.WINDY_API_KEY;
const WEBCAMS_KEY = process.env.WINDY_WEBCAMS_KEY || process.env.WINDY_API_KEY;

if (!POINT_FORECAST_KEY && !WEBCAMS_KEY) {
    console.error("Error: WINDY_POINT_FORECAST_KEY or WINDY_WEBCAMS_KEY (or WINDY_API_KEY) environment variable is required");
    process.exit(1);
}

const server = new Server(
    {
        name: "windy-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Tool Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        return await handleCallTool(name, args, {
            pointForecast: POINT_FORECAST_KEY,
            webcams: WEBCAMS_KEY
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new McpError(ErrorCode.InvalidParams, `Invalid arguments: ${error.message}`);
        }
        if (error instanceof McpError) {
            throw error;
        }
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Windy MCP Server running on stdio");
