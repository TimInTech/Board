title: Update HTMLHint audit report

---

Beschreibung

Die HTML-Lint-Ausgabe wurde lokal unter `.audit/htmlhint.json` aktualisiert und ins Repository eingecheckt. Wir sollten die Ergebnisse reviewen und Fehler beheben, falls welche vorhanden sind.

Was zu tun ist

- [ ] HTML-Audit-Datei prüfen: `.audit/htmlhint.json`
- [ ] Falls Meldungen vorhanden: passende Fixes in HTML-Dateien umsetzen
- [ ] CI/Workflow anpassen, damit das Audit bei PRs automatisch aktualisiert wird

Reproduzierbar

- Lint lokal ausführen: `npx htmlhint "**/*.html" --format json | tee .audit/htmlhint.json`

Priorität: niedrig
