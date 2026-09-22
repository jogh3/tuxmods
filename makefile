prefix ?= /usr/local
bindir = $(prefix)/bin
libdir = $(prefix)/lib/tuxmods
systemddir = /etc/systemd/system

all: build

build:
	npm ci
	echo "compiling tuxmods"
	npx tsc -p tsconfig.json
	cp package.json package-lock.json build/
	cd build && npm ci --omit=dev
	echo "making executable"
	chmod +x build/index.js

install: all
	echo "creating directories"
	install -d $(DESTDIR)$(libdir)
	install -d $(DESTDIR)$(bindir)
	install -d $(DESTDIR)$(systemddir)
	echo "moving build"
	cp -ra build/. $(DESTDIR)$(libdir)/
	echo "moving package.json"
	cp package.json $(DESTDIR)$(libdir)/
	echo "linking executable to bin"
	ln -sf ../lib/tuxmods/index.js $(DESTDIR)$(bindir)/tuxmods
	echo "moving bundledPlugins"
	cp -r bundledPlugins $(DESTDIR)$(libdir)/
	echo "moving systemd service"
	install -m 644 tuxmods.service $(DESTDIR)$(systemddir)/tuxmods.service
	systemd daemon-reload

dev-build:
	npm ci
	npx tsc -p tsconfig.dev.json
	chmod +x build/index.js

uninstall:
	rm -f $(DESTDIR)$(bindir)/tuxmods
	rm -rf $(DESTDIR)$(libdir)
	rm -f $(DESTDIR)$(systemddir)/tuxmods.service

# TODO: add a SEA thing and figure the fuck out how to do bundledPlugins with that, probably merge it into the SEA file

clean:
	rm -rf build
	rm -rf node_modules

.PHONY: all build dev install uninstall clean
