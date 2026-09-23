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
	echo "moving bundledPlugins"
	cp -r bundledPlugins build/

# install: all
# 	echo "creating directories"
# 	install -d $(DESTDIR)$(libdir)
# 	install -d $(DESTDIR)$(bindir)
# 	install -d $(DESTDIR)$(systemddir)
# 	echo "moving build"
# 	cp -ra build/. $(DESTDIR)$(libdir)/src/
# 	echo "moving package.json"
# 	cp package.json $(DESTDIR)$(libdir)/
# 	echo "linking executable to bin"
# 	ln -sf ../lib/tuxmods/src/index.js $(DESTDIR)$(bindir)/tuxmods
	# echo "moving systemd service"
	# install -m 644 tuxmods.service $(DESTDIR)$(systemddir)/tuxmods.service
	# systemctl daemon-reload

sea-build: build
	echo "compressing bundledPlugins"
	zip -r build/plugins.zip bundledPlugins
	echo "building with esbuild"
	npx esbuild build/index.js --bundle --platform=node --target=node26 --format=cjs --outfile=build/bundle.js
	echo "creating sea-config"
	printf '{\n	"main": "build/bundle.js",\n  "output": "sea-prep.blob",\n  "disableExperimentalSEAWarning": true,\n  "assets": {\n    "plugins.zip": "build/plugins.zip"\n  }\n}\n' > build/sea-config.json
	echo "creating prep blob"
	node --experimental-sea-config build/sea-config.json
	echo "copying host binary"
	cp $$(command -v node) build/tuxmods-bin
	echo "injecting the blob into the binary"
	npx postject build/tuxmods-bin NODE_SEA_BLOB build/sea-prep.blob \
		--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
	echo "made SEA executable in build directory"
	chmod +x build/tuxmods-bin

dev-build:
	npm ci
	npx tsc -p tsconfig.dev.json
	chmod +x build/index.js
	cp -r bundledPlugins build/

uninstall:
	rm -f $(DESTDIR)$(bindir)/tuxmods
	rm -rf $(DESTDIR)$(libdir)
	rm -f $(DESTDIR)$(systemddir)/tuxmods.service

clean:
	rm -rf build
	rm -rf node_modules

.PHONY: all build dev-build install sea-build uninstall clean
