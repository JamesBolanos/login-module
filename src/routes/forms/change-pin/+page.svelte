<script>
  import { goto } from '$app/navigation'; // Import the goto function
  let newPin = '';
  let confirmNewPin = '';
  let errorMessage = '';

  const changePin = async () => {
    if (newPin !== confirmNewPin) {
      errorMessage = 'PINs do not match';
      return;
    }

    try {
      const response = await fetch('/api/change-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPin, // Ensure this matches the expected API key
          confirmNewPin, // Ensure this matches the expected API key
        }),
      });

      if (response.ok) {
        window.location.href = '/menu'; // Redirect after success
      } else {
        const data = await response.json();
        errorMessage = data.message || 'Failed to change PIN.';
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred. Please try again later.';
    }
  };

</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <form
    class="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
    on:submit|preventDefault={changePin}
  >
    <h2 class="text-2xl font-bold mb-4 text-center">Change Your PIN</h2>
    <div class="mb-4">
      <label for="newPin" class="block text-gray-700 font-medium mb-2">
        Enter Your New PIN:
      </label>
      <input
        type="password"
        id="newPin"
        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={newPin}
      />
    </div>
    <div class="mb-4">
      <label for="confirmNewPin" class="block text-gray-700 font-medium mb-2">
        Confirm Your New PIN:
      </label>
      <input
        type="password"
        id="confirmNewPin"
        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={confirmNewPin}
      />
    </div>
    {#if errorMessage}
      <p class="text-red-500 text-sm mb-4">{errorMessage}</p>
    {/if}
    <button
      type="submit"
      class="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600"
    >
      Change PIN
    </button>
  </form>
</div>
