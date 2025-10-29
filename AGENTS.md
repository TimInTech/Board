# Repository Guidelines

## Project Structure & Module Organization
The interactive dashboard lives in `index.html`, with historical variants kept as `.bak` files for reference while reviewing changes. Shared assets belong under `assets/`—use `assets/css` for stylesheets, `assets/js` for optional scripts, and replace `assets/favicon.png` if you update branding. Keep static SEO helpers (`404.html`, `robots.txt`, `sitemap.xml`, `.well-known/`) and optional meta presets in `meta-snippet.html` aligned with the main layout. GitHub Actions live in `.github/workflows`, and any documentation intended for GitHub Pages’ `/docs` deployment should stay in `docs/`.

## Build, Test, and Development Commands
No bundler is required; serve the site directly to preview layout changes.
```bash
python -m http.server 8080
```
Lint HTML before pushing to keep CI quiet and catch syntax issues.
```bash
npx htmlhint "**/*.html"
```
Run the linter from the repository root; it mirrors `.github/workflows/htmlhint.yml`, which intentionally treats warnings as non-blocking but should pass cleanly locally.
```bash
npx htmlhint "**/*.html" --format json --output .audit/htmlhint.json
```
The JSON report feeds into our audit trail—commit it alongside feature work when it flags new violations you had to suppress.

## Coding Style & Naming Conventions
Use two-space indentation for HTML and inline `<style>` blocks to match the existing format. Extend the `:root` CSS custom properties instead of hard-coding colors, and prefer semantic class names (`card`, `tile`, `dock`) that reflect layout roles. Keep attribute hooks (`data-theme`, `data-compact`) consistent when introducing new interactions, and group related CSS rules so diff reviews stay focused.

## Testing Guidelines
HTMLHint is the canonical validator; add temporary rules via an `.htmlhintrc` in the root if a feature requires relaxed checks. Name new demo sections with clear IDs (e.g., `id="metrics-grid"`) so downstream smoke tests or analytics snippets can target them predictably. Before opening a PR, run through the layout in both default and compact modes to ensure responsive breakpoints still render cleanly.

## Commit & Pull Request Guidelines
Follow the existing Conventional Commit pattern: `type(scope): short imperative summary` (e.g., `feat(ui): add uptime tile`). Keep commits scoped to a single change-set, update `CHANGELOG.md` when you ship notable improvements, and include before/after screenshots for visual updates. PRs should state the motivation, list any configuration changes (such as updated fonts or external API keys), and reference GitHub issues or discussions when applicable.

## Deployment & Configuration Tips
Merges to `main` publish automatically via `.github/workflows/pages.yml`. If you adjust the content root, update `actions/upload-pages-artifact@v3` accordingly. Use `.nojekyll` to keep asset paths untouched and verify any new external embeds support HTTPS, since GitHub Pages enforces it and mixed content will silently fail.

## Security Checklist
- Review Dependabot alerts weekly and patch supply-chain CVEs before the next release window.
- Keep GitHub Advanced Security (secret scanning, code scanning) alerts at zero; investigate new findings immediately.
- Never store real API keys in the repository—use the new quick actions card or personal `.env` files for local testing.

## Observability & Metrics
- Track CI health by exporting recent runs:
  ```bash
  mkdir -p .audit
  gh run list --limit 10 --json name,durationMs,status > .audit/ci_runs.json
  ```
- Capture HTMLHint trends by checking `.audit/htmlhint.json` into the same folder when relevant.
- Note noteworthy availability or latency updates in `CHANGELOG.md` so downstream consumers can correlate UX shifts.

---

👉 Siehe auch `README.md` für das Projekt-Intro. Verlinke aus neuen Dokumentationen zurück auf `AGENTS.md`, damit Contributor:innen die Richtlinien schnell finden.
