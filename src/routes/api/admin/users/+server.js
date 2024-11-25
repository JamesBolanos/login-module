import bcrypt from 'bcrypt';
import { getDbClient } from '../../../../lib/db.js';

/**
 * GET: Fetch all users.
 */
export async function GET() {
  const client = getDbClient(); // Establish a new database connection
  try {
    const { rows: users } = await client.query(`
      SELECT id, nombre, apellido, numero_telefono, rol_id, debe_cambiar_pin 
      FROM usuarios
    `);

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch users.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end(); // Close the database connection
  }
}

/**
 * POST: Add a new user.
 */
export async function POST({ request }) {
  const client = getDbClient(); // Establish a new database connection
  try {
    const { nombre, apellido, numero_telefono, rol_id, debe_cambiar_pin } = await request.json();

    // Generate a default PIN (hashed)
    const pin = '0000'; // Default PIN
    const pin_hash = await bcrypt.hash(pin, 10);

    await client.query(
      `
      INSERT INTO usuarios (nombre, apellido, numero_telefono, pin_hash, rol_id, activo, debe_cambiar_pin, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, TRUE, $6, NOW())
      `,
      [nombre, apellido, numero_telefono, pin_hash, rol_id, debe_cambiar_pin]
    );

    return new Response(
      JSON.stringify({ message: 'User added successfully!' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding user:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to add user.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end(); // Close the database connection
  }
}
