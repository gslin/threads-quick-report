const ext = typeof browser !== 'undefined' ? browser : chrome;

const ORIGINS = [
    'https://www.threads.com/*',
    'https://threads.com/*',
    'https://www.threads.net/*',
    'https://threads.net/*'
];

ext.action.onClicked.addListener(async (tab) => {
    try {
        const granted = await ext.permissions.request({ origins: ORIGINS });
        if (granted && tab?.id) {
            await ext.tabs.reload(tab.id);
        }
    } catch (error) {
        console.error('[Threads Quick Report] Permission request failed:', error);
    }
});
