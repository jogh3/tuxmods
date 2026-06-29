/* eslint-disable */
import getVersion from 'exe-version';
import * as path from 'path';
import * as semver from 'semver';
import { types } from 'vortex-api';
import { LSLIB_FILES, GAME_ID } from './common';
import { logDebug } from './util';
export async function testLSLib(files, gameId) {
    if (gameId !== GAME_ID) {
        return Promise.resolve({ supported: false, requiredFiles: [] });
    }
    const matchedFiles = files.filter(file => LSLIB_FILES.has(path.basename(file).toLowerCase()));
    return Promise.resolve({
        supported: matchedFiles.length >= 2,
        requiredFiles: [],
    });
}
export async function testModFixer(files, gameId) {
    const notSupported = { supported: false, requiredFiles: [] };
    if (gameId !== GAME_ID) {
        // different game.
        return Promise.resolve(notSupported);
    }
    const lowered = files.map(file => file.toLowerCase());
    //const binFolder = lowered.find(file => file.split(path.sep).indexOf('bin') !== -1);
    const hasModFixerPak = lowered.find(file => path.basename(file) === 'modfixer.pak') !== undefined;
    if (!hasModFixerPak) {
        // there's no modfixer.pak folder.
        return Promise.resolve(notSupported);
    }
    return Promise.resolve({
        supported: true,
        requiredFiles: []
    });
}
export async function testEngineInjector(files, gameId) {
    const notSupported = { supported: false, requiredFiles: [] };
    if (gameId !== GAME_ID) {
        // different game.
        return Promise.resolve(notSupported);
    }
    const lowered = files.map(file => file.toLowerCase());
    //const binFolder = lowered.find(file => file.split(path.sep).indexOf('bin') !== -1);
    const hasBinFolder = lowered.find(file => file.indexOf('bin' + path.sep) !== -1) !== undefined;
    if (!hasBinFolder) {
        // there's no bin folder.
        return Promise.resolve(notSupported);
    }
    return Promise.resolve({
        supported: true,
        requiredFiles: []
    });
}
export async function installBG3SE(files) {
    logDebug('installBG3SE files:', files);
    // Filter out folders as this breaks the installer.
    files = files.filter(f => path.extname(f) !== '' && !f.endsWith(path.sep));
    // Filter only dll files.
    files = files.filter(f => path.extname(f) === '.dll');
    const instructions = files.reduce((accum, filePath) => {
        accum.push({
            type: 'copy',
            source: filePath,
            destination: path.basename(filePath),
        });
        return accum;
    }, []);
    logDebug('installBG3SE instructions:', instructions);
    return Promise.resolve({ instructions });
}
export async function installModFixer(files) {
    logDebug('installModFixer files:', files);
    // Filter out folders as this breaks the installer.
    files = files.filter(f => path.extname(f) !== '' && !f.endsWith(path.sep));
    // Filter only pak files.
    files = files.filter(f => path.extname(f) === '.pak');
    const modFixerAttribute = { type: 'attribute', key: 'modFixer', value: true };
    const instructions = files.reduce((accum, filePath) => {
        accum.push({
            type: 'copy',
            source: filePath,
            destination: path.basename(filePath),
        });
        return accum;
    }, [modFixerAttribute]);
    logDebug('installModFixer instructions:', instructions);
    return Promise.resolve({ instructions });
}
export async function installEngineInjector(files) {
    logDebug('installEngineInjector files:', files);
    // Filter out folders as this breaks the installer.
    files = files.filter(f => path.extname(f) !== '' && !f.endsWith(path.sep));
    const modtypeAttr = { type: 'setmodtype', value: 'dinput' };
    const instructions = files.reduce((accum, filePath) => {
        // see if we have a bin folder
        // then we need to use that as a new root incase the /bin is nested
        const binIndex = filePath.toLowerCase().indexOf('bin' + path.sep);
        if (binIndex !== -1) {
            logDebug(filePath.substring(binIndex));
            accum.push({
                type: 'copy',
                source: filePath,
                destination: filePath.substring(binIndex),
            });
        }
        return accum;
    }, [modtypeAttr]);
    logDebug('installEngineInjector instructions:', instructions);
    return Promise.resolve({ instructions });
}
export async function installLSLib(files, destinationPath) {
    const exe = files.find(file => path.basename(file.toLowerCase()) === 'divine.exe');
    const exePath = path.join(destinationPath, exe);
    let ver = await getVersion(exePath);
    ver = ver.split('.').slice(0, 3).join('.');
    // Unfortunately the LSLib developer is not consistent when changing
    //  file versions - the executable attribute might have an older version
    //  value than the one specified by the filename - we're going to use
    //  the filename as the point of truth *ugh*
    const fileName = path.basename(destinationPath, path.extname(destinationPath));
    const idx = fileName.indexOf('-v');
    const fileNameVer = fileName.slice(idx + 2);
    if (semver.valid(fileNameVer) && ver !== fileNameVer) {
        ver = fileNameVer;
    }
    const versionAttr = { type: 'attribute', key: 'version', value: ver };
    const modtypeAttr = { type: 'setmodtype', value: 'bg3-lslib-divine-tool' };
    const instructions = files.reduce((accum, filePath) => {
        if (filePath.toLowerCase()
            .split(path.sep)
            .indexOf('tools') !== -1
            && !filePath.endsWith(path.sep)) {
            accum.push({
                type: 'copy',
                source: filePath,
                destination: path.join('tools', path.basename(filePath)),
            });
        }
        return accum;
    }, [modtypeAttr, versionAttr]);
    return Promise.resolve({ instructions });
}
export async function testBG3SE(files, gameId) {
    if (gameId !== GAME_ID) {
        return Promise.resolve({ supported: false, requiredFiles: [] });
    }
    const hasDWriteDll = files.find(file => path.basename(file).toLowerCase() === 'dwrite.dll') !== undefined;
    return Promise.resolve({
        supported: hasDWriteDll,
        requiredFiles: [],
    });
}
export function testReplacer(files, gameId) {
    if (gameId !== GAME_ID) {
        return Promise.resolve({ supported: false, requiredFiles: [] });
    }
    const paks = files.filter(file => path.extname(file).toLowerCase() === '.pak');
    // do we have a public or generated folder?
    const hasGenOrPublicFolder = ['generated', 'public'].some(segment => files.find(file => file.toLowerCase().indexOf(segment + path.sep) !== -1) !== undefined);
    return Promise.resolve({
        supported: hasGenOrPublicFolder || paks.length === 0,
        requiredFiles: [],
    });
}
export async function installReplacer(files) {
    const directories = Array.from(new Set(files.map(file => path.dirname(file).toUpperCase())));
    let dataPath = undefined;
    const genOrPublic = directories
        .find(dir => ['PUBLIC', 'GENERATED'].includes(path.basename(dir)));
    if (genOrPublic !== undefined) {
        dataPath = path.dirname(genOrPublic);
    }
    if (dataPath === undefined) {
        dataPath = directories.find(dir => path.basename(dir) === 'DATA');
    }
    const instructions = (dataPath !== undefined)
        ? files.reduce((prev, filePath) => {
            if (filePath.endsWith(path.sep)) {
                return prev;
            }
            const relPath = path.relative(dataPath, filePath);
            if (!relPath.startsWith('..')) {
                prev.push({
                    type: 'copy',
                    source: filePath,
                    destination: relPath,
                });
            }
            return prev;
        }, [])
        : files.map((filePath) => ({
            type: 'copy',
            source: filePath,
            destination: filePath,
        }));
    return Promise.resolve({
        instructions,
    });
}
//# sourceMappingURL=installers.js.map