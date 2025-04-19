import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { LeanIXClient } from './leanix-client.js';
import { config } from './src/config/config.js';
import { registerWorkspaceTools } from './src/tools/workspaceTools.js';

// Create MCP server instance
const server = new McpServer({
  name: "LeanIX GraphQL Server",
  version: "1.0.0"
});

// Initialize LeanIX client
const leanixClient = new LeanIXClient(config.subdomain, config.token);

// Register workspace tools
registerWorkspaceTools(server, leanixClient);

// Start the server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);