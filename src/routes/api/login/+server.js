import bcrypt from 'bcrypt';
import { getDbClient } from '../../../lib/db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function POST({ request }) {
  const { numero_telefono, pin } = await request.json();
  const client = getDbClient(); // Establish a database connection

  try {
    // Fetch user from the database
    const { rows } = await client.query(
      `
      SELECT * 
      FROM usuarios 
      WHERE numero_telefono = $1
      `,
      [numero_telefono]
    );

    const user = rows[0];
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid phone number or PIN' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate PIN
    const isValidPin = await bcrypt.compare(pin, user.pin_hash);
    if (!isValidPin) {
      return new Response(
        JSON.stringify({ message: 'Invalid phone number or PIN' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!user.activo) {
      return new Response(
        JSON.stringify({ message: 'Account is inactive' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update last login
    await client.query(
      `
      UPDATE usuarios 
      SET ultimo_login = $1
      WHERE id = $2
      `,
      [new Date().toISOString(), user.id]
    );

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          rol_id: user.rol_id,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end(); // Ensure the connection is closed
  }
}
