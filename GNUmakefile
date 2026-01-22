VERSION := $(shell jq -r '.version' src/manifest.json)
FIREFOX_ZIP := threads-quick-report-firefox-$(VERSION).zip
CHROME_ZIP := threads-quick-report-chrome-$(VERSION).zip

ICONS := src/icons/icon-16.png src/icons/icon-48.png src/icons/icon-96.png src/icons/icon-128.png

.PHONY: all clean firefox chrome

all: firefox chrome

firefox: $(FIREFOX_ZIP)
chrome: $(CHROME_ZIP)

$(FIREFOX_ZIP): src/manifest.json src/content.js $(ICONS) LICENSE
	rm -rf build/firefox
	mkdir -p build/firefox/icons
	cp src/manifest.json build/firefox/
	cp src/content.js build/firefox/
	cp $(ICONS) build/firefox/icons/
	cp LICENSE build/firefox/
	cd build/firefox && zip -r ../../$@ manifest.json content.js icons/ LICENSE

$(CHROME_ZIP): src/manifest.json src/content.js $(ICONS) LICENSE
	rm -rf build/chrome
	mkdir -p build/chrome/icons
	jq '.version |= (split(".") | .[0] + "." + (.[1] | .[0:4]) + "." + (.[1] | .[4:8]) + "." + .[2])' src/manifest.json > build/chrome/manifest.json
	cp src/content.js build/chrome/
	cp $(ICONS) build/chrome/icons/
	cp LICENSE build/chrome/
	cd build/chrome && zip -r ../../$@ manifest.json content.js icons/ LICENSE

clean:
	rm -rf build/
	rm -f threads-quick-report-firefox-*.zip threads-quick-report-chrome-*.zip
