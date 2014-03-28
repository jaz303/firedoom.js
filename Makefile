BUNDLE		= demo/bundle.js
ENTRY 		= demo/main.js
SOURCES		= $(ENTRY) index.js lib/*.js demo/systems/*.js

$(BUNDLE): $(SOURCES)
	browserify -o $@ $(ENTRY)

watch:
	watchify -o $(BUNDLE) $(ENTRY)
