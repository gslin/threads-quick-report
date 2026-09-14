VERSION := $(shell jq -r '.version' src/manifest.json)
CHROME_VERSION := $(shell echo "$(VERSION)" | awk -F. '{year=substr($$2,1,4); mmdd=substr($$2,5,4)+0; print "0." year "." mmdd "." $$3}')
FIREFOX_ZIP := threads-quick-report-firefox-$(VERSION).zip
CHROME_ZIP := threads-quick-report-chrome-$(CHROME_VERSION).zip

ICONS := src/icons/icon-16.png src/icons/icon-48.png src/icons/icon-96.png src/icons/icon-128.png

.PHONY: all clean firefox chrome deploy firefox-sign

all: firefox chrome

firefox: $(FIREFOX_ZIP)
chrome: $(CHROME_ZIP)

$(FIREFOX_ZIP): src/manifest.json src/content.js src/background.js src/onboarding.html src/onboarding.js $(ICONS) LICENSE
	mkdir -p build/firefox/icons
	cp src/manifest.json build/firefox/
	cp src/content.js src/background.js src/onboarding.html src/onboarding.js build/firefox/
	cp $(ICONS) build/firefox/icons/
	cp LICENSE build/firefox/
	cd build/firefox && zip -r ../../$@ manifest.json content.js background.js onboarding.html onboarding.js icons/ LICENSE

$(CHROME_ZIP): src/manifest.json src/content.js src/background.js src/onboarding.html src/onboarding.js $(ICONS) LICENSE
	mkdir -p build/chrome/icons
	jq --arg v "$(CHROME_VERSION)" '.version = $$v | .background = {"service_worker": "background.js"}' src/manifest.json > build/chrome/manifest.json
	cp src/content.js src/background.js src/onboarding.html src/onboarding.js build/chrome/
	cp $(ICONS) build/chrome/icons/
	cp LICENSE build/chrome/
	cd build/chrome && zip -r ../../$@ manifest.json content.js background.js onboarding.html onboarding.js icons/ LICENSE

deploy: firefox
	@if [ ! -f .env ]; then echo 'Missing .env. Copy .env.example to .env and fill in AMO API credentials.' >&2; exit 1; fi
	set -a && . ./.env && set +a && \
	if [ -z "$$WEB_EXT_API_KEY" ] || [ -z "$$WEB_EXT_API_SECRET" ]; then \
		echo 'WEB_EXT_API_KEY and WEB_EXT_API_SECRET must be set in .env' >&2; exit 1; \
	fi && \
	npx --yes web-ext@latest sign --source-dir=build/firefox --channel=listed --approval-timeout=0

firefox-sign: deploy

clean:
	rm -rf build/
	rm -f threads-quick-report-firefox-*.zip threads-quick-report-chrome-*.zip
