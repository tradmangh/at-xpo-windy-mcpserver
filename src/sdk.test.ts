import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

describe('SDK', () => {
    it('should have McpError', () => {
        console.log('McpError:', McpError);
        expect(McpError).toBeDefined();
    });
    it('should have ErrorCode', () => {
        console.log('ErrorCode:', ErrorCode);
        expect(ErrorCode).toBeDefined();
    });
});
