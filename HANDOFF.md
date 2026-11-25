# Public frontend handoff

The user authorized a public data-free frontend backed by private workspace data. No private history or data is copied into this repository.

Deployment: GitHub Actions → GitHub Pages, basePath /career-radar-web. Deployment succeeded in https://github.com/Navv6/career-radar-web/actions/runs/45582513791 (model 5, desktop/mobile E2E 8, type/build/public audit/deploy). The live https://navv6.github.io/career-radar-web/ anonymous connection form was verified in a browser; no private workspace data is rendered before authentication. Real authenticated owner edits require the owner's repository-scoped token; do not obtain or print it during public CI.

The connection currently uses a repository-scoped fine-grained GitHub token, not OAuth sign-in. Owner-authenticated production read/write is still pending. Existing source-site and scheduled work remain unchanged until the separate private migration acceptance checks pass.

404 troubleshooting update (2026-11-26 KST): API errors now distinguish repository access, main-version lookup, data-file reads and user saves. Error text identifies the required private repository and Contents permission without echoing credentials or GitHub response bodies. Three new failure scenarios run on desktop and mobile. A reported owner-token 404 is not yet resolved; the private repository and all five required data files were confirmed to exist through the connector, which does not validate the owner's separate token. Local model/type/build/public-audit checks passed; CI/deployment evidence: https://github.com/Navv6/career-radar-web/actions/runs/45714737789 .

Validation completed: https://github.com/Navv6/career-radar-web/actions/runs/45714999016 passed model 5, desktop/mobile E2E 14, types, build, public audit and Pages deployment. The earlier run 45714737789 was blocked by an ambiguous test alert locator; it was corrected to distinguish the application error from Next.js's route announcer. No owner credential was read or used; owner connection verification remains pending.
