export function createSuccessResponse(result) {
    return {
      content: [{ 
        type: "text", 
        text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
      }]
    };
  }
  
  export function createErrorResponse(error, context) {
    console.error(`Error in ${context}:`, error);
    return {
      content: [{ 
        type: "text", 
        text: `Error ${context}: ${error.message}`
      }]
    };
  }
  
  export function withErrorHandling(fn, operation) {
    return async (...args) => {
      try {
        const result = await fn(...args);
        return createSuccessResponse(result);
      } catch (error) {
        return createErrorResponse(error, operation);
      }
    };
  }