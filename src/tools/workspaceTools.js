import { GET_FACT_SHEET_COUNTS, GET_SCHEMA_INFO } from '../graphql/queries/workspaceQueries.js';
import { SEARCH_FACT_SHEET_BY_NAME } from '../graphql/queries/factSheetQueries.js';
import { GET_FACT_SHEET_SUBSCRIPTIONS } from '../graphql/queries/subscriptionQueries.js';
import { CREATE_FACT_SHEET, UPDATE_FACT_SHEET } from '../graphql/queries/factSheetMutations.js';
import { withErrorHandling } from '../utils/responseHandler.js';
import { z } from 'zod';
import { factSheetSchema } from '../types/factSheetSchema.js';
import { factSheetInputSchema } from '../types/factSheetInputSchema.js';
import { factSheetPatchSchema } from '../types/factSheetPatchSchema.js';

export function registerWorkspaceTools(server, leanixClient) {
  // Tool to get Fact Sheet counts and workspace overview
  server.tool(
    'getFactSheetCountsByType',
    {},
    withErrorHandling(async () => {
      const result = await leanixClient.query(GET_FACT_SHEET_COUNTS);
      return result;
    }, 'fetching fact sheet counts and workspace overview')
  );

  // Tool to search fact sheets by name
  server.tool(
    'searchFactSheetByName',
    {
      params: z.object({
        name: z.string().describe('Name of the fact sheet to search for')
      })
    },
    withErrorHandling(async ({ params }) => {
      // Extract name from params and pass it directly in variables
      const result = await leanixClient.query(SEARCH_FACT_SHEET_BY_NAME, { name: params.name });
      return result;
    }, 'searching fact sheet by name')
  );

  // Tool to get subscriptions for a specific fact sheet
  server.tool(
    'getFactSheetSubscriptions',
    {
      params: z.object({
        factSheetId: z.string().describe('ID of the fact sheet to get subscriptions for')
      })
    },
    withErrorHandling(async ({ params }) => {
      const result = await leanixClient.query(GET_FACT_SHEET_SUBSCRIPTIONS, { factSheetId: params.factSheetId });
      return result;
    }, 'fetching subscriptions for a fact sheet')
  );

  // Tool to create a new fact sheet
  server.tool(
    'createFactSheet',
    {
      params: z.object({
        input: factSheetInputSchema
      })
    },
    withErrorHandling(async ({ params }) => {
      const result = await leanixClient.query(CREATE_FACT_SHEET, { input: params.input });
      return result;
    }, 'creating new fact sheet')
  );

  // Tool to update a fact sheet
  server.tool(
    'updateFactSheet',
    {
      params: z.object({
        id: z.string().describe('ID of the fact sheet to update'),
        patches: factSheetPatchSchema
      })
    },
    withErrorHandling(async ({ params }) => {
      const result = await leanixClient.query(UPDATE_FACT_SHEET, { 
        id: params.id,
        patches: params.patches
      });
      return result;
    }, 'updating fact sheet')
  );

  // Tool to get schema information and generate a query
  server.tool(
    'leanix_query_generator',
    {
      params: z.object({
        question: z.string().describe('A natural language question about LeanIX data')
      })
    },
    withErrorHandling(async ({ params }) => {
      const schemaResponse = await leanixClient.query(GET_SCHEMA_INFO);
      
      // Return the schema info in a way that helps Claude understand the available types and fields
      return {
        content: [{
          type: "text",
          text: `Based on your question: "${params.question}"\n\n` +
                `I can see these available types and fields in the LeanIX API:\n\n` +
                `${JSON.stringify(schemaResponse, null, 2)}\n\n` +
                `I'll help you construct a GraphQL query to get this information.`
        }]
      };
    }, 'retrieving schema information')
  );

  // Tool to execute the generated query
  server.tool(
    'leanix_query_executor',
    {
      params: z.object({
        query: z.string().describe('The GraphQL query to execute'),
        variables: z.record(z.any()).optional().describe('Any variables required by the query')
      })
    },
    withErrorHandling(async ({ params }) => {
      const result = await leanixClient.query(params.query, params.variables);
      return result;
    }, 'executing GraphQL query')
  );
} 