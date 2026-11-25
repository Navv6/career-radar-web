# Public shell boundary

GitHub Pages serves static HTML/CSS/JavaScript only. The browser connects directly to api.github.com after the user enters a repository-scoped token. GitHub rejects unauthenticated requests to private JSON. The shell verifies repository privacy before reading or writing.

The token is retained in memory, cleared from the password field after connecting, and never persisted in localStorage, cookies, service workers, analytics or generated artifacts. The page uses no third-party scripts. Other apps under the same github.io origin remain part of the browser trust boundary.

The UI reads all files from a single commit and writes user state with its blob SHA. Conflicting writes retain the editing form; successful writes are read back. Automatic catalog writers cannot change user state.

Public CI tests use synthetic mock API responses only. Privacy audit rejects copied data directories, environment files, credential patterns and sourcemaps. The private workspace performs an additional original-data comparison before source is released here.
