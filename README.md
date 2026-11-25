# Career Radar — public frontend

A data-free frontend for a private career workspace. The public page contains a connection form. Personal data is loaded only after the visitor supplies a GitHub token authorized for the private data repository.

This repository contains **no job catalog, personal profile, application history, private notes or credentials**. Access to the frontend is public; data access is enforced by GitHub's private-repository authorization. A token is held only in the current tab's memory and is cleared on reload or disconnect. Use a fine-grained token restricted to the private workspace repository and Contents read/write. Never place it in a URL or public issue.

Stack: Next.js static export, TypeScript, Tailwind. GitHub Actions builds, tests and publishes only out/ to GitHub Pages. Source and synthetic tests in this repository are public. Automated research and private JSON storage belong to a separate private repository.

```sh
npm ci
npm run test:model
npm run typecheck
npm run build
python scripts/audit_public.py
npx playwright install chromium
npm run test:e2e
```

Public frontend configuration: `/career-radar-web/`. No OpenAI API key or GitHub secret is required for building or deploying the shell.
