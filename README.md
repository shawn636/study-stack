# StudyStack [![Test](https://github.com/shawn636/study-stack/actions/workflows/test.yml/badge.svg)](https://github.com/shawn636/study-stack/actions/workflows/test.yml) [![Deploy](https://github.com/shawn636/study-stack/actions/workflows/deploy.yml/badge.svg)](https://github.com/shawn636/study-stack/actions/workflows/deploy.yml)

**StudyStack** is an open-source starter kit for building customizable online learning platforms. Originally developed for a private project that was later dissolved, it's been repurposed and made public as a flexible, community-driven codebase. It's not a full SaaS — think of it as a demo, a proof of concept, and a foundation you can build on.

Built with **SvelteKit** and the latest features from **Svelte 5**, it integrates **Prisma**, **Tailwind CSS**, and **Playwright** for a modern developer experience.

## ✨ Features

- Engaging course and lesson interface  
- Secure user authentication  
- Type-safe DB layer using Prisma  
- End-to-end testing with Playwright  
- Clean, responsive UI powered by Tailwind CSS

---

## 🤝 Contributing

StudyStack was built by a solo dev and is released for the community. Contributions are welcome! Feel free to open an issue or PR — especially for:

- Bug fixes  
- Feature suggestions  
- Docs improvements

Just please keep in mind that this is not a full product with active long-term support — it's more of a public template for others to learn from or fork into their own projects.

---

## 🚀 Getting Started

Follow the platform-specific setup instructions below to get your development environment up and running. Once set up, start your dev servers with:

```bash
pnpm dev           # Standard SvelteKit dev server
pnpm vercel-dev    # Simulates Vercel Edge config for closer production testing
```

You’ll need Node.js (via NVM), Git, PlanetScale CLI, and other common development tools.

---

## 🛠 Development Environment Setup

### MacOS

1. Install Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install Node Version Manager: [NVM Docs](https://github.com/nvm-sh/nvm#installing-and-updating)  
3. Install Git: `brew install git`  
4. Install PlanetScaleCLI: `brew install planetscale/tap/pscale`  
5. Install JQ: `brew install jq`  
6. Install MySQL CLI: `brew install mysql-client`  
7. Install GitHub CLI: `brew install gh`  
8. Install Node.js: `nvm install --lts`  
9. Confirm Node install: `node -v`  
10. Enable PNPM via corepack: `corepack enable pnpm`  
11. Install PNPM: `corepack use pnpm@latest`  
12. Clone the repo:
```bash
git clone git@github.com:shawn636/study-stack.git
```

13. Install dependencies: `pnpm install`  
14. (Optional) Set Zsh as default terminal in VS Code  
15. Run dev servers using `pnpm dev` and/or `pnpm vercel-dev`

### Windows

1. Open PowerShell and install Scoop:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

2. [Install Git](https://git-scm.com/download/win)  
3. [Install NVM for Windows](https://github.com/coreybutler/nvm-windows#readme)  
4. Install PlanetScale CLI & MySQL:
```powershell
scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
scoop install pscale mysql
```

5. Install JQ: `scoop install main/jq`  
6. Install GitHub CLI: `scoop install gh`  
7. Install Node.js: `nvm install --lts`  
8. Confirm install: `node -v`  
9. Enable corepack: `corepack enable pnpm`  
10. Install PNPM: `corepack use pnpm@latest`  
11. Clone the repo: `git clone git@github.com:shawn636/study-stack.git`  
12. Install dependencies: `pnpm install`  
13. Start dev servers: `pnpm dev` and/or `pnpm vercel-dev`

### Ubuntu

1. Install NVM:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

2. Install Git: `sudo apt install git-all`  
3. [Install PlanetScale CLI](https://github.com/planetscale/cli/releases/latest)  
4. Install JQ: `sudo apt install jq`  
5. Install GitHub CLI:
```bash
sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update && sudo apt install gh -y
```

6. Install MySQL CLI: `sudo apt-get install mysql-client`  
7. Install Node.js: `nvm install --lts`  
8. Confirm install: `node -v`  
9. Enable corepack: `corepack enable pnpm`  
10. Install PNPM: `corepack use pnpm@latest`  
11. Clone the repo: `git clone git@github.com:shawn636/study-stack.git`  
12. Install dependencies: `pnpm install`  
13. Run servers: `pnpm dev` and/or `pnpm vercel-dev`

---

### Scripts

- `pnpm run dev` – Local dev server  
- `pnpm run build` – Build for production  
- `pnpm run test` – Run Playwright tests  
- `pnpm run lint` – Format and lint the code  
- `pnpm run check` – Type and syntax checking

### Testing

End-to-end testing is handled via Playwright and Vitest.

```bash
pnpm run test
```

You can also run other test-related scripts as needed for development or CI.

---

## 📄 License

This project is licensed under the MIT License.

---

_If you end up using this project for something cool, let me know — I’d love to check it out!_