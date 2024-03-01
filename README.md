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

2. Install Node Version Manager using Homebrew: `brew install nvm`

3. Install Git using Homebrew: `brew install git`

4. Install PlanetScaleCLI using Homebrew: `brew install planetscale/tap/pscale`

5. Install the MySQL command line client: `brew install mysql-client`

6. Install latest LTS version of Node.js: `nvm install --lts`

7. Confirm node installation using `node -v`

8. Enable corepack for Node.js: `corepack enable pnpm`

9. Install PNPM using corepack: `corepack use pnpm@latest`

10. Clone the repository

    - SSH (Recommended): `git clone git@github.com:EquippedTeam/equipped.git`
        - For help setting up ssh, see [the github documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
    - HTTPS (deprecated): `git clone https://github.com/EquippedTeam/equipped.git`

11. Install dependencies using PNPM: `pnpm install`

12. Start Dev Servers and start coding!

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

3. Install Node Version Manager using Scoop

    ```powershell
    scoop bucket add main
    scoop install pscale mysql

    ```

4. Install PlanetScaleCLI and MySQL command line client using Scoop:

    ```powershell
    scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
    brew install planetscale/tap/pscale
    ```

5. Install latest LTS version of Node.js: `nvm install --lts`

6. Confirm node installation using `node -v`

7. Enable corepack for Node.js: `corepack enable pnpm`

8. Install PNPM using corepack: `corepack use pnpm@latest`

9. Clone the repository

    - SSH (Recommended): `git clone git@github.com:EquippedTeam/equipped.git`

        - For help setting up ssh, see [the github documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

    - HTTPS (deprecated): `git clone https://github.com/EquippedTeam/equipped.git`

10. Install dependencies using PNPM: `pnpm install`
11. Start Dev Servers and start coding!

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
4. Install the MySQL command line client
    - Fedora/RPM-Based Distribution: `sudo yum install community-mysql`
    - Debian-Based Distribution:`sudo apt-get install mysql-client`
5. Install latest LTS version of Node.js: `nvm install --lts`
6. Confirm node installation using `node -v`
7. Enable corepack for Node.js: `corepack enable pnpm`
8. Install PNPM using corepack: `corepack use pnpm@latest`
9. Clone the repository

    - SSH (Recommended): `git clone git@github.com:EquippedTeam/equipped.git`
        - For help setting up ssh, see [the github documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
    - HTTPS (deprecated): `git clone https://github.com/EquippedTeam/equipped.git`

10. Install dependencies using PNPM: `pnpm install`
11. Start Dev Servers and start coding!

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
