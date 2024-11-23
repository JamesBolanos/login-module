import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST({ request }) {
    const { numero_telefono, pin } = await request.json();

    // Fetch user from the database
    const { data: user, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('numero_telefono', numero_telefono)
        .single();

    if (error || !user) {
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
    await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('id', user.id);

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
}
