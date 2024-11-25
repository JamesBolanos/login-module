import { getDbClient } from '../../../../lib/db.js';

/**
 * GET: Fetch all roles.
 */
export async function GET() {
  const client = getDbClient(); // Establish a database connection
  try {
    const { rows: roles } = await client.query(
      'SELECT id, nombre_rol, descripcion FROM roles'
    );

    return new Response(JSON.stringify(roles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch roles.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end(); // Ensure the connection is closed
  }
}
