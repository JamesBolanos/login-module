<script>
  export let userRole; // Role passed from the load function

  // Define all menu options with their accessible roles
  const menuOptions = [
    { label: 'Option 1', href: '/', roles: ['Admin', 'Inventario', 'Sales'] },
    { label: 'Option 2', href: '/', roles: ['Admin', 'Inventario'] },
    { label: 'Usuarios', href: '../forms/usuarios', roles: ['Admin'] },
    { label: 'Roles', href: '../forms/roles', roles: ['Admin'] },
    { label: 'Change PIN', href: '../forms/change-pin', roles: ['Admin', 'Inventario', 'Sales'] },
    { label: 'Logout', href: '../api/auth/logout', roles: ['Admin', 'Inventario', 'Sales'] },
  ];

  // Filter menu options based on the user's role
  $: visibleMenuOptions = menuOptions.filter(option => option.roles.includes(userRole));
</script>

<div class="flex flex-col items-center min-h-screen bg-gray-100">
  <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-20">
    <h2 class="text-2xl font-bold mb-4 text-center">Menu</h2>
    <ul class="space-y-3">
      {#each visibleMenuOptions as option}
        <li>
          <a
            href={option.href}
            class="block text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            {option.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
