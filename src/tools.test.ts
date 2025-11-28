import { jest } from '@jest/globals';

// Mock SDK types
jest.mock('@modelcontextprotocol/sdk/types.js', () => ({
    McpError: class extends Error {
        code: any;
        constructor(code: any, message: any) {
            super(message);
            this.code = code;
        }
    },
    ErrorCode: {
        InvalidRequest: 'InvalidRequest',
        MethodNotFound: 'MethodNotFound',
        InternalError: 'InternalError'
    }
}));

// Mock axios before importing it
jest.mock('axios', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
        get: jest.fn()
    }
}));

import axios from 'axios';
import { handleCallTool } from './tools.js';
// import { McpError } from '@modelcontextprotocol/sdk/types.js'; // Don't import real one if mocked? 
// Actually we need to import it to use it in assertions, but it will be the mocked one.
import { McpError } from '@modelcontextprotocol/sdk/types.js';

describe('handleCallTool', () => {
    const apiKey = 'test_key';

    // Helper to get mocked functions with any casting to avoid type errors
    const mockPost = axios.post as any;
    const mockGet = axios.get as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call get_point_forecast with correct parameters', async () => {
        const args = {
            lat: 48.8566,
            lon: 2.3522,
            model: "gfs",
            parameters: ["temp", "wind"]
        };

        mockPost.mockResolvedValue({ data: { result: 'success' } });

        const result = await handleCallTool('get_point_forecast', args, { pointForecast: apiKey });

        expect(mockPost).toHaveBeenCalledWith("https://api.windy.com/api/point-forecast/v2", {
            lat: 48.8566,
            lon: 2.3522,
            model: "gfs",
            parameters: ["temp", "wind"],
            levels: ["surface"],
            key: apiKey,
        });

        expect(result).toEqual({
            content: [{ type: "text", text: JSON.stringify({ result: 'success' }, null, 2) }]
        });
    });

    it('should use default values for get_point_forecast', async () => {
        const args = {
            lat: 48.8566,
            lon: 2.3522,
        };

        mockPost.mockResolvedValue({ data: { result: 'success' } });

        await handleCallTool('get_point_forecast', args, { pointForecast: apiKey });

        expect(mockPost).toHaveBeenCalledWith("https://api.windy.com/api/point-forecast/v2", {
            lat: 48.8566,
            lon: 2.3522,
            model: "gfs",
            parameters: ["temp", "wind", "rain", "clouds"],
            levels: ["surface"],
            key: apiKey,
        });
    });

    it('should call get_webcams with correct parameters', async () => {
        const args = {
            lat: 48.8566,
            lon: 2.3522,
            radius: 50
        };

        mockGet.mockResolvedValue({ data: { result: 'webcams' } });

        const result = await handleCallTool('get_webcams', args, { webcams: apiKey });

        expect(mockGet).toHaveBeenCalledWith(`https://api.windy.com/webcams/api/v3/webcams`, {
            params: {
                nearby: "48.8566,2.3522,50",
                include: "images"
            },
            headers: { "x-windy-api-key": apiKey }
        });
    });

    it('should generate correct map link', async () => {
        const args = {
            lat: 48.8566,
            lon: 2.3522,
            zoom: 10,
            layer: "wind"
        };

        const result = await handleCallTool('get_map_link', args, {});

        expect(result.content[0].text).toContain("https://www.windy.com/?wind,48.8566,2.3522,10");
    });

    it('should throw error for unknown tool', async () => {
        await expect(handleCallTool('unknown_tool', {}, { pointForecast: apiKey }))
            .rejects
            .toThrow(McpError);
    });

    it('should throw error for invalid arguments', async () => {
        await expect(handleCallTool('get_point_forecast', { lat: 'invalid' }, { pointForecast: apiKey }))
            .rejects
            .toThrow();
    });
});
