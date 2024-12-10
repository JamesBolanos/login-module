export async function GET({ locals }) {
    if (!locals.user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    return new Response(JSON.stringify({ message: 'Authorized', userId: locals.user.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  