# Display HTML audit on GitHub Pages

Beschreibung

Audit-JSON-Dateien wie `.audit/htmlhint.json` sind nützlich, werden aber nicht auf der GitHub Pages-Seite angezeigt. Die Aufgabe ist es, eine kleine Ansicht/Seite in `assets/js` + `index.html` zu implementieren, die die Audit-Datei lädt und die wichtigsten Meldungen auf der Seite anzeigt.

Vorschlag

- Einen Link in der Fußzeile `id="audit-report"` hinzufügen
- Kleines JS-Modul `assets/js/audit.js` zum Laden und Rendern von `.audit/htmlhint.json`
- Sicherstellen, dass die Datei bei Pages-Deploy vorhanden ist (evtl. kopieren nach `docs/.audit/` oder `public/.audit/`)

Akzeptanzkriterien

- [ ] Audit-JSON wird korrekt geladen und dargestellt
- [ ] Falls keine Meldungen: sichtbarer Hinweis "No issues"
- [ ] Implementierung minimal und ohne externes Build-Tool

Priorität: mittel
