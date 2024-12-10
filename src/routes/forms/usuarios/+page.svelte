<script>
  import { onMount } from 'svelte';

  let usuarios = [];
  let roles = [];
  let currentUser = {};
  let showForm = false;
  let message = '';

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/db/usuarios');
      if (response.ok) {
        usuarios = await response.json();
      } else {
        console.error('Failed to fetch usuarios:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching usuarios:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/db/roles');
      if (response.ok) {
        roles = await response.json();
      } else {
        console.error('Failed to fetch roles:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const saveUser = async () => {
    const method = currentUser.id ? 'PUT' : 'POST';
    try {
      const response = await fetch('/api/db/usuarios', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      });

      if (response.ok) {
        await fetchUsuarios();
        showForm = false;
        currentUser = {};
        message = 'User saved successfully!';
      } else {
        const data = await response.json();
        message = data.message || 'Failed to save user.';
      }
    } catch (err) {
      console.error('Error saving user:', err);
      message = 'An error occurred while saving the user.';
    }
  };

  const editUser = (user) => {
    currentUser = { ...user };
    showForm = true;
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`/api/db/usuarios/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchUsuarios();
        message = 'User deleted successfully!';
      } else {
        const data = await response.json();
        message = data.message || 'Failed to delete user.';
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      message = 'An error occurred while deleting the user.';
    }
  };

  onMount(async () => {
    await fetchUsuarios();
    await fetchRoles();
  });
</script>

<div class="container mx-auto mt-8">
  <h1 class="text-3xl font-bold text-center mb-6">Usuarios</h1>

  {#if message}
    <p class="text-green-500 text-center mb-4">{message}</p>
  {/if}

  <div class="flex justify-center mb-4">
    <button
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      on:click={() => { showForm = true; currentUser = {}; }}
    >
      Add User
    </button>
  </div>

  {#if showForm}
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
      <form on:submit|preventDefault={saveUser}>
        <div class="mb-4">
          <label for="nombre" class="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
          <input
            type="text"
            id="nombre"
            bind:value={currentUser.nombre}
            placeholder="Nombre"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label for="apellido" class="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
          <input
            type="text"
            id="apellido"
            bind:value={currentUser.apellido}
            placeholder="Apellido"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label for="telefono" class="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
          <input
            type="text"
            id="telefono"
            bind:value={currentUser.numero_telefono}
            placeholder="Teléfono"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label for="rol" class="block text-gray-700 text-sm font-bold mb-2">Rol</label>
          <select
            id="rol"
            bind:value={currentUser.rol_id}
            required
            class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>Select a role</option>
            {#each roles as role}
              <option value={role.id}>{role.nombre_rol}</option>
            {/each}
          </select>
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <button
            type="button"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            on:click={() => { showForm = false; currentUser = {}; }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  {/if}

  <table class="table-auto w-full bg-white shadow-md rounded mb-4">
    <thead>
      <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
        <th class="py-3 px-6 text-left">Nombre</th>
        <th class="py-3 px-6 text-left">Apellido</th>
        <th class="py-3 px-6 text-left">Teléfono</th>
        <th class="py-3 px-6 text-left">Rol</th>
        <th class="py-3 px-6 text-center">Actions</th>
      </tr>
    </thead>
    <tbody class="text-gray-600 text-sm font-light">
      {#each usuarios as usuario}
        <tr class="border-b border-gray-200 hover:bg-gray-100">
          <td class="py-3 px-6 text-left">{usuario.nombre}</td>
          <td class="py-3 px-6 text-left">{usuario.apellido}</td>
          <td class="py-3 px-6 text-left">{usuario.numero_telefono}</td>
          <td class="py-3 px-6 text-left">{usuario.nombre_rol}</td>
          <td class="py-3 px-6 text-center">
            <button
              class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded"
              on:click={() => editUser(usuario)}
            >
              Edit
            </button>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded ml-2"
              on:click={() => deleteUser(usuario.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
