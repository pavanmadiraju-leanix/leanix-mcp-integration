import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: join(dirname(dirname(__dirname)), '.env') });

// Debug logging
console.error('Environment variables loaded:');
console.error('LEANIX_SUBDOMAIN:', process.env.LEANIX_SUBDOMAIN);
console.error('LEANIX_TOKEN:', process.env.LEANIX_TOKEN ? '[PRESENT]' : '[MISSING]');

// Configuration parameters
export const config = {
  subdomain: process.env.LEANIX_SUBDOMAIN,
  token: process.env.LEANIX_TOKEN
};

// Validate configuration
if (!config.subdomain || !config.token) {
  console.error('Error: LEANIX_SUBDOMAIN and LEANIX_TOKEN environment variables must be set');
  process.exit(1);
}