# Repository Guidelines

WallWall public GitHub Pages for Amuse8.

- English pages live at the repo root and are the default; the Korean mirror lives in `ko/` (`/privacy` ↔ `/ko/privacy`). Every page must exist in both, and `lang.js` derives the counterpart URL from the path, so a page added to one side without the other gives a 404 on language switch.
- `lang.js` loads synchronously at the top of every page's `<head>`: unprefixed URLs redirect Korean browsers (or a saved `ko` choice) to `/ko/`; `/ko/` URLs never redirect; `?lang=en|ko` saves the choice. `en/*.html` are permanent redirect aliases to `/<page>?lang=en` for links already published in stores and older app builds, so never delete them.
- Links that must open a specific language use `/ko/<page>` or `/<page>?lang=en`; a bare `/<page>` follows the visitor's browser language.
- Use root-absolute asset and stylesheet paths (`/nav.css`, `/assets/...`) so root and `ko/` pages share them.
- Each language describes only the markets it ships: Korean pages say 미국과 중국, English pages say U.S. and Korea. Never mention the other language's market pair or that coverage differs by language.
- `assets/app_intro_screenshots_<lang>.webp` (the home hero) are rendered from app screenshots in `/Users/user/Projects/a_news/docs/Code/app-store-screenshots/`; to change them, follow the landing hero part of that folder's `README.md` instead of editing the images here.
- `privacy.html`, `terms.html`, `ko/privacy.html`, `ko/terms.html`, and `styles/doc-page.css` are the published policy docs.
- Keep Flutter bundled copies in sync in `/Users/user/Projects/a_news/assets/html/`: `privacy.html`/`terms.html` mirror `ko/`, `privacy_en.html`/`terms_en.html` mirror the root pages, plus `doc-page.css`. The bundled copies are the same `<section class="doc-card">` body with no nav and no `<h1 class="doc-title">`.
- When privacy or terms change here, update the Flutter copies in the same change
- A policy edit updates the effective date to the date of the edit. Never add amendment notices, summaries of what changed, or previous-version lines to a published page.
- CLAUDE.md is a symlink to AGENTS.md, so treat any reference to either as the same thing. When asked to edit either one, edit AGENTS.md
