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

// Configuration parameters
export const config = {
  subdomain: process.env.LEANIX_SUBDOMAIN
};

// Validate configuration
if (!config.subdomain) {
  console.error('Error: LEANIX_SUBDOMAIN environment variables must be set');
  process.exit(1);
}