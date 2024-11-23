import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

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
            return {
                status: 401,
                body: { message: 'Invalid phone number or PIN' },
            };
        }

        // Validate PIN
        const isValidPin = await bcrypt.compare(pin, user.pin_hash);
        if (!isValidPin) {
            return {
                status: 401,
                body: { message: 'Invalid phone number or PIN' },
            };
        }

        if (!user.activo) {
            return {
                status: 403,
                body: { message: 'Account is inactive' },
            };
        }

        // Update last login
        await sql`
            UPDATE usuarios 
            SET ultimo_login = ${new Date().toISOString()} 
            WHERE id = ${user.id}
        `;

        return {
            status: 200,
            body: {
                message: 'Login successful',
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    rol_id: user.rol_id,
                },
            },
        };
    } catch (error) {
        console.error('Error during login:', error);
        return {
            status: 500,
            body: { message: 'Internal server error' },
        };
    }
}
