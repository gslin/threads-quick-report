(function() {
    'use strict';

    // Multi-language labels for Report button
    const REPORT_LABELS = ['Report', '檢舉'];

    // Multi-language labels for Done button
    const DONE_LABELS = ['Done', '完成'];

    // Multi-language labels for "I don't know them" button (bullying flow)
    const DONT_KNOW_THEM_LABELS = ["I don't know them", '我不認識對方'];

    // Multi-language labels for "No" button (bullying flow)
    const NO_LABELS = ['No', '否'];

    // Report category mapping (first level) - array for multi-language support
    const REPORT_CATEGORIES = {
        'bullying': ['Bullying or unwanted contact', '霸凌或擾人的聯繫'],
        'spam': ['Scam, fraud or spam', '詐騙、詐欺或垃圾訊息'],
        'hate': ['Violence, hate or exploitation', '暴力、仇恨或剝削'],
        'fraud': ['Scam, fraud or spam', '詐騙、詐欺或垃圾訊息'],
        'false': ['False information', '不實資訊']
    };

    // Sub-category mapping (second level, if needed) - array for multi-language support
    const REPORT_SUBCATEGORIES = {
        'bullying': ['Bullying or harassment', '霸凌或騷擾'],
        'spam': ['Spam', '垃圾訊息'],
        'hate': ['Hate speech or symbols', '仇恨言論或象徵符號'],
        'fraud': ['Fraud or scam', '詐欺或詐騙']
    };

    // Button labels (short) and tooltips
    const REPORT_BUTTONS = {
        'bullying': { label: 'Bully', title: 'Bullying or harassment' },
        'spam': { label: 'Spam', title: 'Spam' },
        'hate': { label: 'Hate', title: 'Hate speech or symbols' },
        'fraud': { label: 'Fraud', title: 'Fraud or scam' },
        'false': { label: 'False', title: 'False information' }
    };

    // Wait for element to appear
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
        });
    }

    // Find Report button in menu by text content (multi-language)
    function findReportButton() {
        const buttons = document.querySelectorAll('[role="button"]');
        for (const btn of buttons) {
            const span = btn.querySelector('span');
            if (span && REPORT_LABELS.includes(span.textContent.trim())) {
                return btn;
            }
        }
        return null;
    }

    // Wait for Report button to appear
    function waitForReportButton(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const btn = findReportButton();
            if (btn) {
                resolve(btn);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const btn = findReportButton();
                if (btn) {
                    obs.disconnect();
                    resolve(btn);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for Report button'));
            }, timeout);
        });
    }

    // Perform the automated report flow (multi-language support)
    async function performReport(moreButton, categoryLabels, reportKey) {
        try {
            // Step 1: Click the More button
            moreButton.click();

            // Step 2: Wait for menu and click Report
            const reportBtn = await waitForReportButton();
            await new Promise(r => setTimeout(r, 100));
            reportBtn.click();

            // Step 3: Wait for dialog and click the category (try all language versions)
            let categoryBtn = null;
            for (const label of categoryLabels) {
                const selector = `[role="dialog"] [role="button"][aria-label="${label}"]`;
                categoryBtn = document.querySelector(selector);
                if (categoryBtn) break;
            }

            if (!categoryBtn) {
                // If not found immediately, use waitForElement with combined selectors
                const selectors = categoryLabels.map(l =>
                    `[role="dialog"] [role="button"][aria-label="${l}"]`
                ).join(', ');
                categoryBtn = await waitForElement(selectors);
            }

            await new Promise(r => setTimeout(r, 100));
            categoryBtn.click();

            // Step 4: If there's a subcategory, click it too (try all language versions)
            const subcategoryLabels = REPORT_SUBCATEGORIES[reportKey];
            if (subcategoryLabels) {
                let subBtn = null;
                for (const label of subcategoryLabels) {
                    const selector = `[role="dialog"] [role="button"][aria-label="${label}"]`;
                    subBtn = document.querySelector(selector);
                    if (subBtn) break;
                }

                if (!subBtn) {
                    const selectors = subcategoryLabels.map(l =>
                        `[role="dialog"] [role="button"][aria-label="${l}"]`
                    ).join(', ');
                    subBtn = await waitForElement(selectors);
                }

                await new Promise(r => setTimeout(r, 100));
                subBtn.click();
            }

            // Step 4.5: For bullying reports, handle additional questions
            if (reportKey === 'bullying') {
                // Click "I don't know them"
                const dontKnowSelectors = DONT_KNOW_THEM_LABELS.map(l =>
                    `[role="dialog"] [role="button"][aria-label="${l}"]`
                ).join(', ');
                const dontKnowBtn = await waitForElement(dontKnowSelectors);
                await new Promise(r => setTimeout(r, 100));
                dontKnowBtn.click();

                // Click "No"
                const noSelectors = NO_LABELS.map(l =>
                    `[role="dialog"] [role="button"][aria-label="${l}"]`
                ).join(', ');
                const noBtn = await waitForElement(noSelectors);
                await new Promise(r => setTimeout(r, 100));
                noBtn.click();
            }

            // Step 5: Wait for and click the Done button
            const doneSelectors = DONE_LABELS.map(l =>
                `[role="dialog"] [role="button"][aria-label="${l}"]`
            ).join(', ');
            const doneBtn = await waitForElement(doneSelectors);
            await new Promise(r => setTimeout(r, 100));
            doneBtn.click();

            console.log(`[Threads Quick Report] Reported as: ${categoryLabels[0]}${subcategoryLabels ? ' > ' + subcategoryLabels[0] : ''}`);
        } catch (error) {
            console.error('[Threads Quick Report] Error:', error);
            alert(`Report failed: ${error.message}`);
        }
    }

    // Create the quick report buttons
    function createQuickReportButtons(moreButton) {
        const container = document.createElement('div');
        container.className = 'threads-quick-report-container';
        container.style.cssText = 'display: flex; align-items: center; gap: 2px; margin-right: 4px;';

        for (const [key, config] of Object.entries(REPORT_BUTTONS)) {
            const btn = document.createElement('button');
            btn.className = 'threads-quick-report-btn';
            btn.textContent = config.label;
            btn.title = config.title;
            btn.style.cssText = `
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
            `;
            btn.onmouseenter = () => {
                btn.style.opacity = '1';
                btn.style.background = 'var(--barcelona-hover-background, rgba(128, 128, 128, 0.2))';
            };
            btn.onmouseleave = () => {
                btn.style.opacity = '0.6';
                btn.style.background = 'transparent';
            };
            btn.onclick = (e) => {
                e.stopPropagation();
                performReport(moreButton, REPORT_CATEGORIES[key], key);
            };
            container.appendChild(btn);
        }

        return container;
    }

    // Check if a More button already has our quick report button
    function hasQuickReportButton(moreButton) {
        const outerContainer = moreButton.parentElement?.parentElement;
        return outerContainer?.querySelector('.threads-quick-report-container') !== null;
    }

    // Inject quick report buttons
    function injectButtons() {
        const moreSvgs = document.querySelectorAll('svg[aria-label="More"], svg[aria-label="更多"]');

        moreSvgs.forEach(svg => {
            // Only target post More buttons (three dots icon uses <path> elements)
            // Navigation bar More button uses <rect> elements (hamburger menu)
            if (!svg.querySelector('path')) return;

            // Skip if inside a dialog (e.g., compose dialog)
            if (svg.closest('[role="dialog"]')) return;

            // Skip if inside the site header navigation
            if (svg.closest('#barcelona-header')) return;

            // Find the clickable button container (role="button" ancestor)
            let moreButton = svg.closest('[role="button"]');
            if (!moreButton) return;

            // Check if already injected
            if (hasQuickReportButton(moreButton)) return;

            // Find the outermost container (go up 2 levels from moreButton)
            const outerContainer = moreButton.parentElement?.parentElement;
            if (!outerContainer) return;

            const quickReportBtns = createQuickReportButtons(moreButton);
            outerContainer.insertBefore(quickReportBtns, moreButton.parentElement);
        });
    }

    // Initial injection
    injectButtons();

    // Watch for new posts being loaded
    const observer = new MutationObserver((mutations) => {
        let shouldInject = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldInject = true;
                break;
            }
        }
        if (shouldInject) {
            // Debounce the injection
            clearTimeout(observer.debounceTimer);
            observer.debounceTimer = setTimeout(injectButtons, 200);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[Threads Quick Report] Loaded');
})();
