// Query for getting fact sheet counts and workspace overview
export const GET_FACT_SHEET_COUNTS = `
  query {
    allFactSheets {
      totalCount
      filterOptions {
        facets {
          facetKey
          results {
            name
            key
            count
          }
        }
      }
    }
  }
`;

export const GET_SCHEMA_INFO = `
  {
    __schema {
      types {
        name
        kind
        description
      }
      queryType {
        name
        fields {
          name
          description
          args {
            name
            description
            type {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
`;