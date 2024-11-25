<script>
    import { onMount } from 'svelte';
    let users = [];
    let roles = [];
    let form = {
      id: null,
      nombre: '',
      apellido: '',
      numero_telefono: '',
      rol_id: null,
      debe_cambiar_pin: false,
    };
    let message = '';
    let isEditing = false;
  
    // Fetch all users and roles
    async function fetchData() {
      const usersRes = await fetch('/api/admin/users');
      users = await usersRes.json();
  
      const rolesRes = await fetch('/api/admin/roles');
      roles = await rolesRes.json();
    }
  
    // Add or edit a user
    async function saveUser() {
      const endpoint = isEditing ? `/api/admin/users/${form.id}` : '/api/admin/users';
      const method = isEditing ? 'PUT' : 'POST';
  
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const result = await response.json();
      if (response.ok) {
        message = result.message;
        fetchData();
        resetForm();
      } else {
        message = result.message || 'Failed to save user';
      }
    }
  
    // Delete a user
    async function deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
          message = 'User deleted successfully';
          fetchData();
        } else {
          message = 'Failed to delete user';
        }
      }
    }
  
    // Reset form for new user
    function resetForm() {
      form = {
        id: null,
        nombre: '',
        apellido: '',
        numero_telefono: '',
        rol_id: null,
        debe_cambiar_pin: false,
      };
      isEditing = false;
    }
  
    // Edit an existing user
    function editUser(user) {
      form = { ...user };
      isEditing = true;
    }
  
    onMount(fetchData);
  </script>
  
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    <div class="bg-white shadow-md rounded w-full max-w-4xl p-6 mb-6">
      <h2 class="text-2xl font-bold mb-4">{isEditing ? 'Edit User' : 'Add User'}</h2>
      <form on:submit|preventDefault={saveUser} class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" bind:value={form.nombre} class="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label for="apellido" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" bind:value={form.apellido} class="w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <div>
          <label for="numero_telefono" class="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="text" bind:value={form.numero_telefono} class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label for="rol_id" class="block text-sm font-medium text-gray-700">Role</label>
          <select bind:value={form.rol_id} class="w-full border rounded px-3 py-2" required>
            <option value="" disabled>Select Role</option>
            {#each roles as role}
              <option value={role.id}>{role.nombre_rol}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="inline-flex items-center">
            <input type="checkbox" bind:checked={form.debe_cambiar_pin} class="mr-2" />
            Force Password Reset
          </label>
        </div>
        <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          {isEditing ? 'Update User' : 'Add User'}
        </button>
        {#if isEditing}
          <button on:click={resetForm} type="button" class="ml-4 bg-gray-300 py-2 px-4 rounded hover:bg-gray-400">
            Cancel
          </button>
        {/if}
      </form>
      {#if message}
        <p class="mt-4 text-green-500">{message}</p>
      {/if}
    </div>
  
    <div class="bg-white shadow-md rounded w-full max-w-4xl p-6">
      <h2 class="text-2xl font-bold mb-4">Users</h2>
      <table class="table-auto w-full text-left border">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Phone</th>
            <th class="px-4 py-2">Role</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr class="border-t">
              <td class="px-4 py-2">{user.nombre} {user.apellido}</td>
              <td class="px-4 py-2">{user.numero_telefono}</td>
              <td class="px-4 py-2">{roles.find(r => r.id === user.rol_id)?.nombre_rol || 'N/A'}</td>
              <td class="px-4 py-2">
                <button on:click={() => editUser(user)} class="text-blue-600 mr-2">Edit</button>
                <button on:click={() => deleteUser(user.id)} class="text-red-600">Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  