// Simple client-side authentication for demo purposes only.
// Mock credentials (in a real app, authenticate on the server).
const CREDENTIALS = { username: 'user', password: 'pass' };

function $(id) { return document.getElementById(id); }

function showProtected() {
  $('login-section').style.display = 'none';
}

function showLogin() {
  $('login-section').style.display = 'block';
}

function setSession(username) {
  localStorage.setItem('simpleWebAppUser', username);
}

function clearSession() {
  localStorage.removeItem('simpleWebAppUser');
}

function getSession() {
  return localStorage.getItem('simpleWebAppUser');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  const loginForm = $('login-form');
  const loginError = $('login-error');
  const post2 = $('post-2');
  const post3 = $('post-3');
  const unlockNextButton = $('unlock-next');
  const loggedInStatus = document.createElement('p');
  loggedInStatus.id = 'logged-in-status';
  loggedInStatus.style.display = 'none';
  loggedInStatus.style.marginTop = '12px';
  loggedInStatus.style.color = '#16a34a';
  loggedInStatus.textContent = "You're in! Now you can see what else I've been up to";

  // Update the reference to the hardcoded button in the HTML
  const loginLogoutButton = $('login-logout-button');

  // Force the button to remain visible for debugging
  loginLogoutButton.style.display = 'block';
  console.log('Button visibility forced to block');

  // Add persistent debugging to track button state
  setInterval(() => {
    const button = document.getElementById('login-logout-button');
    if (button) {
      console.log('Button is in the DOM and its display is:', button.style.display);
    } else {
      console.log('Button is not in the DOM');
    }
  }, 1000); // Log every second

  function updateButtonState() {
    console.log('Update Button State Called');
    console.log('Session:', getSession());

    loginLogoutButton.style.display = 'block'; // Ensure button is always visible
    loginLogoutButton.textContent = getSession() ? 'Log out' : 'Log in';

    loginLogoutButton.onclick = (e) => {
      e.preventDefault();
      if (getSession()) {
        console.log('Logging out');
        clearSession();
        $('username').value = '';
        $('password').value = '';
        loggedInStatus.style.display = 'none';
        post2.style.display = 'none'; // Hide the second blog post
      } else {
        console.log('Attempting to log in');
        loginError.style.display = 'none';
        const username = $('username').value.trim();
        const password = $('password').value;

        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
          console.log('Login successful');
          setSession(username);
          loggedInStatus.style.display = 'block';
          post2.style.display = 'block'; // Show the second blog post
        } else {
          console.log('Login failed');
          loginError.style.display = 'block';
        }
      }
      updateButtonState();
    };
  }

  updateButtonState();

  loggedInStatus.appendChild(loginLogoutButton);
  loginForm.parentElement.appendChild(loggedInStatus);

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const username = $('username').value.trim();
    const password = $('password').value;

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setSession(username);
      loggedInStatus.style.display = 'block';
      post2.style.display = 'block';
    } else {
      loginError.style.display = 'block';
    }
  });

  // Cleaned up and implemented separate buttons for login and logout
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const username = $('username').value.trim();
    const password = $('password').value;

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      console.log('Login successful');
      setSession(username);
      loggedInStatus.style.display = 'block';
      post2.style.display = 'block'; // Show the second blog post
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
    } else {
      console.log('Login failed');
      loginError.style.display = 'block';
    }
  });

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Logging out');
    clearSession();
    $('username').value = '';
    $('password').value = '';
    loggedInStatus.style.display = 'none';
    post2.style.display = 'none'; // Hide the second blog post
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
  });

  // Initialize button visibility based on session
  if (getSession()) {
    loggedInStatus.style.display = 'block';
    post2.style.display = 'block';
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
  } else {
    loggedInStatus.style.display = 'none';
    post2.style.display = 'none';
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
  }

  unlockNextButton.addEventListener('click', () => {
    post3.style.display = 'block';
  });

  // Add an alert to confirm script execution
  alert('auth.js script loaded successfully');
});
