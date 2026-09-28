(function () {
    const LANG_KEY = 'wallwall-lang';
    const KO_PREFIX = /^\/ko(?=\/|$)/;

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
        return KO_PREFIX.test(window.location.pathname) ? 'ko' : 'en';
    }

    /** Path of the current page in the given language, e.g. /privacy <-> /ko/privacy */
    function pathFor(lang) {
        const enPath = window.location.pathname.replace(KO_PREFIX, '') || '/';
        if (lang === 'en') return enPath;
        return enPath === '/' ? '/ko/' : '/ko' + enPath;
    }

    function browserPrefersKorean() {
        const list = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language || navigator.userLanguage || ''];
        const primary = list.filter(Boolean)[0];
        return !!primary && String(primary).toLowerCase().indexOf('ko') === 0;
    }

    function go(path) {
        document.documentElement.style.visibility = 'hidden';
        window.location.replace(path);
        return true;
    }

    /** ?lang= (sent by the /en/* aliases) counts as a choice: saved, then dropped from the URL. */
    function consumeRequestedLang() {
        const params = new URLSearchParams(window.location.search);
        const requested = params.get('lang');
        if (requested !== 'ko' && requested !== 'en') return null;
        storeLang(requested);
        params.delete('lang');
        const query = params.toString();
        const target = pathFor(requested) + (query ? '?' + query : '') + window.location.hash;
        if (requested !== currentLang()) return go(target);
        window.history.replaceState(null, '', target);
        return false;
    }

    /**
     * Unprefixed pages are English and act as the auto-detect entry: a saved choice,
     * then the browser language, can send the visitor to /ko/. A /ko/ URL is itself an
     * explicit choice, so it never redirects away.
     */
    function resolveLanguage() {
        const requested = consumeRequestedLang();
        if (requested !== null) return requested;
        if (currentLang() === 'ko') return false;
        const preferred = readStoredLang() || (browserPrefersKorean() ? 'ko' : 'en');
        if (preferred !== 'ko') return false;
        return go(pathFor('ko') + window.location.search + window.location.hash);
    }

    window.WallWallLang = {
        currentLang: currentLang,
        pathFor: pathFor,
        storeLang: storeLang,
        redirecting: resolveLanguage()
    };
})();
