export async function load({ locals }) {
    if (!locals.user) {
      throw redirect(302, '/login'); // Redirect to login if the user is not authenticated
    }
  
    return {
      userRole: locals.user.roleName, // Pass the role to the frontend
    };
  }
  