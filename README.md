# Budget Beacon

Budget Beacon is a lightweight budgeting dashboard that summarizes income, expenses, and savings insights for a month. The project demonstrates AI-assisted development, automated testing, and a CI/CD pipeline that deploys to GitHub Pages.

## Features
- Income, expense, and net balance summaries
- Top spending category highlights
- Validation checks for transaction data
- Responsive, accessible dashboard layout

## Project Scripts

```bash
npm install
npm run dev
```

| Command | Description |
| --- | --- |
| `npm run lint` | Lint the TypeScript codebase with ESLint |
| `npm run test` | Run the Vitest suite |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build |

## CI/CD
The GitHub Actions workflow runs lint → test → build → deploy. Deployments publish the `dist/` folder to GitHub Pages.

## Deployment
The live URL is recorded in `Deployment_URL.txt`.
