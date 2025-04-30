import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";   // ← change
import { LeanIXClient } from "./leanix-client.js";
import { config } from "./src/config/config.js";
import { registerWorkspaceTools } from "./src/tools/workspaceTools.js";

/* ──────────────────────────────────────────────────────────────────────────
   1.  core MCP server – register LeanIX tools
   ────────────────────────────────────────────────────────────────────────── */
const mcp = new McpServer({ name: "LeanIX GraphQL", version: "1.0.0" });
registerWorkspaceTools(mcp, new LeanIXClient(config.subdomain, config.token));

/* ──────────────────────────────────────────────────────────────────────────
   2.  Express wrapper for the SSE transport
   ────────────────────────────────────────────────────────────────────────── */
const app = express();
app.use(express.json());

/** store one SSE transport per session-id */
const sessions = new Map();

/* ①  client opens the SSE stream */
app.get("/sse", async (req, res) => {
  // create a new transport bound to *this* response stream
  const transport = new SSEServerTransport("/messages", res);
  await mcp.connect(transport);                    // bind transport ↔ MCP core
  sessions.set(transport.sessionId, transport);

  // auto-clean the map when the client closes the connection
  res.on("close", () => sessions.delete(transport.sessionId));
});

/* ②  client POSTs JSON-RPC messages (initialise, tools/list, tools/call, …) */
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const bearer = req.headers.authorization;
  const transport = sessions.get(sessionId);
  
  req.auth = {
    token: bearer.slice(7), // remove "Bearer " prefix
  }

  if (!transport) return res.status(400).send("invalid sessionId");

  await transport.handlePostMessage(req, res, req.body);

  // if the session ends (e.g. client sent DELETE), remove it
  if (transport.closed) sessions.delete(sessionId);
});

app.listen(3000, () =>
  console.log("MCP SSE server listening at http://localhost:3000  (GET /sse, POST /messages)")
);
