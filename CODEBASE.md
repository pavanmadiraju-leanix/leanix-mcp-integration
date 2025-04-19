# Codebase Documentation

This document provides a comprehensive overview of the key files in the codebase, their functional requirements, and goals.

## Core Application Files

### `server.js`
**Functional Requirements:**
- Establish and maintain the main application server
- Handle HTTP requests and route them to appropriate handlers
- Configure middleware and server settings
- Initialize database connections

### `leanix-client.js`
**Functional Requirements:**
- Manage LeanIX API authentication and connection
- Provide reusable client instance for LeanIX API interactions
- Handle token management and refresh mechanisms

## Core Directories

### `src/` - Source Code
Contains the core application logic organized into modular components.

#### `src/constants/`
**Purpose:** Define system-wide constants and enumerations
**Files:**
- `factSheetTypes.js`:
  - Define all supported fact sheet types
  - Ensure consistent type usage across the application
  - Enable type validation and checking
- `factSheetStates.js`:
  - Define lifecycle states for fact sheets
  - Enable state transition validation
  - Maintain consistency in state management

#### `src/types/`
**Purpose:** Define data structures and validation schemas
**Files:**
- `factSheetSchema.js`:
  - Define data validation rules for fact sheets
  - Ensure data integrity
  - Provide type safety and validation

#### `src/graphql/`
**Purpose:** Handle GraphQL operations and schema definitions
**Files:**
- `queries/workspaceQueries.js`:
  - Define workspace-related GraphQL queries
  - Enable efficient data fetching
  - Support workspace analytics and reporting
- `queries/schemaQueries.js`:
  - Support schema introspection
  - Enable dynamic schema validation
  - Facilitate API documentation

#### `src/tools/`
**Purpose:** Provide utility functions for workspace operations
**Files:**
- `workspaceTools.js`:
  - Implement reusable workspace operations
  - Handle error management
  - Provide abstraction for common tasks

#### `src/services/`
**Purpose:** Implement business logic and core functionality
**Goals:**
- Separate concerns between different business domains
- Provide reusable service layers
- Handle complex business rules and validations

#### `src/utils/`
**Purpose:** House helper functions and shared utilities
**Goals:**
- Reduce code duplication
- Provide common functionality
- Implement cross-cutting concerns

#### `src/config/`
**Purpose:** Manage application configuration
**Goals:**
- Centralize configuration management
- Support different environments
- Handle sensitive configuration securely

## API and Data Model

### `api`
**Functional Requirements:**
- Define API endpoints and routes
- Handle request/response lifecycle
- Implement API versioning
- Manage API authentication and authorization
- Handle error responses and status codes

### `datamodel`
**Functional Requirements:**
- Define data structures and relationships
- Implement data validation rules
- Support data migration and versioning
- Handle data type conversions
- Maintain data integrity constraints

### `mutation`
**Functional Requirements:**
- Handle data modification operations
- Implement mutation resolvers
- Validate mutation inputs
- Manage transaction boundaries
- Handle optimistic concurrency

## Configuration Files

### `package.json` & `package-lock.json`
**Purpose:** Manage dependencies and project metadata
**Goals:**
- Define project dependencies
- Maintain version consistency
- Configure scripts and commands
- Define project metadata

### `.env`
**Purpose:** Store environment-specific configuration
**Goals:**
- Secure sensitive information
- Support multiple environments
- Configure runtime variables

## Services

## Constants

### `src/constants/factSheetTypes.js`
Defines all available fact sheet types in the system.

**Key Constants:**
- `FACT_SHEET_TYPES`: Enum for all fact sheet types (Application, ITComponent, Interface, etc.)

### `src/constants/factSheetStates.js`
Defines possible states for fact sheets.

**Key Constants:**
- `FACT_SHEET_STATE`: Enum for fact sheet states (DRAFT, REJECTED, APPROVED)

## GraphQL Queries

The following GraphQL queries are defined in the `src/graphql/queries` directory:

- `queries/workspaceQueries.js`:
  - `GET_FACT_SHEET_COUNTS`: Retrieves fact sheet counts and workspace overview information

## Types

### `src/types/factSheetSchema.js`
Defines Zod schema for fact sheet data validation.

**Schemas:**
- `factSheetSchema`: Validates fact sheet data structure

## Tools

The following tools are available:

- `getFactSheetCountsByType`: Retrieves fact sheet counts and workspace overview

Each tool is wrapped with error handling. 