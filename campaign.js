(function () {
    const campaign = new URLSearchParams(window.location.search).get('campaign');
    if (campaign !== 'yt_ko' && campaign !== 'yt_en') return;

    window.WallWallCampaign = { campaign };
    const appStore = new URL('https://apps.apple.com/app/apple-store/id6755675499');
    appStore.searchParams.set('pt', '128291906');
    appStore.searchParams.set('ct', campaign);
    appStore.searchParams.set('mt', '8');
    const googlePlay = new URL('https://play.google.com/store/apps/details');
    googlePlay.searchParams.set('id', 'kr.amuse8.wallwallnews');
    googlePlay.searchParams.set('referrer', `utm_source=youtube&utm_medium=channel_link&utm_campaign=${campaign}`);

    document.querySelectorAll('.app-link').forEach(anchor => {
        const destination = new URL(anchor.href);
        if (destination.hostname === 'apps.apple.com') anchor.href = appStore.href;
        if (destination.hostname === 'play.google.com') anchor.href = googlePlay.href;
    });
})();
