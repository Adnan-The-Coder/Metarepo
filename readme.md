### MetaRepo: The Development Universe

A unified monorepo containing the full spectrum of projects I build, maintain, and experiment with — from open-source libraries and backend services to portfolio sites and exploratory prototypes.

This repo isn't just a storage space — it's the backbone of my development workflow. Everything lives here: production-ready code, tools I share with the community, personal builds, and experimental ideas in progress.

- **Portfolio Websites**: All versions of my personal portfolio (v1, v2, etc.)
- **Backend Services**: Complete backend infrastructure and APIs
- **Libraries & Packages**: Reusable code, utilities, and components
- **Experiments**: Side projects, POCs, and learning experiments
- **Open Source**: Public packages and contributions

This repository serves as the single source of truth for my development work, enabling seamless integration across projects while maintaining a unified development experience.

<div style="flex: 1; min-width: 250px;">
  <h3>Built With</h3>
  <p>
    <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
    <img alt="NextJS" src="https://img.shields.io/badge/-NextJS-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
    <img alt="pnpm" src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
    <img alt="Cloudflare" src="https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=Cloudflare&logoColor=white" />
    <img alt="git" src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" />
    <img alt="D1" src="https://img.shields.io/badge/Cloudflare%20D1-4B8B3C?style=flat-square&logo=cloudflare&logoColor=white" />
    <img alt="Drizzle" src="https://img.shields.io/badge/Drizzle-F27A4B?style=flat-square&logo=drizzle&logoColor=white" />
    <img alt="Nx" src="https://img.shields.io/badge/Nx-000000?style=flat-square&logo=nx&logoColor=white" />
    <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
    <img alt="TensorFlow" src="https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white" />
    <img alt="PyTorch" src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" />
    <img alt="Pandas" src="https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white" />
    <img alt="Matplotlib" src="https://img.shields.io/badge/Matplotlib-003366?style=flat-square&logo=matplotlib&logoColor=white" />
    <img alt="Jest" src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white" />
    <img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white" />
  </p>
</div>


---

## Getting Started

To get started with the project, follow the steps below.

### 1. Clone the Repository

First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/Adnan-The-Coder/zero-day-codebase.git
```

### 2. Install `pnpm`

`pnpm` is the package manager used for managing dependencies in this repository. To install `pnpm`, follow the steps below based on your operating system:

#### For macOS or Linux:

You can install `pnpm` globally using **Homebrew** (macOS) or **npm** (Linux/macOS):

```bash
npm install -g pnpm
```

#### For Windows:

You can install `pnpm` using **npm** via the command prompt:

```bash
npm install -g pnpm
```

If you encounter any issues with the installation, refer to the [official pnpm documentation](https://pnpm.io/installation).

---

### 3. Install Dependencies

Once `pnpm` is installed, navigate to the root directory of the project (where the `package.json` is located) and run the following command to install all the dependencies:

```bash
pnpm install
```

This will install the necessary packages for both the `web` UI and any other internal libraries or applications.

---

## Running the Web UI

The project contains a `web` application built using **Next.js**. To run the application, follow these steps:

### 1. Run the Web UI Locally

To start the `web` application locally, use the following command:

```bash
nx serve web
```

This will start the development server on a local machine and you can access the application in your browser at [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, it will automatically use the next available port (e.g., 3001).

### 2. What Happens in the `web` Application

The `web` application is built using **Next.js**, a React framework, and is designed to be used as the user interface of this project. Any changes made within the `web` directory will trigger rebuilding the project and potentially redeploying the application to **Cloudflare Workers**.

---

## Deployment to Cloudflare Workers

The `web` application is also deployed to **Cloudflare Workers**. This deployment happens automatically when changes are made inside the `web` folder.

### 1. Deployment Flow

* Changes made within the `apps/web` folder will trigger a deployment to **Cloudflare Workers**. This is managed by **OpenNext** scripts written with pnpm run build and pnpm  run deploy, through CD pipeline using Cloudflare accont ID and API token.
* Every time you run the `nx serve web` command and changes are made, the build will trigger the deployment process to Cloudflare Workers, ensuring the latest version is always live.

---

## General Nx Commands

Nx provides several commands for managing your monorepo, including tasks like running, building, testing, and linting applications and libraries.

### 1. `nx serve <project>`

Starts the development server for a given project (e.g., `web`).

```bash
nx serve web
```

This will start the development server for the `web` project, and you can access the application at `http://localhost:3000` (or the next available port).

### 2. `nx build <project>`

Builds the project and compiles the code.

```bash
nx build web
```

This command will build the `web` project and output the compiled code to the `dist/` folder, which is ready for deployment.

### 3. `nx lint <project>`

Runs linting checks on the specified project.

```bash
nx lint web
```

This will check the `web` project for linting errors, and output any issues found.

### 4. `nx test <project>`

Runs unit tests for a given project.

```bash
nx test web
```

This will run the unit tests for the `web` project and show the results in the terminal.

### 5. `nx affected:build`

Builds the affected projects based on the changes made to the workspace.

```bash
nx affected:build --base=main --head=HEAD
```

This will only build projects that were affected by the changes between the `main` branch and the current branch.

### 6. `nx run-many`

Run a target (e.g., build, test, lint) for multiple projects at once.

```bash
nx run-many --target=build --projects=web,other-app
```

This command allows you to run the `build` target for both the `web` project and another app in the workspace.

### 7. `nx migrate`

Upgrade the Nx workspace and its dependencies to the latest version.

```bash
nx migrate latest
```

This will migrate your workspace to the latest Nx version, making sure everything is up-to-date.

---

## Folder Structure

Here's a quick overview of the folder structure in the monorepo:
```
zero-day-codebase/
├── .github/                 # Contains Tests, CI/CD pipelines using github action workflows
├── apps/                    # Application packages
│   ├── web/                 # Main web application
│   ├── cf-server/           # Cloudflare workers deployed, Backend server for Platform analytics, user related CRUD operations and APIs enabled features
│   ├── python backend/      # Python Backend (coming soon...)
├── packages/                # Shared packages
├── nx.json/                 # Configurationa file of nx 
├── pnpm-lock.yaml/          # Lockfile for pnpm dependencies 
├── package.json/            # Root package manager configuration 
└── pnpm-workspace.yaml/     # Defines the structure and workspace of pnpm monorepo
```

---

## Troubleshooting

If you run into any issues, here are a few things to check:

* **Make sure `pnpm` is installed**: Verify that you can run `pnpm --version` to ensure `pnpm` is installed globally.
* **Run Nx with `--verbose`**: If a command isn't working as expected, try adding `--verbose` to get more detailed error logs.
* **Clear Nx cache**: If things are stuck, try clearing the Nx cache with `nx reset` and reinstall dependencies.

---

# Contributing Guidelines

## 1. Branching Strategy

Start from dev branch: When starting any work, always create your branch from the dev branch.
Branch naming convention:

- For new features: feat/featurename
- For bug fixes: fix/whatyouarefixing
- For updating content: update/whereyouareupdating
- For documentation updates: docs/whatyouupdated
- For refactoring code: refactor/whatyourefactored
- For urgent hotfixes: hotfix/urgentfix

## 2. Pull Request (PR) Workflow

### Step 1: Development

After completing task, push changes and create a PR to merge your branch into the dev branch.
Provide a clear description of the changes in the PR.

Testing Stage is avoided in this rapid development phase and the code is reviewed while merging to main branch itself.

### Step 2: Production

After successful testing, create a PR from the test branch to the main branch.
This PR must be approved by the CTO and at least 1 other member.
Once approved, the changes will be deployed to production.

## 3. Commit Message Guidelines

Use the following prefixes for clear and consistent commit messages:

```
feat: for new features.
fix: for bug fixes.
docs: for documentation updates.
refactor: for code refactoring.
style: for formatting and style changes (not affecting code logic).
test: for adding or updating tests.
chore: for maintenance tasks.
```

```
Example: feat: add user authentication to login page.
```

## 4. CI/CD Pipeline Requirements

The CI/CD pipeline must run error-free.

## 5. Conflict Resolution

If any merge conflicts arise, contributors should immediately contact the [Adnan](https://github.com/Adnan-The-Coder) for resolution.

## 6. Emergency Procedure

In case of critical hotfixes or urgent issues, [Adnan](https://github.com/Adnan-The-Coder) must trigger the emergency procedure.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
