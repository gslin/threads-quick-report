(function() {
    'use strict';

    // Multi-language labels
    const REPORT_LABELS = ['Report', '檢舉'];
    const DONE_LABELS = ['Done', '完成'];

    // Consolidated report configuration
    const REPORT_CONFIG = {
        bullying: {
            label: 'Bully',
            title: 'Bullying or harassment',
            category: ['Bullying or unwanted contact', '霸凌或擾人的聯繫'],
            categoryIndex: 1,
            subcategory: ['Bullying or harassment', '霸凌或騷擾'],
            subcategoryIndex: 0,
            extraSteps: [
                { labels: ["I don't know them", '我不認識對方'], fallbackIndex: -1 },
                { labels: ['No', '否'], fallbackIndex: -1 }
            ]
        },
        spam: {
            label: 'Spam',
            title: 'Spam',
            category: ['Scam, fraud or spam', '詐騙、詐欺或垃圾訊息'],
            categoryIndex: 6,
            subcategory: ['Spam', '垃圾訊息'],
            subcategoryIndex: 1
        },
        hate: {
            label: 'Hate',
            title: 'Hate speech or symbols',
            category: ['Violence, hate or exploitation', '暴力、仇恨或剝削'],
            categoryIndex: 3,
            subcategory: ['Hate speech or symbols', '仇恨言論或象徵符號'],
            subcategoryIndex: 1
        },
        fraud: {
            label: 'Fraud',
            title: 'Fraud or scam',
            category: ['Scam, fraud or spam', '詐騙、詐欺或垃圾訊息'],
            categoryIndex: 6,
            subcategory: ['Fraud or scam', '詐欺或詐騙'],
            subcategoryIndex: 0
        },
        false: {
            label: 'False',
            title: 'False information',
            category: ['False information', '不實資訊'],
            categoryIndex: 7
        }
    };

    const POST_MORE_ICON_PATH_PREFIX = 'M4 14C5.10457 14';
    const REPORT_ICON_PATH_PREFIX = 'M12.001 15.0625C12.6223 15.0625';
    const REPORT_MENU_ITEM_INDEX = 6;

    // --- Utility functions ---

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function normalizeText(text = '') {
        return String(text ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function getLast(arr) {
        return arr[arr.length - 1] || null;
    }

    function isVisible(element) {
        if (!element || !document.contains(element)) return false;
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function matchesLabels(element, labels = []) {
        if (!element || !labels.length) return false;
        const candidates = [element.getAttribute('aria-label'), element.textContent]
            .map(normalizeText)
            .filter(Boolean);
        return labels.some(label => candidates.includes(normalizeText(label)));
    }

    function hasPathPrefix(element, prefix) {
        return Array.from(element.querySelectorAll('path')).some(path =>
            (path.getAttribute('d') || '').startsWith(prefix)
        );
    }

    function resolveFallbackIndex(elements, fallbackIndex) {
        if (!elements.length || fallbackIndex == null) return null;
        const idx = fallbackIndex < 0 ? elements.length + fallbackIndex : fallbackIndex;
        return elements[idx] || null;
    }

    function dispatchClick(element) {
        if (!element) return;
        if (typeof element.focus === 'function') {
            element.focus({ preventScroll: true });
        }
        const rect = element.getBoundingClientRect();
        const baseInit = {
            bubbles: true, cancelable: true, composed: true,
            button: 0, buttons: 1,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
        };
        if (typeof PointerEvent === 'function') {
            const pointerInit = { ...baseInit, isPrimary: true, pointerId: 1, pointerType: 'mouse' };
            element.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
            element.dispatchEvent(new PointerEvent('pointerup', pointerInit));
        }
        element.dispatchEvent(new MouseEvent('mousedown', baseInit));
        element.dispatchEvent(new MouseEvent('mouseup', baseInit));
        element.click();
    }

    // --- DOM query helpers ---

    function getMenus() {
        return Array.from(document.querySelectorAll('[role="menu"]')).filter(el => document.contains(el));
    }

    function getActiveMenu() {
        return getLast(getMenus());
    }

    function getMenuItems(menu = getActiveMenu()) {
        if (!menu) return [];
        return Array.from(menu.querySelectorAll('[role="menuitem"], [role="button"]'))
            .filter(item => document.contains(item) && item.closest('[role="menu"]') === menu);
    }

    function getMenuSignature(menu = getActiveMenu()) {
        return getMenuItems(menu)
            .map(item => normalizeText(item.getAttribute('aria-label') || item.textContent))
            .join('|');
    }

    function getActiveDialog() {
        return getLast(Array.from(document.querySelectorAll('[role="dialog"]')).filter(isVisible));
    }

    function getDialogChoiceButtons(dialog = getActiveDialog()) {
        if (!dialog) return [];
        return Array.from(dialog.querySelectorAll('[role="button"][tabindex="0"][aria-label]'))
            .filter(btn => isVisible(btn) && btn.closest('[role="dialog"]') === dialog);
    }

    function getDialogOptionButtons(dialog = getActiveDialog()) {
        const buttons = getDialogChoiceButtons(dialog);
        const iconButtons = buttons.filter(btn => btn.querySelector('[data-bloks-name="ig.components.Icon"]'));
        return iconButtons.length > 0 ? iconButtons : buttons.filter(btn => btn.getBoundingClientRect().height >= 36);
    }

    function getDialogOptionSignature(dialog = getActiveDialog()) {
        return getDialogOptionButtons(dialog)
            .map(btn => normalizeText(btn.getAttribute('aria-label') || btn.textContent))
            .join('|');
    }

    function getDialogActionButtons(dialog = getActiveDialog()) {
        if (!dialog) return [];
        return Array.from(dialog.querySelectorAll('[role="button"]'))
            .filter(btn => isVisible(btn) && btn.closest('[role="dialog"]') === dialog);
    }

    // --- Async waiting ---

    function waitForResult(getResult, description, timeout = 5000) {
        return new Promise((resolve, reject) => {
            let timeoutId = null;
            const finish = (value, error, observer) => {
                observer?.disconnect();
                if (timeoutId !== null) clearTimeout(timeoutId);
                error ? reject(error) : resolve(value);
            };
            const tryGet = (observer) => {
                const result = getResult();
                if (result) { finish(result, null, observer); return true; }
                return false;
            };
            if (tryGet(null)) return;

            const observer = new MutationObserver(() => tryGet(observer));
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
            timeoutId = setTimeout(() => finish(null, new Error(`Timeout waiting for ${description}`), observer), timeout);
        });
    }

    // --- Report menu/dialog navigation ---

    function isPostMoreSvg(svg) {
        return svg?.getAttribute('viewBox') === '0 0 24 24' && hasPathPrefix(svg, POST_MORE_ICON_PATH_PREFIX);
    }

    function findReportMenuItem(menu = getActiveMenu()) {
        const menuItems = getMenuItems(menu).filter(item => item.getAttribute('role') === 'menuitem');
        return menuItems.find(item => matchesLabels(item, REPORT_LABELS))
            || menuItems.find(item => hasPathPrefix(item, REPORT_ICON_PATH_PREFIX))
            || resolveFallbackIndex(menuItems, REPORT_MENU_ITEM_INDEX);
    }

    function findReportButton(previousMenu = null) {
        const activeMenu = getActiveMenu();
        if (activeMenu && activeMenu !== previousMenu) {
            const item = findReportMenuItem(activeMenu);
            if (item) return item;
        }
        for (const menu of getMenus().reverse()) {
            const item = findReportMenuItem(menu);
            if (item) return item;
        }
        const items = Array.from(document.querySelectorAll('[role="menuitem"], [role="button"]'))
            .filter(item => document.contains(item));
        return items.find(item => matchesLabels(item, REPORT_LABELS))
            || items.find(item => hasPathPrefix(item, REPORT_ICON_PATH_PREFIX))
            || null;
    }

    function waitForReportButton(timeout = 5000, previousMenu = null) {
        return waitForResult(() => findReportButton(previousMenu), 'Report button', timeout);
    }

    function waitForDialog(previousDialog = null, timeout = 5000) {
        return waitForResult(() => {
            const dialog = getActiveDialog();
            return (dialog && dialog !== previousDialog) ? dialog : null;
        }, 'Report dialog', timeout);
    }

    async function openReportDialog(previousMenu = null, previousDialog = null) {
        const previousMenuSignature = getMenuSignature(previousMenu);
        let reportBtn = await waitForReportButton(5000, previousMenu);
        await sleep(100);

        if (!reportBtn.isConnected || !isVisible(reportBtn)) {
            reportBtn = findReportButton(previousMenu) || reportBtn;
        }
        const activeMenu = getActiveMenu();
        if (activeMenu && activeMenu === previousMenu && getMenuSignature(activeMenu) === previousMenuSignature) {
            reportBtn = findReportMenuItem(activeMenu) || reportBtn;
        }

        dispatchClick(reportBtn);
        try {
            await waitForDialog(previousDialog, 1500);
        } catch (error) {
            const retryBtn = findReportButton(previousMenu) || findReportMenuItem(getActiveMenu());
            if (!retryBtn) throw error;
            await sleep(100);
            dispatchClick(retryBtn);
            await waitForDialog(previousDialog, 3000);
        }
    }

    function findDialogOptionButton(labels, fallbackIndex, previousSignature = null) {
        const dialog = getActiveDialog();
        if (!dialog) return null;
        if (previousSignature !== null && getDialogOptionSignature(dialog) === previousSignature) return null;

        return getDialogChoiceButtons(dialog).find(btn => matchesLabels(btn, labels))
            || resolveFallbackIndex(getDialogOptionButtons(dialog), fallbackIndex);
    }

    async function clickDialogOption(labels, fallbackIndex, previousSignature = null) {
        const description = labels?.[0] || `dialog option ${fallbackIndex}`;
        const button = await waitForResult(
            () => findDialogOptionButton(labels, fallbackIndex, previousSignature),
            description, 5000
        );
        const currentSignature = getDialogOptionSignature(button.closest('[role="dialog"]'));
        await sleep(100);
        dispatchClick(button);
        return currentSignature;
    }

    function findDoneButton(previousSignature = null) {
        const dialog = getActiveDialog();
        if (!dialog) return null;
        if (previousSignature !== null && getDialogOptionSignature(dialog) === previousSignature) return null;

        const buttons = getDialogActionButtons(dialog);
        const labelledButton = buttons.find(btn => matchesLabels(btn, DONE_LABELS));
        if (labelledButton) return labelledButton;

        const optionButtons = new Set(getDialogOptionButtons(dialog));
        const dialogRect = dialog.getBoundingClientRect();
        const candidates = buttons.filter(btn =>
            !optionButtons.has(btn) && btn.getBoundingClientRect().top > dialogRect.top + 80
        );
        return candidates.length === 1 ? candidates[0] : null;
    }

    async function clickOptionalDone(previousSignature = null, timeout = 3000) {
        try {
            const doneBtn = await waitForResult(() => findDoneButton(previousSignature), 'Done button', timeout);
            await sleep(100);
            dispatchClick(doneBtn);
            return true;
        } catch { return false; }
    }

    // --- Report flow ---

    async function performReport(moreButton, config) {
        try {
            const previousMenu = getActiveMenu();
            const previousDialog = getActiveDialog();
            dispatchClick(moreButton);

            await openReportDialog(previousMenu, previousDialog);

            // Click category
            let previousSignature = await clickDialogOption(config.category, config.categoryIndex);

            // Click subcategory if present
            if (config.subcategory) {
                previousSignature = await clickDialogOption(
                    config.subcategory, config.subcategoryIndex, previousSignature
                );
            }

            // Click extra steps if present (e.g., bullying flow)
            if (config.extraSteps) {
                for (const step of config.extraSteps) {
                    previousSignature = await clickDialogOption(step.labels, step.fallbackIndex, previousSignature);
                }
            }

            await clickOptionalDone(previousSignature);

            const desc = config.subcategory
                ? `${config.category[0]} > ${config.subcategory[0]}`
                : config.category[0];
            console.log(`[Threads Quick Report] Reported as: ${desc}`);
        } catch (error) {
            console.error('[Threads Quick Report] Error:', error);
            alert(`Report failed: ${error.message}`);
        }
    }

    // --- UI injection ---

    function injectStyles() {
        if (document.getElementById('threads-quick-report-styles')) return;
        const style = document.createElement('style');
        style.id = 'threads-quick-report-styles';
        style.textContent = `
            .threads-quick-report-container {
                display: flex; align-items: center; gap: 2px; margin-right: 4px;
            }
            .threads-quick-report-btn {
                background: transparent;
                border: 1px solid currentColor;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                padding: 2px 6px;
                opacity: 0.6;
                transition: opacity 0.2s, background 0.2s;
                color: inherit;
            }
            .threads-quick-report-btn:hover {
                opacity: 1;
                background: var(--barcelona-hover-background, rgba(128, 128, 128, 0.2));
            }
        `;
        document.head.appendChild(style);
    }

    function createQuickReportButtons(moreButton) {
        const container = document.createElement('div');
        container.className = 'threads-quick-report-container';

        for (const [key, config] of Object.entries(REPORT_CONFIG)) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'threads-quick-report-btn';
            btn.textContent = config.label;
            btn.title = config.title;
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                performReport(moreButton, config);
            };
            container.appendChild(btn);
        }

        return container;
    }

    function hasQuickReportButton(moreButton) {
        return moreButton.parentElement?.parentElement?.querySelector('.threads-quick-report-container') !== null;
    }

    function injectButtons() {
        injectStyles();

        Array.from(document.querySelectorAll('[role="button"] svg'))
            .filter(svg => isPostMoreSvg(svg))
            .forEach(svg => {
                if (svg.closest('[role="dialog"]') || svg.closest('#barcelona-header')) return;

                const moreButton = svg.closest('[role="button"]');
                if (!moreButton || moreButton.querySelector('span')) return;
                if (hasQuickReportButton(moreButton)) return;

                const outerContainer = moreButton.parentElement?.parentElement;
                if (!outerContainer) return;

                outerContainer.insertBefore(createQuickReportButtons(moreButton), moreButton.parentElement);
            });
    }

    // --- Init ---

    injectButtons();

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0)) {
            clearTimeout(observer.debounceTimer);
            observer.debounceTimer = setTimeout(injectButtons, 200);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('[Threads Quick Report] Loaded');
})();
