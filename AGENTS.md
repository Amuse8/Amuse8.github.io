# Repository Guidelines

WallWall public GitHub Pages for Amuse8.

- Korean pages live at the repo root; the English mirror lives in `en/` (`/privacy` ↔ `/en/privacy`). Every page must exist in both, and `nav.js` derives the counterpart URL from the path, so a page added to one side without the other gives a 404 on language switch.
- Use root-absolute asset and stylesheet paths (`/nav.css`, `/assets/...`) so root and `en/` pages share them.
- Each language describes only the markets it ships: Korean pages say 미국과 중국, English pages say U.S. and Korea. Never mention the other language's market pair or that coverage differs by language.
- `privacy.html`, `terms.html`, `en/privacy.html`, `en/terms.html`, and `styles/doc-page.css` are the published policy docs.
- Keep Flutter bundled copies in sync: `/Users/user/Projects/a_news/assets/html/{privacy,terms,privacy_en,terms_en}.html` and `doc-page.css`. The bundled copies are the same `<section class="doc-card">` body with no nav and no `<h1 class="doc-title">`.
- When privacy or terms change here, update the Flutter copies in the same change
- A policy edit updates the effective date to the date of the edit. Never add amendment notices, summaries of what changed, or previous-version lines to a published page.
- CLAUDE.md is a symlink to AGENTS.md, so treat any reference to either as the same thing. When asked to edit either one, edit AGENTS.md
