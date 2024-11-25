import { getDbClient } from '../../../../../lib/db';

/**
 * PUT: Update an existing user by ID.
 */
export async function PUT({ request, params }) {
  const client = getDbClient(); // Establish a new database connection
  try {
    const { id } = params;
    const { nombre, apellido, numero_telefono, rol_id, debe_cambiar_pin } = await request.json();

    await client.query(
      `
      UPDATE usuarios 
      SET nombre = $1,
          apellido = $2,
          numero_telefono = $3,
          rol_id = $4,
          debe_cambiar_pin = $5,
          fecha_actualizacion = NOW()
      WHERE id = $6
      `,
      [nombre, apellido, numero_telefono, rol_id, debe_cambiar_pin, id]
    );

    return new Response(
      JSON.stringify({ message: 'User updated successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to update user.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end(); // Ensure the connection is closed
  }
}

/**
 * DELETE: Remove a user by ID.
 */
export async function DELETE({ params }) {
  const client = getDbClient(); // Establish a new database connection
  try {
    const { id } = params;

    await client.query(
      `
      DELETE FROM usuarios WHERE id = $1
      `,
      [id]
    );

    return new Response(
      JSON.stringify({ message: 'User deleted successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to delete user.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.end(); // Ensure the connection is closed
  }
}
