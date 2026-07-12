# RecruitAI — Frontend (SE205.3 Group Coursework)

React 18 + Vite · React Router 6 · Axios with JWT interceptors

## First-time setup

```bash
npm install
cp .env.example .env        # set VITE_API_URL to your local API URL (check the Swagger port)
npm run dev                 # opens http://localhost:5173
```

Seeded test logins (password `Passw0rd!`): kasun@recruitai.local (Candidate), recruiter@recruitai.local, manager@recruitai.local, admin@recruitai.local.

## What is already built (do not rebuild it)

- **`src/api/client.js`** — the shared axios instance. It attaches the JWT to every request and kicks users to /login on 401. **Always import this, never create your own axios.**
- **`src/auth/AuthContext.jsx`** — `useAuth()` gives you `{ user, login, register, logout }`. `user.role` decides everything.
- **`src/auth/ProtectedRoute.jsx`** — wraps role areas. Add your routes inside the right `<Route element={<ProtectedRoute roles={[...]}/>}>` block in `App.jsx`.
- **`src/theme.css`** — the design tokens. Use the CSS variables (`--primary`, `--ink`, `--line`, ...) so all four portals look like one product.

## Adding your pages

1. Branch from `dev`: `git checkout -b feature/<your-module>`
2. Create pages in your folder: `src/pages/candidate|recruiter|manager|admin/`
3. Register the route in `App.jsx` inside your role's ProtectedRoute block.
4. Call the API through `client` and read `res.data.data` (every response is wrapped in `{ success, data, message }`).
5. PR into `dev`, tag your testing buddy.
