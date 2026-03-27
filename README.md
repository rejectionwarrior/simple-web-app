# Simple Web App

A simple front-end practice project with a demo login flow and conditional content visibility.

## What it does

- Displays Blog Post 1 by default
- Hides Blog Post 2 until the user logs in
- Uses predefined demo credentials
- Stores login state in `localStorage`
- Preserves the session after refresh until the user logs out

## Demo credentials

- Username: `user`
- Password: `pass`

## How it works

This project uses plain HTML, CSS, and JavaScript.

When the user logs in successfully:
- a success message appears
- the login action changes to log out
- Blog Post 2 becomes visible

When the user logs out:
- the session is cleared
- the success message is removed
- Blog Post 2 is hidden again

## Important note

This is a demo project only.

The login is handled entirely on the client side with JavaScript and `localStorage`, which means it is **not secure** and should not be used for real authentication.

## Files

- `index.html` — page structure and styling
- `auth.js` — demo login, logout, and session persistence
- `timeline.js` — unused right now
- `timeline-data.json` — unused right now

## Next improvements

- Replace placeholder content for Blog Post 2
- Remove unused timeline files or connect them properly
- Improve styling
- Add a real backend if authentication is ever needed
