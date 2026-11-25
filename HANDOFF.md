# Public frontend handoff

The user authorized a public data-free frontend backed by private workspace data. No private history or data is copied into this repository.

Deployment: GitHub Actions → GitHub Pages, basePath /career-radar-web. Deployment succeeded in https://github.com/Navv6/career-radar-web/actions/runs/45582513791 (model 5, desktop/mobile E2E 8, type/build/public audit/deploy). The live https://navv6.github.io/career-radar-web/ anonymous connection form was verified in a browser; no private workspace data is rendered before authentication. Real authenticated owner edits require the owner's repository-scoped token; do not obtain or print it during public CI.

The connection currently uses a repository-scoped fine-grained GitHub token, not OAuth sign-in. Owner-authenticated production read/write is still pending. Existing source-site and scheduled work remain unchanged until the separate private migration acceptance checks pass.
