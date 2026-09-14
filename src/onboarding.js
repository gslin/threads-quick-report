const ext = typeof browser !== 'undefined' ? browser : chrome;

const ORIGINS = [
    'https://www.threads.com/*',
    'https://threads.com/*',
    'https://www.threads.net/*',
    'https://threads.net/*'
];

const allowBtn = document.getElementById('allow');
const statusEl = document.getElementById('status');

allowBtn.addEventListener('click', async () => {
    try {
        const granted = await ext.permissions.request({ origins: ORIGINS });
        if (granted) {
            statusEl.textContent = '授權完成。請重整 Threads 頁面。 Permission granted. Reload your Threads tab.';
            allowBtn.disabled = true;
        } else {
            statusEl.textContent = '未授權，擴充套件無法在 Threads 上執行。 Permission denied.';
        }
    } catch (error) {
        statusEl.textContent = error.message;
    }
});
