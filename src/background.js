const ext = typeof browser !== 'undefined' ? browser : chrome;

const ORIGINS = [
    'https://www.threads.com/*',
    'https://threads.com/*',
    'https://www.threads.net/*',
    'https://threads.net/*'
];

function onboardingUrl() {
    return ext.runtime.getURL('onboarding.html');
}

async function hasOrigins() {
    return ext.permissions.contains({ origins: ORIGINS });
}

async function openOnboarding() {
    await ext.tabs.create({ url: onboardingUrl() });
}

ext.runtime.onInstalled.addListener(async () => {
    try {
        if (!(await hasOrigins())) {
            await openOnboarding();
        }
    } catch (error) {
        console.error('[Threads Quick Report] onInstalled failed:', error);
    }
});

ext.action.onClicked.addListener(async (tab) => {
    try {
        if (await hasOrigins()) {
            if (tab?.id) await ext.tabs.reload(tab.id);
            return;
        }

        const granted = await ext.permissions.request({ origins: ORIGINS });
        if (granted && tab?.id) {
            await ext.tabs.reload(tab.id);
            return;
        }

        await openOnboarding();
    } catch (error) {
        console.error('[Threads Quick Report] Permission request failed:', error);
        try {
            await openOnboarding();
        } catch (openError) {
            console.error('[Threads Quick Report] Open onboarding failed:', openError);
        }
    }
});
