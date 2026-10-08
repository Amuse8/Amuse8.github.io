(function () {
    const NAV_ID = 'wallwall-nav';
    const lang = window.WallWallLang;

    const STRINGS = {
        ko: {
            brandName: '월월',
            navLabel: '월월 글로벌 내비게이션',
            openMenu: '메뉴 열기',
            language: '언어 선택',
            newTab: '새 탭에서 열림',
            links: [
                { label: '고객지원', url: '/ko/support' },
                { label: '이용약관', url: '/ko/terms' },
                { label: '개인정보처리방침', url: '/ko/privacy' },
                { label: '회사', url: 'https://www.amuse8.kr', external: true }
            ]
        },
        en: {
            brandName: 'WallWall',
            navLabel: 'WallWall global navigation',
            openMenu: 'Open menu',
            language: 'Select language',
            newTab: 'opens in a new tab',
            links: [
                { label: 'Support', url: '/support' },
                { label: 'Terms', url: '/terms' },
                { label: 'Privacy', url: '/privacy' },
                { label: 'Company', url: 'https://www.amuse8.kr', external: true }
            ]
        }
    };

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

    function buildLanguageSwitcher(current, strings) {
        const group = document.createElement('div');
        group.className = 'wallwall-nav__lang';
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', strings.language);

        [['en', 'EN'], ['ko', 'KR']].forEach(([code, label]) => {
            const option = document.createElement('a');
            option.className = 'wallwall-nav__lang-option';
            option.textContent = label;
            option.href = lang.pathFor(code);
            if (window.WallWallCampaign) {
                const target = new URL(option.href);
                target.searchParams.set('campaign', window.WallWallCampaign.campaign);
                option.href = target.href;
            }
            option.setAttribute('lang', code);
            if (code === current) {
                option.classList.add('is-active');
                option.setAttribute('aria-current', 'true');
            }
            option.addEventListener('click', () => lang.storeLang(code));
            group.appendChild(option);
        });

        return group;
    }

    function attachNav() {
        if (document.getElementById(NAV_ID)) {
            return;
        }

        const current = lang.currentLang();
        const strings = STRINGS[current];

        const nav = document.createElement('nav');
        nav.id = NAV_ID;
        nav.setAttribute('aria-label', strings.navLabel);

        const inner = document.createElement('div');
        inner.className = 'wallwall-nav__inner';

        const brandLink = document.createElement('a');
        brandLink.className = 'wallwall-nav__brand';
        brandLink.href = current === 'ko' ? '/ko/' : '/';

        const brandLogo = document.createElement('img');
        brandLogo.className = 'wallwall-nav__logo';
        brandLogo.src = '/assets/wallwall_wordmark_white.png';
        brandLogo.alt = strings.brandName;
        brandLogo.width = 653;
        brandLogo.height = 118;
        brandLink.appendChild(brandLogo);

        const linksWrapper = document.createElement('div');
        linksWrapper.className = 'wallwall-nav__links';
        linksWrapper.setAttribute('role', 'menubar');

        strings.links.forEach(link => {
            const anchor = document.createElement('a');
            anchor.className = 'wallwall-nav__link';
            anchor.href = link.url;
            anchor.setAttribute('role', 'menuitem');
            anchor.appendChild(document.createTextNode(link.label));

            if (link.external) {
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.setAttribute('aria-label', `${link.label} (${strings.newTab})`);
                const arrow = document.createElement('span');
                arrow.className = 'wallwall-nav__link-arrow';
                arrow.setAttribute('aria-hidden', 'true');
                arrow.textContent = '\u2197';
                anchor.appendChild(arrow);
            }

            linksWrapper.appendChild(anchor);
        });

        const actions = document.createElement('div');
        actions.className = 'wallwall-nav__actions';
        actions.appendChild(linksWrapper);
        actions.appendChild(buildLanguageSwitcher(current, strings));

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

    if (!lang || lang.redirecting) {
        return;
    }

    document.addEventListener('DOMContentLoaded', attachNav);
})();
