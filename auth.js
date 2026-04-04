// auth.js — connects to the Express/Supabase backend

const BACKEND_URL = 'https://simple-web-app-backend-xcfr.onrender.com';

// ── DOM references ──────────────────────────────────────────────────────────
const loginForm     = document.getElementById('login-form');
const loggedInView  = document.getElementById('logged-in-view');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authButton    = document.getElementById('auth-button');
const logoutButton  = document.getElementById('logout-button');
const statusMsg     = document.getElementById('status-message');
const post2         = document.getElementById('post-2');
const post2Button   = document.getElementById('post-2-button');

// ── Apply auth state to the UI ──────────────────────────────────────────────
function applyAuthState(loggedIn) {
  if (loggedIn) {
    showForm('logged-in-view');
    post2.classList.remove('hidden');
    if (post2Button) { post2Button.classList.add('active'); post2Button.disabled = false; }
  } else {
    showForm('login-form');
    post2.classList.add('hidden');
    if (post2Button) { post2Button.classList.remove('active'); post2Button.disabled = true; }
    statusMsg.textContent = '';
    statusMsg.className = 'status';
    usernameInput.value = '';
    passwordInput.value = '';
  }
}

// ── Login ───────────────────────────────────────────────────────────────────
async function handleLogin() {
  const email    = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    statusMsg.textContent = 'Please enter your email and password.';
    statusMsg.className = 'status error';
    return;
  }

  statusMsg.textContent = 'Logging in...';
  statusMsg.className = 'status';

  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      statusMsg.textContent = data.error || 'Login failed.';
      statusMsg.className = 'status error';
      return;
    }

    localStorage.setItem('session_token', data.session.access_token);
    localStorage.setItem('user_email', email);
    statusMsg.textContent = 'Login successful.';
    statusMsg.className = 'status success';
    setTimeout(() => applyAuthState(true), 300);

  } catch (err) {
    statusMsg.textContent = 'Could not reach the server. Please try again.';
    statusMsg.className = 'status error';
  }
}

// ── Logout ──────────────────────────────────────────────────────────────────
async function handleLogout() {
  const token = localStorage.getItem('session_token');

  if (token) {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }
  }

  localStorage.removeItem('session_token');
  localStorage.removeItem('user_email');
  applyAuthState(false);
}
// ── Signup ──────────────────────────────────────────────────────────────────
async function handleSignup() {
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const status   = document.getElementById('signup-status');

  if (!email || !password) {
    status.textContent = 'Please enter an email and password.';
    status.className = 'status error';
    return;
  }

  if (password.length < 6) {
    status.textContent = 'Password must be at least 6 characters.';
    status.className = 'status error';
    return;
  }

  status.textContent = 'Creating account...';
  status.className = 'status';

  try {
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      status.textContent = data.error || 'Signup failed.';
      status.className = 'status error';
      return;
    }

    status.textContent = 'Account created! You can now log in above.';
    status.className = 'status success';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';

  } catch (err) {
    status.textContent = 'Could not reach the server. Please try again.';
    status.className = 'status error';
  }
}

// ── Password Reset ───────────────────────────────────────────────────────────
async function handleResetPassword() {
  const email  = document.getElementById('reset-email').value.trim();
  const status = document.getElementById('reset-status');

  if (!email) {
    status.textContent = 'Please enter your email address.';
    status.className = 'status error';
    return;
  }

  status.textContent = 'Sending reset email...';
  status.className = 'status';

  try {
    const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      status.textContent = data.error || 'Reset failed.';
      status.className = 'status error';
      return;
    }

    status.textContent = 'Reset email sent! Check your inbox.';
    status.className = 'status success';
    document.getElementById('reset-email').value = '';

  } catch (err) {
    status.textContent = 'Could not reach the server. Please try again.';
    status.className = 'status error';
  }
}

// ── Event listeners ─────────────────────────────────────────────────────────
// ── Form switching ───────────────────────────────────────────────────────────
function showForm(formToShow) {
  const forms = ['login-form', 'signup-form', 'reset-form', 'logged-in-view'];
  forms.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(formToShow);
  if (target) target.classList.remove('hidden');
}

document.getElementById('show-signup').addEventListener('click', e => {
  e.preventDefault();
  showForm('signup-form');
});
document.getElementById('show-reset').addEventListener('click', e => {
  e.preventDefault();
  showForm('reset-form');
});
document.getElementById('show-login-from-signup').addEventListener('click', e => {
  e.preventDefault();
  showForm('login-form');
});
document.getElementById('show-login-from-reset').addEventListener('click', e => {
  e.preventDefault();
  showForm('login-form');
});
document.getElementById('signup-button').addEventListener('click', handleSignup);
document.getElementById('reset-button').addEventListener('click', handleResetPassword);
authButton.addEventListener('click', handleLogin);
logoutButton.addEventListener('click', handleLogout);
passwordInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') handleLogin();
});

// ── Restore session on load ─────────────────────────────────────────────────
const token = localStorage.getItem('session_token');
applyAuthState(!!token);
