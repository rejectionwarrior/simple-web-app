// auth.js
// Frontend auth controller for the Simple Web App.
//
// What this file does:
// - switches between login / signup / reset / logged-in views
// - sends auth requests to the backend
// - stores the session token after login
// - validates the stored token on page load
// - reveals Post 2 only when the session is actually valid

const BACKEND_URL = 'https://simple-web-app-backend-xcfr.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  // ================================
  // DOM REFERENCES
  // ================================
  // Grouping all DOM lookups in one place makes the file easier to edit later.
  const views = {
    login: document.getElementById('login-form'),
    signup: document.getElementById('signup-form'),
    reset: document.getElementById('reset-form'),
    loggedIn: document.getElementById('logged-in-view')
  };

  const elements = {
    // Login form
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginButton: document.getElementById('login-button'),
    loginStatus: document.getElementById('login-status'),

    // Signup form
    signupEmail: document.getElementById('signup-email'),
    signupPassword: document.getElementById('signup-password'),
    signupButton: document.getElementById('signup-button'),
    signupStatus: document.getElementById('signup-status'),

    // Reset form
    resetEmail: document.getElementById('reset-email'),
    resetButton: document.getElementById('reset-button'),
    resetStatus: document.getElementById('reset-status'),

    // Logged-in view
    logoutButton: document.getElementById('logout-button'),
    loggedInLabel: document.getElementById('logged-in-label'),

    // Post 2 is the “protected” section
    post2: document.getElementById('post-2'),
    post2Button: document.getElementById('post-2-button'),

    // Navigation links between auth forms
    showSignup: document.getElementById('show-signup'),
    showReset: document.getElementById('show-reset'),
    showLoginFromSignup: document.getElementById('show-login-from-signup'),
    showLoginFromReset: document.getElementById('show-login-from-reset')
  };

  // ================================
  // SMALL HELPERS
  // ================================

  // Show exactly one auth-related view at a time.
  // Valid view names: 'login', 'signup', 'reset', 'loggedIn'
  function showOnly(viewName) {
    Object.values(views).forEach(view => {
      if (view) view.classList.add('hidden');
    });

    if (views[viewName]) {
      views[viewName].classList.remove('hidden');
    }
  }

  // Standard way to show messages.
  // type can be:
  // - 'success'
  // - 'error'
  // - undefined (neutral/loading)
  function setStatus(element, message, type) {
    if (!element) return;

    element.textContent = message || '';
    element.classList.remove('hidden', 'success', 'error');

    // If there is no message, keep the area hidden.
    if (!message) {
      element.classList.add('hidden');
      return;
    }

    if (type) {
      element.classList.add(type);
    }
  }

  // Clear all visible status messages across forms.
  function clearStatusMessages() {
    setStatus(elements.loginStatus, '');
    setStatus(elements.signupStatus, '');
    setStatus(elements.resetStatus, '');
  }

  // Clear only the login inputs.
  function clearLoginInputs() {
    if (elements.loginEmail) elements.loginEmail.value = '';
    if (elements.loginPassword) elements.loginPassword.value = '';
  }

  // Protect or unprotect Post 2.
  // This keeps auth-related content hidden until a valid session exists.
  function setPost2Access(enabled) {
    if (elements.post2) {
      elements.post2.classList.toggle('hidden', !enabled);
    }

    if (elements.post2Button) {
      elements.post2Button.disabled = !enabled;
      elements.post2Button.classList.toggle('active', enabled);
    }
  }

  // Remove locally stored session data.
  // Useful when logout succeeds OR when token validation fails.
  function clearSession() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_email');
  }

  // Read the saved token.
  function getStoredToken() {
    return localStorage.getItem('session_token');
  }

  // Read the saved email.
  function getStoredEmail() {
    return localStorage.getItem('user_email');
  }

  // ================================
  // UI STATE APPLIERS
  // ================================

  // Logged-out UI:
  // - show login form
  // - hide protected content
  // - clear temporary login fields/messages
  function applyLoggedOutState() {
    clearStatusMessages();
    clearLoginInputs();
    setPost2Access(false);
    showOnly('login');
  }

  // Logged-in UI:
  // - show logged-in panel
  // - reveal protected content
  // - show user email if available
  function applyLoggedInState(emailFromServer) {
    clearStatusMessages();

    const email = emailFromServer || getStoredEmail();

    if (elements.loggedInLabel) {
      elements.loggedInLabel.textContent = email
        ? `Logged in as ${email}`
        : 'Logged in';
    }

    setPost2Access(true);
    showOnly('loggedIn');
  }

  // ================================
  // BACKEND REQUEST HELPERS
  // ================================

  // Generic POST helper for JSON endpoints.
  // This reduces duplicate fetch logic.
  async function postJson(path, payload, token) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {})
    });

    // Try to parse JSON safely.
    const data = await response.json().catch(() => ({}));

    return { response, data };
  }

  // Generic GET helper for endpoints that only need a token.
  async function getWithToken(path, token) {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json().catch(() => ({}));

    return { response, data };
  }

  // ================================
  // SESSION VALIDATION
  // ================================
  // This is the real fix for the "token thing".
  //
  // Old behavior:
  // - if a token existed in localStorage, the app assumed the user was logged in
  //
  // New behavior:
  // - the app sends the token to the backend
  // - the backend confirms whether it is still valid
  // - only then does the app unlock Post 2 and show logged-in UI
  async function validateSessionOnLoad() {
    const token = getStoredToken();

    // No token = definitely logged out
    if (!token) {
      applyLoggedOutState();
      return;
    }

    // Show a temporary loading state while checking the saved session.
    setStatus(elements.loginStatus, 'Checking saved session...');

    try {
      // IMPORTANT:
      // This requires your backend to expose GET /auth/me
      // and validate the bearer token.
      const { response, data } = await getWithToken('/auth/me', token);

      if (!response.ok) {
        // Token is bad / expired / invalid
        clearSession();
        applyLoggedOutState();
        setStatus(elements.loginStatus, 'Your session expired. Please log in again.', 'error');
        return;
      }

      // If the backend returns a verified user email, keep it in localStorage
      // so the UI can display it later.
      if (data?.user?.email) {
        localStorage.setItem('user_email', data.user.email);
      }

      applyLoggedInState(data?.user?.email);
    } catch (error) {
      // If the backend is unreachable, we should NOT trust the token blindly.
      clearSession();
      applyLoggedOutState();
      setStatus(elements.loginStatus, 'Could not verify your saved session. Please log in again.', 'error');
    }
  }

  // ================================
  // AUTH ACTIONS
  // ================================

  async function handleLogin() {
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;

    if (!email || !password) {
      setStatus(elements.loginStatus, 'Please enter your email and password.', 'error');
      return;
    }

    setStatus(elements.loginStatus, 'Logging in...');

    try {
      const { response, data } = await postJson('/auth/login', { email, password });

      if (!response.ok) {
        setStatus(elements.loginStatus, data.error || 'Login failed.', 'error');
        return;
      }

      // Save the session token returned by the backend.
      localStorage.setItem('session_token', data.session.access_token);
      localStorage.setItem('user_email', email);

      setStatus(elements.loginStatus, 'Login successful.', 'success');

      // Move to the verified logged-in UI.
      setTimeout(() => applyLoggedInState(email), 300);
    } catch (error) {
      setStatus(elements.loginStatus, 'Could not reach the server. Please try again.', 'error');
    }
  }

  async function handleSignup() {
    const email = elements.signupEmail.value.trim();
    const password = elements.signupPassword.value;

    if (!email || !password) {
      setStatus(elements.signupStatus, 'Please enter an email and password.', 'error');
      return;
    }

    if (password.length < 6) {
      setStatus(elements.signupStatus, 'Password must be at least 6 characters.', 'error');
      return;
    }

    setStatus(elements.signupStatus, 'Creating account...');

    try {
      const { response, data } = await postJson('/auth/signup', { email, password });

      if (!response.ok) {
        setStatus(elements.signupStatus, data.error || 'Signup failed.', 'error');
        return;
      }

      setStatus(elements.signupStatus, 'Account created! You can now log in above.', 'success');

      elements.signupEmail.value = '';
      elements.signupPassword.value = '';
    } catch (error) {
      setStatus(elements.signupStatus, 'Could not reach the server. Please try again.', 'error');
    }
  }

  async function handleResetPassword() {
    const email = elements.resetEmail.value.trim();

    if (!email) {
      setStatus(elements.resetStatus, 'Please enter your email address.', 'error');
      return;
    }

    setStatus(elements.resetStatus, 'Sending reset email...');

    try {
      const { response, data } = await postJson('/auth/reset-password', { email });

      if (!response.ok) {
        setStatus(elements.resetStatus, data.error || 'Reset failed.', 'error');
        return;
      }

      setStatus(elements.resetStatus, 'Reset email sent! Check your inbox.', 'success');
      elements.resetEmail.value = '';
    } catch (error) {
      setStatus(elements.resetStatus, 'Could not reach the server. Please try again.', 'error');
    }
  }

  async function handleLogout() {
    const token = getStoredToken();

    if (token) {
      try {
        await postJson('/auth/logout', {}, token);
      } catch (error) {
        // Even if the network request fails, we still clear local session data
        // so the user is logged out locally.
        console.warn('Logout request failed.');
      }
    }

    clearSession();
    applyLoggedOutState();
  }

  // ================================
  // EVENT LISTENERS
  // ================================

  elements.showSignup?.addEventListener('click', event => {
    event.preventDefault();
    clearStatusMessages();
    showOnly('signup');
  });

  elements.showReset?.addEventListener('click', event => {
    event.preventDefault();
    clearStatusMessages();
    showOnly('reset');
  });

  elements.showLoginFromSignup?.addEventListener('click', event => {
    event.preventDefault();
    clearStatusMessages();
    showOnly('login');
  });

  elements.showLoginFromReset?.addEventListener('click', event => {
    event.preventDefault();
    clearStatusMessages();
    showOnly('login');
  });

  elements.loginButton?.addEventListener('click', handleLogin);
  elements.signupButton?.addEventListener('click', handleSignup);
  elements.resetButton?.addEventListener('click', handleResetPassword);
  elements.logoutButton?.addEventListener('click', handleLogout);

  // Allow Enter key to submit login form quickly.
  elements.loginPassword?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  });

  // ================================
  // INITIAL APP BOOT
  // ================================
  validateSessionOnLoad();
});
