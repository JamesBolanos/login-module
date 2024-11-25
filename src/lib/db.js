import { sql } from '@vercel/postgres';

import { createClient } from '@vercel/postgres';

import dotenv from 'dotenv';

// Explicitly load the .env.local file
dotenv.config({ path: '.env.local' });
// I had to rename .env.local to .env to auto load

console.log("POSTGRES_URL_NON_POOLING:", process.env.POSTGRES_URL_NON_POOLING);

export function getDbClient() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  return client;
}
