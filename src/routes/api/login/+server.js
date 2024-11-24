import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export async function POST({ request }) {
    const { numero_telefono, pin } = await request.json();

    try {
        // Fetch user from the database
        const { rows } = await sql`
            SELECT * 
            FROM usuarios 
            WHERE numero_telefono = ${numero_telefono}
        `;

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
        await sql`
            UPDATE usuarios 
            SET ultimo_login = ${new Date().toISOString()} 
            WHERE id = ${user.id}
        `;

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
    }
}
