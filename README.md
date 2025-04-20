# LeanIX MCP Integration

A Model Context Protocol (MCP) server that connects LeanIX to AI assistants. It exposes LeanIX's GraphQL API as MCP tools that AI assistants can use.

## Core Functionality

This integration provides seven MCP tools for LeanIX operations:

1. **Fact Sheet Overview**: Get counts and statistics of fact sheets in your workspace
2. **Search**: Find fact sheets by their names
3. **Subscription Management**: View who is subscribed to specific fact sheets
4. **Create Fact Sheets**: Add new fact sheets to your workspace
5. **Update Fact Sheets**: Modify existing fact sheet information
6. **AI Query Generation**: Generate GraphQL queries from natural language questions
7. **Query Execution**: Execute dynamically generated GraphQL queries

## Prerequisites

- Node.js (v14 or higher)
- A LeanIX workspace and API token
- Basic understanding of GraphQL and MCP
- Claude Desktop with MCP support

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your LeanIX credentials:
   ```
   LEANIX_SUBDOMAIN=your-workspace-subdomain
   LEANIX_TOKEN=your-api-token
   ```

## Project Structure

```
├── server.js            # Main MCP server setup and initialization
├── leanix-client.js     # LeanIX API client implementation
├── api                  # LeanIX API definitions and endpoints
├── mutation            # GraphQL mutation definitions
├── datamodel           # Data models and type definitions
├── .env                # Environment configuration
└── src/
    ├── config/
    │   └── config.js         # Loads and validates environment variables for LeanIX credentials
    ├── graphql/
    │   └── queries/         # GraphQL queries and mutations for LeanIX API
    │       ├── factSheetQueries.js     # Queries for fact sheet operations
    │       └── workspaceQueries.js     # Queries for workspace-level operations
    ├── tools/
    │   └── workspaceTools.js # Defines and registers the MCP tools
    ├── types/
    │   └── schemas.js       # Zod schemas for validating tool parameters
    └── utils/
        └── responseHandler.js # Formats responses in MCP-compatible structure
```

## AI-Powered Query Generation

The integration now supports natural language query generation using Claude's AI capabilities. This allows you to:

1. Ask questions in plain English about your LeanIX data
2. Have Claude automatically generate the appropriate GraphQL query
3. Execute the query and get results explained in natural language

Example usage:
```
You: "What applications do we have in production?"

Claude will:
1. Analyze your question
2. Generate a GraphQL query using the LeanIX schema
3. Execute the query
4. Present the results in a clear, human-readable format
```

This feature makes it easier to explore and query your LeanIX data without needing to write GraphQL queries manually.

## Common Pitfalls and Solutions

1. **GraphQL Schema Mismatch**: Always check the current LeanIX API schema in their documentation or GraphiQL interface. The schema may change over time.

2. **Response Formatting**: All MCP tool responses must follow this format:
   ```javascript
   {
     content: [{
       type: "text",
       text: "your response here"
     }]
   }
   ```

3. **Error Handling**: Always wrap your tool implementations with `withErrorHandling` to ensure proper error responses.

4. **Environment Variables**: Make sure to properly load and validate environment variables before making any API calls.

## Claude Desktop Configuration

To use this MCP server with Claude Desktop, you need to add the server configuration to Claude's config file. The config file is typically located at:
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following configuration:

```json
{
    "mcpServers": {
      "myserver": {
        "command": "node",
        "args": [
          "/path/to/your/lean/server.js"
        ]
      }
    }
}
```

Replace `/path/to/your/lean/server.js` with the absolute path to your server.js file.

## Testing Your Integration

1. Start the server:
   ```bash
   node server.js
   ```

2. The server will connect to your LeanIX workspace and make the tools available through MCP.

3. You can test your tools through Claude Desktop:
   - Try simple queries like "Show me all applications"
   - Ask complex questions like "Which applications are used by our finance department?"
   - Get relationship information like "What IT components are connected to Application X?"

## Debugging Tips

1. Enable debug logging in your configuration file to verify environment variables are loaded correctly.

2. Use the LeanIX GraphiQL interface to test your queries before implementing them in your tools.

3. Check the server console for detailed error messages when tools fail.

4. When using AI query generation:
   - Be specific in your questions
   - Include relevant filters or conditions in your natural language query
   - Review the generated GraphQL query if results are unexpected

## Resources

- [LeanIX API Documentation](https://docs-eam.leanix.net/reference/graphql-api)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.github.io/)

## License

MIT 