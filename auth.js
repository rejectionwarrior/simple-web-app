// Simple client-side authentication for demo purposes only.
// Mock credentials (in a real app, authenticate on the server).
document.addEventListener('DOMContentLoaded', () => {
  const DEMO_USERNAME = 'user';
  const DEMO_PASSWORD = 'pass';

  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const authButton = document.getElementById('auth-button');
  const statusMessage = document.getElementById('status-message');
  const post2 = document.getElementById('post-2');

  function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  function setLoggedIn(value) {
    localStorage.setItem('loggedIn', value ? 'true' : 'false');
  }

  function clearInputs() {
    usernameInput.value = '';
    passwordInput.value = '';
  }

  function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.classList.remove('hidden', 'success', 'error');
    statusMessage.classList.add(type);
  }

  function hideMessage() {
    statusMessage.textContent = '';
    statusMessage.classList.add('hidden');
    statusMessage.classList.remove('success', 'error');
  }

  function renderUI() {
    if (isLoggedIn()) {
      loginForm.classList.add('hidden');
      authButton.textContent = 'Log out';
      authButton.classList.remove('hidden');
      statusMessage.classList.remove('hidden', 'error');
      statusMessage.classList.add('success');
      statusMessage.textContent = "You're in! Now you can see what else I've been up to.";
      post2.classList.remove('hidden');
    } else {
      loginForm.classList.remove('hidden');
      authButton.textContent = 'Login';
      authButton.classList.remove('hidden');
      hideMessage();
      post2.classList.add('hidden');
      clearInputs();
    }
  }

  authButton.addEventListener('click', () => {
    if (isLoggedIn()) {
      localStorage.removeItem('loggedIn');
      renderUI();
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      setLoggedIn(true);
      renderUI();
    } else {
      showMessage('Incorrect username or password.', 'error');
    }
  });

  renderUI();
});
