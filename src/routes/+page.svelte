<script>
  let numero_telefono = '';
  let pin = '';
  let message = '';

  async function login() {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ numero_telefono, pin }),
    });

    const result = await response.json();

    if (!response.ok) {
      message = result.message;
      return;
    }

    // Redirect to "Change PIN" page if required
    if (result.user.debe_cambiar_pin) {
      message = 'You need to change your PIN.';
      window.location.href = '/change-pin'; // Redirect to "Change PIN" page
      return;
    }

    message = result.message || 'Login successful!';
    window.location.href = '/menu'; // Redirect to the dashboard after successful login
  } catch (err) {
    message = 'An error occurred. Please try again.';
  }
}

</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

    <form on:submit|preventDefault={login} class="space-y-4">
      <div>
        <label for="numero_telefono" class="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          id="numero_telefono"
          bind:value={numero_telefono}
          placeholder="Enter your phone number"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label for="pin" class="block text-sm font-medium text-gray-700">PIN</label>
        <input
          type="password"
          id="pin"
          bind:value={pin}
          placeholder="Enter your PIN"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Login
      </button>
    </form>

    {#if message}
      <p
        class="mt-4 text-center text-sm font-medium text-{message.includes('successful') ? 'green-600' : 'red-600'}"
      >
        {message}
      </p>
    {/if}
  </div>
</div>
