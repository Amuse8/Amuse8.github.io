(function () {
    const NAV_ID = 'wallwall-nav';
    const LANG_KEY = 'wallwall-lang';
    const REDIRECT_FLAG = 'wallwall-lang-redirected';

    const STRINGS = {
        ko: {
            navLabel: '월월 글로벌 내비게이션',
            openMenu: '메뉴 열기',
            language: '언어 선택',
            links: [
                { label: '회사', url: 'https://www.amuse8.kr' },
                { label: '고객지원', url: '/support' },
                { label: '이용약관', url: '/terms' },
                { label: '개인정보처리방침', url: '/privacy' }
            ]
        },
        en: {
            navLabel: 'WallWall global navigation',
            openMenu: 'Open menu',
            language: 'Select language',
            links: [
                { label: 'Company', url: 'https://www.amuse8.kr' },
                { label: 'Support', url: '/en/support' },
                { label: 'Terms', url: '/en/terms' },
                { label: 'Privacy', url: '/en/privacy' }
            ]
        }
    };

    function readStoredLang() {
        try {
            const value = window.localStorage.getItem(LANG_KEY);
            return value === 'ko' || value === 'en' ? value : null;
        } catch (error) {
            return null;
        }
    }

    function storeLang(lang) {
        try {
            window.localStorage.setItem(LANG_KEY, lang);
        } catch (error) {
            /* private mode: preference simply does not persist */
        }
    }

    function currentLang() {
        return /^\/en(\/|$)/.test(window.location.pathname) ? 'en' : 'ko';
    }

    /** Path of the current page in the other language, e.g. /privacy <-> /en/privacy */
    function pathFor(lang) {
        const path = window.location.pathname;
        const koPath = path.replace(/^\/en(?=\/|$)/, '') || '/';
        if (lang === 'ko') return koPath;
        return koPath === '/' ? '/en/' : '/en' + koPath;
    }

    function browserLang() {
        const list = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language || navigator.userLanguage || ''];
        const known = list.filter(Boolean);
        if (!known.length) return null;
        return known.some(tag => String(tag).toLowerCase().indexOf('ko') === 0) ? 'ko' : 'en';
    }

    /**
     * Language resolution, in order: ?lang= in the URL, a stored choice from the
     * switcher, then the browser language. Only the first visit redirects, so a
     * shared link to a specific language always wins afterwards.
     */
    function resolveLanguage() {
        const requested = new URLSearchParams(window.location.search).get('lang');
        if (requested === 'ko' || requested === 'en') {
            storeLang(requested);
            if (requested !== currentLang()) {
                window.location.replace(pathFor(requested));
                return true;
            }
            return false;
        }

        if (readStoredLang()) return false;

        let alreadyRedirected = false;
        try {
            alreadyRedirected = window.sessionStorage.getItem(REDIRECT_FLAG) === '1';
        } catch (error) {
            alreadyRedirected = false;
        }
        if (alreadyRedirected) return false;

        const preferred = browserLang();
        if (!preferred || preferred === currentLang()) return false;

        try {
            window.sessionStorage.setItem(REDIRECT_FLAG, '1');
        } catch (error) {
            /* no session storage: fall through, the redirect still happens once */
        }
        window.location.replace(pathFor(preferred));
        return true;
    }

    function normalizeUrl(url) {
        try {
            const parsed = new URL(url, window.location.origin);
            const cleanPath = parsed.pathname
                .replace(/index\.html$/i, '')
                .replace(/\.html$/i, '')
                .replace(/\/$/, '');
            return `${parsed.origin}${cleanPath}`;
        } catch (error) {
            return url.replace(/index\.html$/i, '').replace(/\.html$/i, '').replace(/\/$/, '');
        }
    }

    function closeMenu(wrapper, toggle) {
        if (!wrapper || !toggle) return;
        wrapper.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function buildLanguageSwitcher(lang, strings) {
        const group = document.createElement('div');
        group.className = 'wallwall-nav__lang';
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', strings.language);

        [['ko', 'KR'], ['en', 'EN']].forEach(([code, label]) => {
            const option = document.createElement('a');
            option.className = 'wallwall-nav__lang-option';
            option.textContent = label;
            option.href = pathFor(code);
            option.setAttribute('lang', code);
            if (code === lang) {
                option.classList.add('is-active');
                option.setAttribute('aria-current', 'true');
            }
            option.addEventListener('click', () => storeLang(code));
            group.appendChild(option);
        });

        return group;
    }

    function attachNav() {
        if (document.getElementById(NAV_ID)) {
            return;
        }

        const lang = currentLang();
        const strings = STRINGS[lang];

        const nav = document.createElement('nav');
        nav.id = NAV_ID;
        nav.setAttribute('aria-label', strings.navLabel);

        const inner = document.createElement('div');
        inner.className = 'wallwall-nav__inner';

        const brandLink = document.createElement('a');
        brandLink.className = 'wallwall-nav__brand';
        brandLink.href = pathFor(lang);

        // Wordmark: "Wall" in white plus "Wall" in the lighter brand blue
        const brandLabel = document.createElement('span');
        brandLabel.className = 'wallwall-nav__wordmark';
        brandLabel.appendChild(document.createTextNode('Wall'));
        const brandLabelAccent = document.createElement('em');
        brandLabelAccent.textContent = 'Wall';
        brandLabel.appendChild(brandLabelAccent);
        brandLink.appendChild(brandLabel);

        const linksWrapper = document.createElement('div');
        linksWrapper.className = 'wallwall-nav__links';
        linksWrapper.setAttribute('role', 'menubar');

        strings.links.forEach(link => {
            const anchor = document.createElement('a');
            anchor.className = 'wallwall-nav__link';
            anchor.href = link.url;
            anchor.textContent = link.label;
            anchor.setAttribute('role', 'menuitem');
            linksWrapper.appendChild(anchor);
        });

        const actions = document.createElement('div');
        actions.className = 'wallwall-nav__actions';
        actions.appendChild(linksWrapper);
        actions.appendChild(buildLanguageSwitcher(lang, strings));

        const toggleButton = document.createElement('button');
        toggleButton.className = 'wallwall-nav__toggle';
        toggleButton.type = 'button';
        toggleButton.setAttribute('aria-label', strings.openMenu);
        toggleButton.setAttribute('aria-expanded', 'false');

        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'wallwall-nav__toggle-icon';
        toggleButton.appendChild(toggleIcon);
        actions.appendChild(toggleButton);

        inner.appendChild(brandLink);
        inner.appendChild(actions);
        nav.appendChild(inner);

        document.body.prepend(nav);
        document.body.classList.add('wallwall-has-nav');

        const normalizedCurrent = normalizeUrl(window.location.href);
        const navAnchors = linksWrapper.querySelectorAll('.wallwall-nav__link');
        navAnchors.forEach(anchor => {
            const normalizedTarget = normalizeUrl(anchor.href);
            if (normalizedCurrent === normalizedTarget) {
                anchor.classList.add('active');
            }
        });

        toggleButton.addEventListener('click', () => {
            const isOpen = linksWrapper.classList.toggle('is-open');
            toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        linksWrapper.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.classList && target.classList.contains('wallwall-nav__link')) {
                closeMenu(linksWrapper, toggleButton);
            }
        });

        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target)) {
                closeMenu(linksWrapper, toggleButton);
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                closeMenu(linksWrapper, toggleButton);
            }
        });
    }

    if (resolveLanguage()) {
        return;
    }

    document.addEventListener('DOMContentLoaded', attachNav);
})();
