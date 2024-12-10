<script>
    import { onMount } from 'svelte';
    let roles = [];
  
    const fetchRoles = async () => {
      const response = await fetch('/api/db/roles');
      roles = await response.json();
    };
  
    onMount(fetchRoles);
  </script>
  
  <div class="container">
    <h1>Roles</h1>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {#each roles as role}
          <tr>
            <td>{role.nombre_rol}</td>
            <td>{role.descripcion}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  