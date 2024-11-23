import { sql } from '@vercel/postgres';

// Example query function
export async function queryDatabase(query, params = []) {
    try {
        const result = await sql(query, ...params);
        return result.rows; // Return rows from the result
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Failed to query the database');
    }
}
