<script>
    const menuOptions = [
      { label: 'Dashboard', href: '/' },
      { label: 'Profile', href: '/' },
      { label: 'Change PIN', href: '/change-pin' },
      { label: 'Logout', href: '/' },
    ];
  </script>
  
  <div class="flex flex-col items-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-20">
      <h2 class="text-2xl font-bold mb-4 text-center">Menu</h2>
      <ul class="space-y-3">
        {#each menuOptions as option}
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
  