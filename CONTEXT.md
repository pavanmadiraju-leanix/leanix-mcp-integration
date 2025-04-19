# LeanIX GraphQL Integration: Lessons Learned

## Core Concepts

### GraphQL Parameter Handling
When passing parameters to LeanIX GraphQL queries, it's crucial to understand the difference between tool parameters and GraphQL variables:

```javascript
// ❌ Incorrect way - Nested under params
const variables = { params: { name: "searchTerm" } };

// ✅ Correct way - Direct variable passing
const variables = { name: "searchTerm" };

// ✅ Correct way - ID parameters
const variables = { factSheetId: "6f926c12-2cdf-4d86-ae7e-266a29082dce" };
```

Common Error: `Variable 'name' has coerced Null value for NonNull type 'String!'`
Solution: Always destructure and pass parameters directly

### Connection Pattern
When working with LeanIX GraphQL queries that return collections:

```graphql
// ❌ Incorrect way - Trying to access fields directly
query {
  factSheet(id: $id) {
    subscriptions {
      id    // This won't work!
      type  // This won't work!
    }
  }
}

// ✅ Correct way - Using the Connection pattern
query {
  factSheet(id: $id) {
    subscriptions {
      edges {
        node {
          id
          type
        }
      }
      totalCount
    }
  }
}
```

### Client Method Consistency
The LeanIX client uses the `query` method for all GraphQL operations:

```javascript
// ✅ Correct way - Using query method for all operations
const result = await leanixClient.query(CREATE_FACT_SHEET, { input });
```

## Implementation Patterns

### Common Tool Structure
```javascript
server.tool(
  'toolName',
  {
    params: z.object({
      name: z.string().describe('Parameter description')
    })
  },
  withErrorHandling(async ({ params }) => {
    const result = await leanixClient.query(QUERY_NAME, { name: params.name });
    return result;
  }, 'operation description')
);
```

### Query Organization
Maintain contextual relevance and separation of concerns:
- Group related fields together
- Keep queries focused on single responsibility
- Include comprehensive but relevant response fields

### Response Structure
All responses follow the Connection pattern:
```json
{
  "allFactSheets": {
    "edges": [
      {
        "node": {
          "id": "78b45204-...",
          "name": "abc",
          "type": "Application",
          // ... other fields
        }
      }
    ]
  }
}
```

## Best Practices
1. Parameter Handling
   - Destructure tool parameters: `async ({ params })`
   - Pass GraphQL variables at root level
   - Use proper typing with Zod

2. Error Handling
   - Use `withErrorHandling` wrapper
   - Provide descriptive error messages
   - Handle null checks appropriately

3. Query Design
   - Follow Connection pattern for collections
   - Maintain contextual organization
   - Include necessary but minimal fields

4. Testing
   - Verify exact and partial matches
   - Test across different fact sheet types
   - Validate response structure

## Search Functionality

### Search Behavior
- Case-insensitive search
- Searches across multiple fields:
  - Fact sheet names
  - Descriptions
- Returns multiple fact sheet types in one query
- Includes both exact and partial matches

### Response Structure
The search returns comprehensive fact sheet information:
- Basic information (id, name, displayName)
- Type-specific fields (e.g., Application-specific fields)
- Metadata (updatedAt, tags)
- Type information (allows handling different fact sheet types)

## Query Organization and Field Placement

### Key Lesson: Contextual Query Organization
When designing GraphQL queries, it's crucial to maintain contextual relevance and separation of concerns:

```graphql
// ❌ Incorrect: Mixing concerns, adding fact sheet details in subscription query
query getFactSheetSubscriptions($factSheetId: ID!) {
  factSheet(id: $factSheetId) {
    id
    status           // Not subscription-specific
    lxState          // Not subscription-specific
    completion {...}  // Not subscription-specific
    subscriptions {
      edges {
        node {
          id
          type
        }
      }
    }
  }
}

// ✅ Correct: Keeping queries focused and contextual
// Fact Sheet Query - Contains fact sheet specific fields
query searchFactSheetByName($name: String!) {
  allFactSheets(filter: { fullTextSearch: $name }) {
    edges {
      node {
        id
        name
        status
        lxState
        completion {...}
      }
    }
  }
}

// Subscription Query - Focused on subscription data
query getFactSheetSubscriptions($factSheetId: ID!) {
  factSheet(id: $factSheetId) {
    id
    subscriptions {
      edges {
        node {
          id
          type
          user {...}
          roles {...}
        }
      }
    }
  }
}
```

### Best Practices for Query Organization:
1. **Contextual Cohesion**
   - Keep fields with their logical owner
   - Status, state, and metadata belong with fact sheet queries
   - Relationship data (subscriptions, roles) in dedicated queries

2. **Single Responsibility**
   - Each query should serve one clear purpose
   - Search queries focus on discovery
   - Detail queries focus on specific entity data
   - Relationship queries focus on connections

3. **Performance Benefits**
   - Focused queries result in smaller payloads
   - Better caching opportunities
   - Easier error handling
   - More efficient network usage

4. **Maintainability**
   - Queries are easier to understand and modify
   - Changes to one aspect don't affect others
   - Clearer documentation and usage patterns

## GraphQL Mutations in LeanIX Client

### Key Lesson: Client Method Consistency
When implementing GraphQL mutations in LeanIX, it's important to understand that the client uses the `query` method for all GraphQL operations, including mutations:

```javascript
// ❌ Incorrect way - Using separate mutation method
const result = await leanixClient.mutate(CREATE_FACT_SHEET, { input });

// ✅ Correct way - Using query method for all operations
const result = await leanixClient.query(CREATE_FACT_SHEET, { input });
```

### Implementation Details
1. Mutation Definition:
   ```graphql
   mutation createFactSheet($input: BaseFactSheetInput!) {
     createFactSheet(input: $input) {
       factSheet {
         id
         name
         displayName
         type
         description
         status
         lxState
       }
     }
   }
   ```

2. Tool Implementation:
   ```javascript
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
   ```

### Best Practices
1. Use `leanixClient.query()` for all GraphQL operations
2. Properly validate input using Zod schemas
3. Follow the established error handling patterns
4. Include comprehensive response fields in the mutation 