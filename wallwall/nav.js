(function () {
    const NAV_ID = 'wallwall-nav';
    const BRAND = {
        label: '월월',
        url: 'https://amuse8.github.io/wallwall/download',
        icon: '/assets/app_icon_foreground.png'
    };
    const NAV_LINKS = [
        { label: '회사', url: 'https://www.amuse8.kr/company' },
        { label: '고객지원', url: 'https://amuse8.github.io/wallwall/support' },
        { label: '이용약관', url: 'https://amuse8.github.io/wallwall/terms' },
        { label: '개인정보처리방침', url: 'https://amuse8.github.io/wallwall/privacy' }
    ];

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

    function attachNav() {
        if (document.getElementById(NAV_ID)) {
            return;
        }

        const nav = document.createElement('nav');
        nav.id = NAV_ID;
        nav.setAttribute('aria-label', '월월 글로벌 내비게이션');

        const inner = document.createElement('div');
        inner.className = 'wallwall-nav__inner';

        const brandLink = document.createElement('a');
        brandLink.className = 'wallwall-nav__brand';
        brandLink.href = BRAND.url;

        const brandImage = document.createElement('img');
        brandImage.className = 'wallwall-nav__logo';
        brandImage.src = BRAND.icon;
        brandImage.alt = '월월 앱 아이콘';
        brandLink.appendChild(brandImage);

        const brandLabel = document.createElement('span');
        brandLabel.textContent = BRAND.label;
        brandLink.appendChild(brandLabel);

        const linksWrapper = document.createElement('div');
        linksWrapper.className = 'wallwall-nav__links';
        linksWrapper.setAttribute('role', 'menubar');

        NAV_LINKS.forEach(link => {
            const anchor = document.createElement('a');
            anchor.className = 'wallwall-nav__link';
            anchor.href = link.url;
            anchor.textContent = link.label;
            anchor.setAttribute('role', 'menuitem');
            linksWrapper.appendChild(anchor);
        });

        const toggleButton = document.createElement('button');
        toggleButton.className = 'wallwall-nav__toggle';
        toggleButton.type = 'button';
        toggleButton.setAttribute('aria-label', '메뉴 열기');
        toggleButton.setAttribute('aria-expanded', 'false');

        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'wallwall-nav__toggle-icon';
        toggleButton.appendChild(toggleIcon);

        inner.appendChild(brandLink);
        inner.appendChild(linksWrapper);
        inner.appendChild(toggleButton);
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

    document.addEventListener('DOMContentLoaded', attachNav);
})();
