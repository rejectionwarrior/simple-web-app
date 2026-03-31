# Simple Web App

## 1. README

### Project Overview
Simple Web App is a front-end demo project built as part of a challenge from my mentors. It gives me a place to practice login functionality, experiment with structure and interactivity, and document how my skills are developing over time.

This web app demonstrates:
- basic client-side login and logout behavior
- conditional content visibility
- session persistence using `localStorage`
- hybrid post rendering using HTML for interactive UI and JSON for post metadata

### Current Features
- A visible first post that includes a working simple login UI
- A second post that remains hidden until login succeeds
- Post metadata loaded from `timeline-data.json`
- Login state preserved across refresh until logout
- Styling separated into `styles.css`

### Current Limitations
- Post 2 is still in progress and currently uses placeholder text
- Its button is included for structure and future functionality, but it is not active yet

### Demo Credentials
- Username: `user`
- Password: `pass`

### File Structure
- `index.html` — page structure and interactive shells for posts
- `styles.css` — styling
- `auth.js` — login/logout behavior and session persistence
- `timeline.js` — loads post metadata from JSON into existing HTML sections
- `timeline-data.json` — post metadata such as date, title, description, tags, and optional button label

### Important Note
This is a demo project only. Authentication is handled entirely on the client side and is not secure for production use.

---

## 2. SyRS — System Requirements Specification

### 2.1 System Purpose
The system shall provide a small web-based demo environment for presenting login-related UI examples and conditional post visibility behavior.

### 2.2 System Scope
The system includes:
- one browser-based user interface
- one simple login flow
- one hidden post revealed after successful login
- client-side session persistence
- post metadata loading from a JSON data source

The system does not include:
- server-side authentication
- database storage
- secure credential management
- external identity providers
- role-based access control

### 2.3 System Functional Requirements
The system shall:
- display Post 1 on initial page load
- hide Post 2 until login succeeds
- accept a predefined username and password
- show a success state after valid login
- allow the user to log out
- preserve login state across page refresh using browser storage
- load post metadata from a JSON file
- populate HTML post shells using JavaScript and JSON metadata

### 2.4 System Non-Functional Requirements
The system shall:
- run in a modern web browser
- load without requiring a backend server
- be understandable as a training/demo application
- separate structure, styling, data, and logic across appropriate files
- remain maintainable for future demo expansions

### 2.5 Constraints
- The system shall be hosted as a static site
- Authentication shall remain client-side only in the current version
- Browser `localStorage` shall be used for session persistence

### 2.6 Assumptions
- The user has JavaScript enabled
- The browser supports `fetch` and `localStorage`
- The JSON file is accessible from the deployed site

---

## 3. SyAD — System Architecture Description

### 3.1 System Overview
The system is a static web application composed of:
- HTML for structure
- CSS for presentation
- JavaScript for behavior and data loading
- JSON for post metadata

### 3.2 Major Components

#### User Interface Layer
Implemented in `index.html` and `styles.css`.

Provides:
- page structure
- post containers
- login form shell
- hidden/visible sections
- styling for cards, inputs, buttons, and tags

#### Authentication Logic Layer
Implemented in `auth.js`.

Provides:
- credential validation against predefined values
- login state management
- logout behavior
- update of visible/hidden UI regions
- session persistence using `localStorage`

#### Metadata Loading Layer
Implemented in `timeline.js`.

Provides:
- loading of `timeline-data.json`
- parsing post metadata
- populating Post 1 and Post 2 metadata placeholders

#### Data Layer
Implemented in `timeline-data.json`.

Provides:
- post identifiers
- dates
- titles
- descriptions
- skills/tags
- optional button label values

### 3.3 Data Flow
1. Browser loads `index.html`
2. `styles.css` applies styling
3. `timeline.js` loads `timeline-data.json`
4. `timeline.js` populates post metadata placeholders in the HTML
5. `auth.js` checks `localStorage` for login state
6. `auth.js` updates visible content accordingly

### 3.4 Deployment View
The system is deployed as a static web application and can be hosted on GitHub Pages.

---

## 4. SwRSAD — Software Requirements Specification and Architecture Description

### 4.1 Software Purpose
The software shall provide a front-end-only demonstration of login-related UI behavior and data-driven post metadata rendering.

### 4.2 Software Requirements
The software shall:
- load and render Post 1 content shell from HTML
- load Post 1 metadata from JSON
- load and render Post 2 metadata from JSON
- allow login using predefined credentials
- reveal Post 2 after login
- hide Post 2 after logout
- preserve login state across reload
- populate tag elements dynamically from JSON arrays
- populate Post 2 button label from JSON where applicable

### 4.3 Software Design

#### `index.html`
Contains:
- post shells
- login inputs and buttons
- placeholders for metadata fields
- script and stylesheet references

#### `styles.css`
Contains:
- layout styling
- card styling
- input/button styling
- hidden state styling
- tag/skill styling

#### `auth.js`
Contains:
- login credential check
- login state evaluation
- logout handling
- conditional display logic

#### `timeline.js`
Contains:
- date formatting
- skills/tag rendering
- metadata injection into post shells
- JSON loading and post lookup by `id`

#### `timeline-data.json`
Contains structured metadata records keyed by `id`.

### 4.4 Interface Definitions

#### HTML to JS Interface
Elements are referenced by IDs such as:
- `post-1-title`
- `post-1-description`
- `post-2-button`
- `auth-button`
- `status-message`

#### JSON to JS Interface
Each post object may contain:
- `id`
- `date`
- `title`
- `description`
- `skills`
- `buttonLabel`

### 4.5 Limitations
- Authentication is not secure
- No backend exists
- No real account creation, forgot password, or advanced identity integration is implemented

---

## 5. SyTD — System Test Description

### 5.1 Test Objective
Verify that the overall system behaves as intended from an end-user perspective.

### 5.2 Test Environment
- Static deployment in browser
- JavaScript enabled
- Access to `timeline-data.json`
- Browser supports `localStorage`

### 5.3 System Test Scenarios

#### ST-01 Initial Load
Verify that the page loads successfully and displays Post 1.

#### ST-02 Metadata Population
Verify that Post 1 and Post 2 metadata are loaded from JSON and injected into the page.

#### ST-03 Hidden Post Protection
Verify that Post 2 is hidden before login.

#### ST-04 Valid Login
Verify that correct credentials reveal Post 2 and show success state.

#### ST-05 Invalid Login
Verify that incorrect credentials produce an error message and do not reveal Post 2.

#### ST-06 Logout
Verify that logout clears session state and hides Post 2 again.

#### ST-07 Session Persistence
Verify that page refresh preserves logged-in state while `localStorage` indicates login.

#### ST-08 Styling Separation
Verify that page styling is correctly loaded from `styles.css`.

---

## 6. SwTD — Software Test Description

### 6.1 Test Cases

#### SWT-01 JSON Load Success
Input: valid `timeline-data.json`  
Expected Result: post metadata is loaded and inserted into placeholder elements

#### SWT-02 Missing JSON Field
Input: JSON object missing optional field such as `buttonLabel`  
Expected Result: page remains functional without crashing

#### SWT-03 Post Lookup by ID
Input: `post-1` and `post-2` IDs present in JSON  
Expected Result: `timeline.js` successfully finds matching objects and populates correct fields

#### SWT-04 Login Success
Input: username=`user`, password=`pass`  
Expected Result:
- login state set in `localStorage`
- success message shown
- Post 2 revealed
- button state updated

#### SWT-05 Login Failure
Input: invalid credentials  
Expected Result:
- no login state stored
- error message shown
- Post 2 remains hidden

#### SWT-06 Logout Success
Input: click logout while logged in  
Expected Result:
- login state removed or set false
- Post 2 hidden
- form restored

#### SWT-07 Refresh While Logged In
Precondition: valid login completed  
Action: refresh browser  
Expected Result: logged-in UI restored from stored session state

#### SWT-08 Tag Rendering
Input: `skills` array in JSON  
Expected Result: each skill displayed as a rendered tag

---

## 7. SyTR — System Test Report

### 7.1 Test Summary
System testing was performed on the static web application to verify page loading, metadata population, login behavior, conditional visibility, and session persistence.

### 7.2 Results

#### ST-01 Initial Load
Result: Pass  
Post 1 loads on initial page visit.

#### ST-02 Metadata Population
Result: Pass  
Post metadata is populated from JSON into HTML placeholders.

#### ST-03 Hidden Post Protection
Result: Pass  
Post 2 remains hidden before login.

#### ST-04 Valid Login
Result: Pass  
Successful login reveals Post 2 and updates the interface.

#### ST-05 Invalid Login
Result: Pass  
Incorrect credentials prevent access and show an error state.

#### ST-06 Logout
Result: Pass  
Logout returns the system to the logged-out state.

#### ST-07 Session Persistence
Result: Pass  
Refresh while logged in preserves session state.

#### ST-08 Styling Separation
Result: Pass  
Styles load from external CSS file.

### 7.3 Observations
- The system works as a front-end demo
- The system is not suitable for real authentication use
- Hybrid HTML + JSON post structure is functioning as intended

---

## 8. SwTR — Software Test Report

### 8.1 Test Summary
Software-level testing was performed on metadata loading, field population, login logic, and tag rendering.

### 8.2 Results

#### SWT-01 JSON Load Success
Result: Pass

#### SWT-02 Missing JSON Field
Result: Conditional Pass  
The app is resilient for optional fields, but missing required fields may leave placeholders blank.

#### SWT-03 Post Lookup by ID
Result: Pass

#### SWT-04 Login Success
Result: Pass

#### SWT-05 Login Failure
Result: Pass

#### SWT-06 Logout Success
Result: Pass

#### SWT-07 Refresh While Logged In
Result: Pass

#### SWT-08 Tag Rendering
Result: Pass

### 8.3 Defects / Notes
- The application still uses client-side demo credentials
- Some HTML fallback text may duplicate JSON values by design
- `timeline.js` now functions more as a metadata loader than a full timeline renderer

### 8.4 Conclusion
The software satisfies the current demo requirements for a static front-end training project. It is acceptable for demonstration and learning use, but not for secure production authentication.
