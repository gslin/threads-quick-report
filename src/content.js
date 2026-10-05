(function() {
    'use strict';

    console.log('[Threads Quick Report] Loaded');

    // Report flow labels for all Threads web locales (collected via ?hl=<locale>)
    const LABELS = {
        report: [
            'Report', '檢舉', 'Rapporteer', 'إبلاغ', 'Докладване', 'Nahlásit', 'Anmeld', 'Melden', 'Αναφορά',
            'Reportar', 'گزارش دادن', 'Ilmianna', 'Signaler', 'דיווח', 'रिपोर्ट करें', 'Prijavi', 'Jelentés',
            'Laporkan', 'Segnala', '報告する', '신고하기', 'Lapor', 'Rapporter', 'Rapporteren', 'Zgłoś', 'Denunciar',
            'Raportează', 'Пожаловаться', 'Nahlásiť', 'Пријавите', 'Anmäl', 'รายงาน', 'I-report', 'Şikayet Et',
            'Поскаржитися', 'Báo cáo', '举报', '舉報'
        ],
        bullying: [
            'Bullying or unwanted contact', '霸凌或擾人的聯繫', 'Afknouery of ongewenste kontak',
            'مضايقة أو تواصل غير مرغوب فيه', 'Малтретиране или нежелан контакт', 'Šikana nebo nevyžádaný kontakt',
            'Mobning eller uønsket kontakt', 'Mobbing oder unerwünschte Kontaktaufnahme',
            'Εκφοβισμός ή ανεπιθύμητη επικοινωνία', 'Bullying o contacto no deseado', 'قلدری یا تماس ناخواسته',
            'Kiusaaminen tai ei-toivottu yhteydenotto', 'Intimidation ou contact indésirable',
            'בריונות או קשר לא רצוי', 'धमकाना या अनचाहा संपर्क', 'Maltretiranje ili neželjeni kontakt',
            'Megfélemlítés vagy nemkívánatos kapcsolatteremtés',
            'Perundungan (bullying) atau kontak yang tidak diinginkan', 'Bullismo o contatto indesiderato',
            'いじめ、または望まない接触', '따돌림 또는 원치 않는 연락', 'Pembulian atau hubungan yang tidak diingini',
            'Mobbing eller uønsket kontakt', 'Pesten of ongewenst contact', 'Nękanie lub niechciane kontakty',
            'Bullying ou contacto indesejado', 'Bullying ou contato indesejado', 'Bullying sau contacte nedorite',
            'Травля или нежелательный контакт', 'Šikanovanie alebo neželaný kontakt',
            'Малтретирање или нежељени контакт', 'Mobbning eller oönskad kontakt',
            'การกลั่นแกล้งหรือการติดต่อที่ไม่พึงประสงค์', 'Pambu-bully, o hindi kanais-nais na pakikipag-ugnayan',
            'Zorbalık veya istenmeyen iletişim', 'Цькування або небажаний контакт',
            'Bắt nạt hoặc liên hệ theo cách không mong muốn', '欺凌或扰人联系', '欺凌或擾人的聯繫'
        ],
        bullyingSub: [
            'Bullying or harassment', '霸凌或騷擾', 'Afknouery of teistering', 'مضايقة أو إساءة',
            'Малтретиране или тормоз', 'Šikana nebo obtěžování', 'Mobning eller chikane',
            'Mobbing oder Belästigung', 'Εκφοβισμός ή παρενόχληση', 'Bullying o acoso',
            'قلدری یا آزار\u200cو\u200cاذیت', 'Kiusaaminen tai häirintä', 'Intimidation ou harcèlement',
            'בריונות או הטרדה', 'यह कंटेंट धमकाने या उत्पीड़न करने से संबंधित है',
            'Maltretiranje ili uznemiravanje', 'Megfélemlítés vagy zaklatás',
            'Perundungan (bullying) atau pelecehan', 'Bullismo o intimidazioni', 'いじめまたは嫌がらせ', '따돌림 또는 괴롭힘',
            'Membuli atau mengganggu', 'Mobbing eller trakassering', 'Pesten of intimidatie',
            'Nękanie lub prześladowanie', 'Bullying ou assédio', 'Bullying sau hărţuire',
            'Травля или преследование', 'Šikanovanie alebo obťažovanie', 'Претње или узнемиравање',
            'Mobbning eller trakasserier', 'การกลั่นแกล้งหรือการคุกคาม', 'Pambu-bully o pangha-harass',
            'Zorbalık veya taciz', 'Цькування чи переслідування', 'Bắt nạt hoặc quấy rối', '欺凌或骚扰', '欺凌或騷擾'
        ],
        unknownPerson: [
            'I don’t know them', '我不認識對方', 'Ek ken hulle nie', 'لا أعرفه', 'Не го познавам',
            'Daného člověka neznám', 'Jeg kender dem ikke', 'Ich kenne ihn/sie nicht', 'Δεν γνωρίζω τον χρήστη',
            "I don't know them", 'Alguien que no conozco', 'او را نمی\u200cشناسم', 'En tunne tätä henkilöä',
            'Je ne connais pas', 'האדם הזה לא מוכר לי', 'मैं उन्हें नहीं जानता', 'Ne poznajem tu osobu',
            'Nem ismerem', 'Saya tidak mengenalnya', 'Una persona che non conosco', '知り合いではない', '모르는 사람임',
            'Saya tidak mengenalinya', 'Jeg kjenner ikke vedkommende', 'Ik ken deze persoon niet',
            'Nie znam tej osoby', 'Não conheço', 'Não conheço a pessoa', 'Nu o cunosc pe această persoană',
            'Я не знаю этого человека', 'Tohto používateľa nepoznám', 'Не познајем ту особу', 'Jag känner inte hen',
            'ฉันไม่รู้จัก', 'Hindi ko sila kilala', 'Kendisini tanımıyorum', 'Я не знаю цю людину',
            'Tôi không biết người này', '我不认识的人'
        ],
        no: [
            'No', '否', 'Nee', 'لا', 'Не', 'Ne', 'Nej', 'Nein', 'Όχι', 'خیر', 'Ei', 'Non', 'לא', 'नहीं', 'Nem',
            'Tidak', 'いいえ', '아니요', 'Nei', 'Nie', 'Não', 'Nu', 'Нет', 'ไม่ใช่', 'Hindi', 'Hayır', 'Ні', 'Không'
        ],
        violence: [
            'Violence, hate or exploitation', '暴力、仇恨或剝削', 'Geweld, haat of uitbuiting', 'عنف أو كراهية أو استغلال',
            'Насилие, омраза или експлоатация', 'Násilí, nenávistné projevy nebo zneužívání',
            'Vold, had eller udnyttelse', 'Gewalt, Hass oder Ausbeutung', 'Βία, μίσος ή εκμετάλλευση',
            'Violencia, odio o explotación', 'خشونت، نفرت یا بهره\u200cکشی', 'Väkivalta, viha tai hyväksikäyttö',
            'Violence, haine ou exploitation', 'אלימות, שנאה או ניצול', 'हिंसा, नफ़रत या शोषण',
            'Nasilje, mržnja ili iskorištavanje', 'Erőszak, gyűlölet vagy mások kihasználása',
            'Kekerasan, kebencian, atau eksploitasi', 'Violenza, odio o sfruttamento', '暴力、ヘイト、または搾取',
            '폭력, 혐오 또는 학대', 'Keganasan, kebencian atau eksploitasi', 'Vold, hat eller utnyttelse',
            'Przemoc, nienawiść lub wykorzystywanie', 'Violência, ódio ou exploração',
            'Violenţă, incitare la ură sau exploatare', 'Насилие, ненависть или эксплуатация',
            'Násilie, nenávisť alebo vykorisťovanie', 'Насиље, мржња или искоришћавање',
            'Våld, hat eller utnyttjande', 'ความรุนแรง ความเกลียดชัง หรือการแสวงหาประโยชน์',
            'Karahasan, galit o pananamantala', 'Şiddet, nefret veya sömürü',
            'Насильство, ворожнеча або експлуатація', 'Bạo lực, thù ghét hoặc bóc lột', '暴力、仇恨或剥削'
        ],
        hate: [
            'Hate speech or symbols', '仇恨言論或象徵符號', 'Haatspraak of -simbole', 'رموز أو خطاب يحض على الكراهية',
            'Омразна реч или символи', 'Nenávistné slovní projevy nebo symboly', 'Hadefuld retorik eller symbolik',
            'Hassrede oder -symbole', 'Εκφράσεις ή σύμβολα μίσους', 'Lenguaje o símbolos que incitan al odio',
            'نمادها یا سخنان نفرت\u200cپراکنی', 'Vihapuhe tai -symbolit', 'Discours ou symboles haineux',
            'דברי שטנה או סמלי שטנה', 'नफ़रत फैलाने वाली भाषा या प्रतीक', 'Govor ili simboli mržnje',
            'Gyűlöletbeszéd vagy gyűlöletkeltő szimbólumok', 'Ujaran atau simbol kebencian',
            "Discorsi o simboli che incitano all'odio", 'ヘイトスピーチまたは差別的なシンボル', '혐오 발언 또는 상징',
            'Ucapan atau simbol berunsur kebencian', 'Hatefulle ytringer eller symboler',
            'Haatdragend taalgebruik of haatdragende symbolen', 'Mowa nienawiści lub zakazane symbole',
            'Discurso ou símbolos de incentivo ao ódio', 'Símbolos ou discurso de ódio',
            'Limbaj sau simboluri care incită la ură', 'Враждебные высказывания или символы',
            'Nenávistné prejavy alebo symboly', 'Говор или симболи мржње', 'Hatretorik eller hatsymboler',
            'คำพูดหรือสัญลักษณ์ที่แสดงความเกลียดชัง', 'Hate speech o mga simbolo', 'Nefret söylemi veya sembolleri',
            'Мова ворожнечі або ворожі символи', 'Biểu tượng hoặc ngôn từ gây thù ghét', '仇恨言论或符号'
        ],
        scam: [
            'Scam, fraud or spam', '詐騙、詐欺或垃圾訊息', 'Strooipos, bedrog of swendelary',
            'خداع أو احتيال أو محتوى غير مهم أو احتيالي', 'Мошеничество, измама или спам',
            'Podvod, podfuk nebo spam', 'Svindel, bedrageri eller spam', 'Betrug oder Spam',
            'Απάτη, παραπλάνηση ή σπαμ', 'Estafa, fraude o spam', 'کلاهبرداری، فریب یا هرزنامه',
            'Huijaus, petos tai roskaposti', 'Arnaque, fraude ou spam', 'Arnaque, fraude ou contenu indésirable',
            'הונאה, תרמית או ספאם', 'स्कैम, धोखाधड़ी या स्पैम', 'Obmana, prijevara ili neželjeni sadržaj',
            'Átverés, csalás vagy kéretlen tartalom', 'Penipuan, penggelapan, atau spam', 'Truffa, frode o spam',
            '詐欺またはスパム', '스캠, 사기 또는 스팸', 'Scam, penipuan atau spam', 'Scam, fraude of spam',
            'Scam, oszustwo lub spam', 'Burla, fraude ou spam', 'Golpe, fraude ou spam',
            'Spam, înşelătorie sau fraudă', 'Мошенничество, обман или спам', 'Podvod, podvodný trik alebo spam',
            'Превара или непожељан садржај', 'Bluff, bedrägeri eller skräppost', 'การหลอกลวง การฉ้อโกง หรือสแปม',
            'Scam, fraud o spam', 'Dolandırıcılık, sahtekarlık veya spam', 'Шахрайство, обман або спам',
            'Lừa đảo, gian lận hoặc spam', '欺诈、诈骗或垃圾信息', '詐騙、欺詐或垃圾訊息'
        ],
        fraud: [
            'Fraud or scam', '詐欺或詐騙', 'Bedrog of swendelary', 'احتيال أو خداع', 'Измама или скам', 'Podvod',
            'Bedrag eller svindel', 'Betrug oder Scam', 'Απάτη', 'Fraude o estafa', 'تقلب یا کلاهبرداری',
            'Petos tai huijaus', 'Fraude ou arnaque', 'תרמית או הונאה', 'धोखाधड़ी या स्कैम', 'Prijevara ili obmana',
            'Csalás vagy átverés', 'Penggelapan atau penipuan', 'Frode o truffa', '詐欺行為', '거짓 또는 사기',
            'Penipuan atau scam', 'Bedrageri eller svindel', 'Fraude of bedrog', 'Oszustwo', 'Fraude ou burla',
            'Fraude ou golpe', 'Fraudă sau înşelătorie', 'Мошенничество или обман', 'Превара',
            'Bedrägeri eller bluff', 'การหลอกลวงหรือการต้มตุ๋น', 'Panloloko o scam',
            'Dolandırıcılık veya sahtekarlık', 'Шахрайство', 'Gian lận hoặc lừa đảo', '欺诈或诈骗', '欺詐或詐騙'
        ],
        spam: [
            'Spam', '垃圾訊息', 'Strooipos', 'محتوى غير مهم أو احتيالي', 'Спам', 'Σπαμ', 'هرزنامه', 'Roskaposti',
            'ספאם', 'स्पैम', 'Neželjeni sadržaj', 'Kéretlen tartalom', 'スパム', '스팸', 'Непожељан садржај',
            'Skräppost', 'สแปม', '垃圾信息'
        ],
        falseInfo: [
            'False information', '不實資訊', 'Vals inligting', 'معلومات زائفة', 'Фалшива информация',
            'Nepravdivé informace', 'Falske oplysninger', 'Fehlinformationen', 'Ψευδείς πληροφορίες',
            'Información falsa', 'اطلاعات غلط', 'Epätosia tietoja', 'Fausses informations', 'מידע לא נכון',
            'गलत जानकारी', 'Netočne informacije', 'Hamis információ', 'Informasi palsu', 'Informazioni false',
            '虚偽の情報', '거짓 정보', 'Maklumat palsu', 'Feilinformasjon', 'Onjuiste informatie', 'Fałszywe informacje',
            'Informações falsas', 'Informação falsa', 'Informaţii false', 'Ложная информация',
            'Nepravdivé informácie', 'Нетачне информације', 'Falsk information', 'ข้อมูลเท็จ', 'Maling impormasyon',
            'Yanlış Bilgi', 'Неправдива інформація', 'Thông tin sai sự thật', '虚假信息'
        ],
        bot: [
            'Bot or fake account', 'Bot 或假帳號', 'Bot nebo falešný účet', 'Bot eller falsk konto',
            'Bot oder gefälschtes Konto', 'Bot ή ψεύτικος λογαριασμός', 'Bot o cuenta falsa',
            'Botti tai väärennetty tili', 'Bot ou faux compte', 'बॉट या फ़ेक अकाउंट',
            'Bot ili lažni korisnički račun', 'Robot vagy hamis fiók', 'Bot atau akun palsu',
            'Account falso o gestito da un bot', 'ボットまたは偽アカウント', '봇 또는 가짜 계정', 'Bot atau akaun palsu',
            'Bot-konto eller falsk konto', 'Bot of nepaccount', 'Bot lub fałszywe konto', 'Bot ou conta falsa',
            'Robot sau cont fals', 'Бот или фальшивый аккаунт', 'Bot alebo falošný účet', 'Bot eller falskt konto',
            'บอทหรือบัญชีปลอม', 'Bot o pekeng account', 'Bot veya sahte hesap', 'Бот або фальшивий обліковий запис',
            'Tài khoản giả hoặc bot', '机器人或虚假帐户', '機械人程式或假帳戶'
        ]
    };
    const DONE_LABELS = ['Done', '完成'];

    // Consolidated report configuration
    const REPORT_CONFIG = {
        bullying: {
            label: 'Bully',
            title: 'Bullying or harassment',
            category: LABELS.bullying,
            categoryIndex: 1,
            subcategory: LABELS.bullyingSub,
            subcategoryIndex: 1,
            extraSteps: [
                { labels: LABELS.unknownPerson, fallbackIndex: -1 },
                { labels: LABELS.no, fallbackIndex: -1 }
            ]
        },
        spam: {
            label: 'Spam',
            title: 'Spam',
            category: LABELS.scam,
            categoryIndex: 6,
            subcategory: LABELS.spam,
            subcategoryIndex: 1
        },
        hate: {
            label: 'Hate',
            title: 'Hate speech or symbols',
            category: LABELS.violence,
            categoryIndex: 3,
            subcategory: LABELS.hate,
            subcategoryIndex: 3
        },
        fraud: {
            label: 'Fraud',
            title: 'Fraud or scam',
            category: LABELS.scam,
            categoryIndex: 6,
            subcategory: LABELS.fraud,
            subcategoryIndex: 0
        },
        false: {
            label: 'False',
            title: 'False information',
            category: LABELS.falseInfo,
            categoryIndex: 8
        },
        bot: {
            label: 'Bot',
            title: 'Bot or fake account',
            category: LABELS.bot,
            categoryIndex: 7
        }
    };

    const POST_MORE_ICON_PATH_PREFIXES = [
        'M4 14C5.10457 14',
        'M4 14a2 2 0 1 0 0-4'
    ];
    const REPORT_ICON_PATH_PREFIX = 'M12.001 15.0625C12.6223 15.0625';
    const REPORT_MENU_ITEM_INDEX = 6;

    // --- Utility functions ---

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // RTL locales wrap untranslated labels in LRM/RLM marks.
    function normalizeText(text = '') {
        return String(text ?? '').replace(/[\u200e\u200f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
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
        return svg?.getAttribute('viewBox') === '0 0 24 24'
            && POST_MORE_ICON_PATH_PREFIXES.some(prefix => hasPathPrefix(svg, prefix));
    }

    function findReportMenuItem(menu = getActiveMenu()) {
        const menuItems = getMenuItems(menu).filter(item => item.getAttribute('role') === 'menuitem');
        return menuItems.find(item => matchesLabels(item, LABELS.report))
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
        return items.find(item => matchesLabels(item, LABELS.report))
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
        // The confirmation screen only has the Done button.
        if (buttons.length === 1) return buttons[0];

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
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 2px;
                width: 100%;
                margin: 2px 0 6px;
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

    function getPostHeaderRow(moreButton) {
        return moreButton.parentElement?.parentElement?.parentElement || null;
    }

    // Posts link their timestamp to the post permalink; activity items don't.
    function hasPostPermalinkTime(headerRow) {
        return !!headerRow.querySelector('a[href*="/post/"] time');
    }

    function getPostBodyColumn(headerRow) {
        const contentColumn = headerRow?.parentElement;
        if (!contentColumn) return null;
        let sibling = contentColumn.nextElementSibling;
        while (sibling) {
            const position = window.getComputedStyle(sibling).position;
            if (position !== 'absolute' && position !== 'fixed') return sibling;
            sibling = sibling.nextElementSibling;
        }
        return null;
    }

    function findOwnButtons(headerRow, host) {
        const contentColumn = headerRow.parentElement;
        for (const root of [host, contentColumn, headerRow]) {
            if (!root) continue;
            for (const child of root.children) {
                if (child.classList.contains('threads-quick-report-container')) return child;
            }
        }
        return headerRow.querySelector('.threads-quick-report-container');
    }

    function injectButtons() {
        injectStyles();

        Array.from(document.querySelectorAll('[role="button"] svg'))
            .filter(svg => isPostMoreSvg(svg))
            .forEach(svg => {
                if (svg.closest('[role="dialog"]') || svg.closest('#barcelona-header')) return;

                const moreButton = svg.closest('[role="button"]');
                if (!moreButton || moreButton.querySelector('span')) return;

                const headerRow = getPostHeaderRow(moreButton);
                if (!headerRow || !hasPostPermalinkTime(headerRow)) return;

                const host = getPostBodyColumn(headerRow) || headerRow.parentElement;
                if (!host) return;

                const existing = findOwnButtons(headerRow, host);
                if (existing) {
                    if (existing.parentElement !== host) host.prepend(existing);
                    return;
                }

                host.prepend(createQuickReportButtons(moreButton));
            });
    }

    // --- Init ---

    try {
        injectButtons();
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                clearTimeout(observer.debounceTimer);
                observer.debounceTimer = setTimeout(injectButtons, 200);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    } catch (error) {
        console.error('[Threads Quick Report] Init failed:', error);
    }
})();
