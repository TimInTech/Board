# AGENTS.md — Repository Guidelines

> Plan-first. Idempotent. Dry-Run. Audits sichtbar. Keine Secrets im Repo.

## 1) Core Principles

* **Plan-first:** Ziel, Risiken, Diff-Vorschau vor Änderungen.
* **Idempotent:** Wiederholtes Ausführen erzeugt keine Doppelungen.
* **Previews & Linting:** Vor Merge lokal prüfen.
* **Audits sichtbar:** Reports nach `.audit/` ablegen und committen, wenn relevant.
* **Secrets:** Niemals echte API-Keys einchecken.

## 2) Project Layout

* Haupt-Dashboard: `index.html`
* Assets: `assets/` (`assets/css`, `assets/js`, `assets/favicon.png`)
* Statische Helfer: `404.html`, `robots.txt`, `sitemap.xml`, `.well-known/`, `meta-snippet.html`
* CI: `.github/workflows/`
* Doku für Pages: `docs/`
* Audits/Reports: `.audit/`
* **Modularisierung (schrittweise, empfohlen):**

  ```
  assets/js/
    core/      # storage.js, theme.js, utils.js (elSafe, normUrl, domain, announce)
    features/  # import.js, search.js, ai.js, weather.js
    ui/        # render.js, modals.js, dnd.js
  main.js      # Bootstrap/Orchestrierung
  ```

## 3) Dev Workflow

Vorschau starten:

```bash
cd ./           # ins Repo
python -m http.server 8080
```

HTML linten und Audit exportieren:

```bash
cd ./
npx htmlhint "**/*.html"
npx htmlhint "**/*.html" --format json --output .audit/htmlhint.json
```

Optionale CI-/A11y-Reports:

```bash
mkdir -p .audit
gh run list --limit 10 --json name,durationMs,status > .audit/ci_runs.json
# optional, falls vorhanden:
# node scripts/a11y_check.mjs > .audit/a11y.html
```

## 4) Coding Guidance

* HTML- und Inline-`<style>`-Einrückung: **2 Leerzeichen**
* Farben nur über `:root`-CSS-Variablen erweitern
* **Kein untrusted `innerHTML`**. Hilfsfunktion verwenden:

  ```js
  export function elSafe(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  ```

* Semantische Klassen: `card`, `tile`, `dock`
* Attribut-Hooks konsistent: `data-theme`, `data-compact`

## 5) Security & A11y

**CSP aktivieren** (in `<head>`):

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
           font-src 'self' https://fonts.gstatic.com;
           img-src 'self' data: https:;
           connect-src 'self' https://api.openweathermap.org https://generativelanguage.googleapis.com https://source.unsplash.com;
           frame-src 'none'; object-src 'none';">
```

**API-Keys:** Nur lokal, nie im Repo. Im UI klar warnen, dass Keys lokal gespeichert werden.

**Netzwerk-Checks drosseln:** Batching, Timeout 5 s, Exponential Backoff bis 5 min.

**A11y:**

* Tiles: `role="button"`, `tabindex="0"`, Enter/Space auslösen
* Icon-Buttons: `aria-label` + `title`
* Modals: Fokus-Management, Escape schließt
* Kontrast: mindestens WCAG AA
* Live-Region:

  ```html
  <div role="status" aria-live="polite" id="liveRegion" class="sr-only"></div>
  ```

## 6) Process

* **Conventional Commits:** `type(scope): summary`
  Beispiele: `feat(ui): add uptime tile`, `fix(security): sanitize imports`
* **CHANGELOG.md** bei merklichen Änderungen pflegen
* **PR-Beifang:** Screenshots (vor/nach), relevante `.audit/*`-Reports beilegen
* **Checklists** strikt nutzen (siehe unten)

## 7) Checklisten

### Vor Pull Request

* [ ] Lokale Vorschau: `python -m http.server 8080` geprüft (Default + Compact)
* [ ] `npx htmlhint "**/*.html"` ohne Fehler
* [ ] Kein untrusted `innerHTML`; `elSafe` genutzt
* [ ] A11y: Tastaturbedienung, ARIA-Labels, Fokus in Modals
* [ ] Netzwerk-Checks gedrosselt
* [ ] `.audit/htmlhint.json` und ggf. `.audit/ci_runs.json` aktualisiert
* [ ] Screenshots erstellt und im PR verlinkt

### Vor Release

* [ ] CSP-Tag vorhanden und korrekt
* [ ] Keine Secrets im Repo/PR
* [ ] Pages-Preview ohne Mixed-Content-Warnungen
* [ ] `CHANGELOG.md` aktualisiert

## 8) Hinweise zu Performance & Persistenz

* Bilder/Favicons: `loading="lazy"`
* Große Wallpaper nicht in `localStorage`, sondern IndexedDB
* Requests bündeln, Polling minimieren

## 9) Notfall & Rollback

Vor riskanten Merges Tag setzen:

```bash
git tag -s pre-release-$(date +%Y%m%d)
git push --tags
```

Rollback:

```bash
git revert <merge_commit_sha>
git push
```

---

👉 Lies auch `README.md` für das Projekt-Intro. Verlinke neue Dokus zurück auf **AGENTS.md**, damit Richtlinien schnell auffindbar bleiben.
