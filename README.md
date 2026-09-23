# tuxmods

## under construction

this is a mod manager for linux that uses the deployment methods for vortex made for windows to load mods on linux systems as well

# build program

to build the program

```
 make build
```

to install it, which includes:
 
 - moving the program to /usr/local/bin
 - moving the other files to /usr/local/lib/tuxmods
 - adding a systemd service

```
 make install
```

to build it as a single executable application

```
 make sea-build
```

to build it with dev info, to include the source maps and with strict compilation

```
 make dev-build
```

to uninstall the program, undoing all that make install does

```
 make uninstall
```

to clean the build

```
make clean
```

# License Information

This project incorporates and modifies bundled plugins and API code from Vortex by Nexus Mods, which is licensed under GPL-3.0. The original source code can be found at the [Vortex github](https://github.com/Nexus-Mods/Vortex)
