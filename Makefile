BUNDLE		= demo/bundle.js
ENTRY 		= demo/main.js
SOURCES		= $(ENTRY) index.js lib/*.js

$(BUNDLE): $(SOURCES)
	browserify -o $@ $(ENTRY)
