import { sql } from '@vercel/postgres';

export async function handle({ event, resolve }) {
  const sessionId = event.cookies.get('sessionId');

  if (sessionId) {
    try {
      const result = await sql`
        SELECT user_id 
        FROM sessions 
        WHERE id = ${sessionId} AND expires_at > NOW()
      `;

      if (result.rows.length > 0) {
        event.locals.user = { id: result.rows[0].user_id };
      } else {
        event.cookies.delete('sessionId', { path: '/' });
      }
    } catch (error) {
      console.error('Error validating session:', error);
    }
  }

  return resolve(event);
}
