# Equipped [![Test](https://github.com/EquippedTeam/equipped/actions/workflows/test.yml/badge.svg)](https://github.com/EquippedTeam/equipped/actions/workflows/test.yml) [![Deploy](https://github.com/EquippedTeam/equipped/actions/workflows/deploy.yml/badge.svg)](https://github.com/EquippedTeam/equipped/actions/workflows/deploy.yml)

Equipped is an innovative web application designed for immersive learning experiences. Utilizing SvelteKit, it integrates Prisma, Tailwind CSS, and Playwright for a robust, sleek, and thoroughly tested experience.

## Features

-   Engaging course and lesson interface.
-   Secure user authentication system.
-   Efficient database handling with Prisma.
-   Comprehensive testing suite with Playwright.
-   Responsive and modern UI with Tailwind CSS.

### Development Environment Setup

#### MacOS

1. Install Homebrew: `/bin/bash -c "$(curl -fsSL 		https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

2. Install Node Version Manager by following guide from [their docs](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

3. Install Git using Homebrew: `brew install git`

4. Install PlanetScaleCLI using Homebrew: `brew install planetscale/tap/pscale`

5. Install JQ using Homebrew: `brew instal jq`

6. Install the MySQL command line client: `brew install mysql-client`

7. Install GitHub CLI via Homebrew: `brew install gh`

8. Install latest LTS version of Node.js: `nvm install --lts`

9. Confirm node installation using `node -v`

10. Enable corepack for Node.js: `corepack enable pnpm`

11. Install PNPM using corepack: `corepack use pnpm@latest`

12. Clone the repository

    - SSH (Recommended): `git clone git@github.com:EquippedTeam/equipped.git`
        - For help setting up ssh, see [the GitHub documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
    - HTTPS (deprecated): `git clone https://github.com/EquippedTeam/equipped.git`

13. Install dependencies using PNPM: `pnpm install`

14. Set Zsh as the default terminal in VS Code

    - On your VsCode in Mac : `shift + command + P` .
    - On the Prompt > type : `Terminal: Select Default Profile` , then "Click it". Note, as you type you will find this option in the auto-complete.
    - Click the option for zsh or your desired shell.
    - Restart VSCode .

15. Start Dev Servers and start coding!

    - If you use VS Code, dev servers will run automatically on http://localhost:5173 and http://localhost:3000

        - Port 5173 is the standard dev server for SvelteKit

        - Port 3000 is a special dev server using vercel, which simulates more closely how it will look on our Vercel Edge config. This is the server used for tests, so if you are troubleshooting a failing test, use this one.

    - For other IDE's, you can use pnpm scripts to start the dev servers

        - Standard Dev Server: `pnpm dev`
        - Vercel Dev Server: `pnpm vercel-dev`

#### Windows

1. Open a powershell terminal and install Scoop

    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
    ```

2. Install Git for Windows from [their downloads page](https://git-scm.com/download/win).

3. Install Node Version Manager from [their Downloads Page](https://github.com/coreybutler/nvm-windows#readme)

4. Install PlanetScaleCLI and MySQL command line client using Scoop:

    ```powershell
    scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
    scoop install pscale mysql
    ```

5. Install JQ using Scoop:

    ```bash
    scoop install main/jq
    ```

6. Install GitHub CLI using Scoop

    ```bash
    scoop install gh
    ```

7. Install latest LTS version of Node.js: `nvm install --lts`

8. Confirm node installation using `node -v`

9. Enable corepack for Node.js: `corepack enable pnpm`

10. Install PNPM using corepack: `corepack use pnpm@latest`

11. Clone the repository

    - SSH (Recommended): `git clone git@github.com:EquippedTeam/equipped.git`

        - For help setting up ssh, see [the GitHub documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

    - HTTPS (deprecated): `git clone https://github.com/EquippedTeam/equipped.git`

12. Install dependencies using PNPM: `pnpm install`

13. Start Dev Servers and start coding!

    - If you use VS Code, dev servers will run automatically on http://localhost:5173 and http://localhost:3000

        - Port 5173 is the standard dev server for SvelteKit

        - Port 3000 is a special dev server using vercel, which simulates more closely how it will look on our Vercel Edge config. This is the server used for tests, so if you are troubleshooting a failing test, use this one.

    - For other IDE's, you can use pnpm scripts to start the dev servers

        - Standard Dev Server: `pnpm dev`
        - Vercel Dev Server: `pnpm vercel-dev`

#### Ubuntu

1. Install Node Version Manager:

    - Install using curl: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
    - Install using wget: `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

2. Install Git

    - Fedora/RPM-Based Distribution: `sudo dnf install git-all`
    - Debian-Based Distribution: `sudo apt install git-all`

3. Install PlanetScaleCLI

    - **pscale** is available as downloadable binaries from their [releases](https://github.com/planetscale/cli/releases/latest) page.
    - Download the .deb or .rpm from the [releases](https://github.com/planetscale/cli/releases/latest) page and install with `sudo dpkg -i` and `sudo rpm -i` respectively.

4. Install JQ

    - Fedora/RPM-Based Distribution: `sudo dnf install jq`
    - Debian-Based Distribution: `sudo apt install jq`

5. Install GitHub CLI

    - Fedora/RPM-Based Distribution

        ```bash
        sudo mkdir -p -m 755 /etc/apt/keyrings && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
            && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
            && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
            && sudo apt update \
            && sudo apt install gh -y
        ```

    - Debian-Based Distribution

        ```bash
        sudo dnf install 'dnf-command(config-manager)'
        sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
        sudo dnf install gh
        ```

6. Install the MySQL command line client

    - Fedora/RPM-Based Distribution: `sudo yum install community-mysql`
    - Debian-Based Distribution:`sudo apt-get install mysql-client`

7. Install latest LTS version of Node.js: `nvm install --lts`

8. Confirm node installation using `node -v`

9. Enable corepack for Node.js: `corepack enable pnpm`

10. Install PNPM using corepack: `corepack use pnpm@latest`

11. Clone the repository

    - SSH (Recommended): `git clone git@github.com:EquippedTeam/equipped.git`
        - For help setting up ssh, see [the github documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
    - HTTPS (deprecated): `git clone https://github.com/EquippedTeam/equipped.git`

12. Install dependencies using PNPM: `pnpm install`

13. Start Dev Servers and start coding!

    - If you use VS Code, dev servers will run automatically on http://localhost:5173 and http://localhost:3000

        - Port 5173 is the standard dev server for SvelteKit

        - Port 3000 is a special dev server using vercel, which simulates more closely how it will look on our Vercel Edge config. This is the server used for tests, so if you are troubleshooting a failing test, use this one.

    - For other IDE's, you can use pnpm scripts to start the dev servers

        - Standard Dev Server: `pnpm dev`
        - Vercel Dev Server: `pnpm vercel-dev`

### Scripts

-   `pnpm run dev` - Starts a local development server.
-   `pnpm run build` - Builds the application for production.
-   `pnpm run test` - Runs Playwright tests.
-   `pnpm run lint` - Lints and formats the code.
-   `pnpm run check` - Checks the project for type and syntax errors.
-   Other specialized scripts for testing and development.

### Testing

Testing is handled through Playwright and Vitest. Run `pnpm run test` for end-to-end tests, and use other test-related scripts for specific testing needs.

### Contributing

This is a private repository of Equipped.co. All rights are reserved. Contributions and improvements are managed internally.

### License

All rights reserved © Equipped.co.
