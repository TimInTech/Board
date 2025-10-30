// Minimal audit viewer (no build tools)
(function () {
    'use strict';

    function el(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    function renderIssues(data) {
        const container = document.getElementById('audit-contents');
        container.innerHTML = '';
        if (!data || data.length === 0) {
            container.textContent = 'No audit data available.';
            return;
        }

        const list = document.createElement('div');
        list.className = 'audit-list';

        data.forEach(entry => {
            const fileEl = el(`<div class="audit-file"><h4>${entry.file}</h4></div>`);
            if (!entry.messages || entry.messages.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'No messages';
                fileEl.appendChild(p);
            } else {
                const ul = document.createElement('ul');
                entry.messages.forEach(m => {
                    const li = document.createElement('li');
                    li.textContent = `${m.type.toUpperCase()}: ${m.message} (rule: ${m.rule && m.rule.id ? m.rule.id : 'n/a'} @ line ${m.line || '?'} )`;
                    ul.appendChild(li);
                });
                fileEl.appendChild(ul);
            }
            list.appendChild(fileEl);
        });

        container.appendChild(list);
    }

    function showPanel() {
        const panel = document.getElementById('audit-panel');
        panel.style.display = 'block';
    }

    function hidePanel() {
        const panel = document.getElementById('audit-panel');
        panel.style.display = 'none';
    }

    function togglePanel() {
        const panel = document.getElementById('audit-panel');
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    }

    function init() {
        const btn = document.getElementById('audit-toggle');
        if (!btn) return;
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            togglePanel();
        });

        // Try to fetch audit JSON relative to site root
        fetch('/.audit/htmlhint.json', { cache: 'no-store' })
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch audit JSON');
                return r.json();
            })
            .then(renderIssues)
            .catch(err => {
                const container = document.getElementById('audit-contents');
                if (container) container.textContent = 'Could not load audit report: ' + err.message;
            });

        // Close button
        const close = document.getElementById('audit-close');
        if (close) close.addEventListener('click', function () { hidePanel(); });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
