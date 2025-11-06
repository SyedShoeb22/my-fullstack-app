# 1. Prerequisites (install once)

* Git (≥2.x) — [https://git-scm.com/](https://git-scm.com/)
* Node.js LTS (install Node 18+ or 20+; LTS recommended) — [https://nodejs.org/](https://nodejs.org/)
* npm (comes with Node)
* VS Code — [https://code.visualstudio.com/](https://code.visualstudio.com/)
* (Optional) GitHub CLI `gh` — [https://cli.github.com/](https://cli.github.com/)

Open a terminal after installs. If you're on Windows, consider WSL or use Git Bash.

---

# 2. Create the GitHub repository

Option A — using the web UI:

1. Go to github.com → New repository → name it `my-fullstack-app` (or your name).
2. Initialize *without* README (we’ll push local). Note the repo URL (e.g. `https://github.com/you/my-fullstack-app.git`).

Option B — using `gh` CLI:

```bash
gh repo create yourusername/my-fullstack-app --public --confirm
```

Replace `yourusername` and repo name.

---

# 3. Project layout (local)

We’ll create a monorepo with `frontend/` (React) and `backend/` (Node/Express).

Commands:

```bash
# create root dir
mkdir my-fullstack-app
cd my-fullstack-app
git init
```

Create `.gitignore` now:

```bash
cat > .gitignore <<'EOF'
node_modules/
dist/
.env
.vscode/
.DS_Store
frontend/node_modules/
backend/node_modules/
EOF
```

Create a README:

```bash
cat > README.md <<'EOF'
# My Fullstack App
Frontend: React (Vite). Backend: Node + Express.
EOF
```

---

# 4. Frontend — Create React app (Vite)

Vite is fast and modern.

From repo root:

```bash
# create frontend with Vite (plain JS React)
npm create vite@latest frontend -- --template react
cd frontend
npm install
cd ..
```

(If you prefer TypeScript: `--template react-ts`)

Key files:

* `frontend/package.json` — scripts: `dev`, `build`, `preview`
* `frontend/src/main.jsx`, `frontend/src/App.jsx`

Start dev server:

```bash
cd frontend
npm run dev
# open http://localhost:5173
```

VS Code: open the project and run the dev server inside integrated terminal.

---

# 5. Backend — Express starter

From repo root:

```bash
mkdir backend
cd backend
npm init -y
npm install express
```

Create `backend/index.js`:

```js
// backend/index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ msg: 'Hello from backend' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
```

Add scripts to `backend/package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

(Install `nodemon` for dev if you like: `npm i -D nodemon`)

Start backend:

```bash
cd backend
npm run start
# or for dev
npm i -D nodemon
npm run dev
```

---

# 6. Connect frontend -> backend (dev proxy)

To avoid CORS in dev, configure a proxy in Vite.

Edit `frontend/vite.config.js` — add server proxy:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') 
      }
    }
  }
})
```

Now in frontend React you can `fetch('/api/hello')`.

Example call in `frontend/src/App.jsx`:

```jsx
import { useEffect, useState } from 'react'

function App() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then(r => r.json())
      .then(d => setMsg(d.msg))
      .catch(e => setMsg('error'))
  }, [])

  return <div>
    <h1>React + Express</h1>
    <p>Backend says: {msg}</p>
  </div>
}

export default App
```

---

# 7. Basic Git workflow (local → GitHub)

From repo root (after adding files):

```bash
# confirm remote repo exists (if created on GitHub)
git remote add origin https://github.com/yourusername/my-fullstack-app.git

# stage everything
git add .

# commit initial state
git commit -m "chore: initial mono repo with frontend (Vite) and backend (Express)"

# push to main (create remote branch main)
git branch -M main
git push -u origin main
```

If you used `gh repo create --confirm`, the remote may already be set, then push.

---

# 8. Feature branch example (create React feature and push)

Create a feature branch, implement change, push:

```bash
# create & switch
git checkout -b feat/homepage

# make changes (edit frontend/src/App.jsx) → then:
git add frontend/src/App.jsx
git commit -m "feat(frontend): add homepage welcome message"

# push feature branch
git push -u origin feat/homepage
```

Now open a PR on GitHub from `feat/homepage` → `main` (via web UI or `gh`):

```bash
gh pr create --title "feat: homepage" --body "Adds welcome message" --base main --head feat/homepage
```

---

# 9. Clone repo (someone else / different machine)

```bash
git clone https://github.com/yourusername/my-fullstack-app.git
cd my-fullstack-app
# get subfolders
cd frontend && npm install
cd ../backend && npm install
```

---

# 10. GitHub Actions — simple CI workflow

Create `.github/workflows/ci.yml` to run build/test for frontend & backend on pushes/PRs.

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  frontend:
    name: Frontend Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      - name: Build
        working-directory: frontend
        run: npm run build

  backend:
    name: Backend Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        working-directory: backend
        run: npm ci
      - name: Run lint/test (no tests yet)
        working-directory: backend
        run: echo "No tests configured"
```

Commit and push:

```bash
git add .github
git commit -m "chore(ci): add basic GitHub Actions workflow"
git push
```

When you open a PR, Actions will run.

---

# 11. VS Code tips

* Open project root in VS Code: `code .`
* Recommended extensions:

  * ESLint
  * Prettier - Code formatter
  * GitLens
  * Live Server (optional)
  * npm Intellisense
* Use the integrated terminal for `npm run dev` (frontend) and `npm run dev` (backend) in separate terminals.

Add a workspace `launch.json` or tasks later to launch both servers with one click (optional).

---

# 12. Useful additional files

`.editorconfig`, `frontend/.eslintrc`, and `backend/.eslintrc` later to keep code style consistent.

Example small `.editorconfig`:

```
root = true

[*]
end_of_line = lf
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true
```

