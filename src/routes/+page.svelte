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
        message = result.message || 'Login failed';
      } catch (err) {
        message = 'Error: ' + err.message;
      }
    }
  </script>
  
  <h1>Login</h1>
  <form on:submit|preventDefault={login}>
    <label for="numero_telefono">Phone Number:</label>
    <input type="text" id="numero_telefono" bind:value={numero_telefono} required />
  
    <label for="pin">PIN:</label>
    <input type="password" id="pin" bind:value={pin} required />
  
    <button type="submit">Login</button>
  </form>
  
  {#if message}
    <p>{message}</p>
  {/if}
  