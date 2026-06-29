/* eslint-disable */
import path from 'path';
import semver from 'semver';
import { actions, fs, log, types, util } from 'vortex-api';
const GAME_ID = 'nomanssky';
const STEAMAPP_ID = '275850';
const XBOX_ID = 'HelloGames.NoMansSky';
const MODTYPE_DEPRECATED_PAK = 'nomanssky-deprecated-pak';
async function purge(api) {
    return new Promise((resolve, reject) => api.events.emit('purge-mods', true, (err) => err ? reject(err) : resolve()));
}
async function deploy(api) {
    return new Promise((resolve, reject) => api.events.emit('deploy-mods', (err) => err ? reject(err) : resolve()));
}
function findGame() {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID, XBOX_ID])
        .then(game => game.gamePath);
}
function deprecatedModPath() {
    return path.join('GAMEDATA', 'PCBANKS', 'MODS');
}
function modPath() {
    return path.join('GAMEDATA', 'MODS');
}
async function migrate101(api, oldVersion) {
    if (semver.gte(oldVersion, '1.0.1')) {
        return Promise.resolve();
    }
    const state = api.getState();
    const mods = util.getSafe(state, ['persistent', 'mods', GAME_ID], {});
    const modIds = Object.keys(mods).filter(modId => mods[modId].type !== 'nomanssky-deprecated-pak');
    const batched = modIds.map(modId => actions.setModType(GAME_ID, modId, MODTYPE_DEPRECATED_PAK));
    if (batched.length > 0) {
        try {
            log('info', 'Migrating mods to deprecated PAK type.', { mods: batched.length });
            await api.awaitUI();
            await purge(api);
            util.batchDispatch(api.store, batched);
            // Hacky but necessary to ensure we wait for the state to update.
            await new Promise(resolve => setTimeout(resolve, 1000));
            await deploy(api);
        }
        catch (err) {
            log('error', 'Failed to migrate mods to deprecated PAK type.', { err });
        }
    }
    return Promise.resolve();
}
async function prepareForModding(api, discovery) {
    const pcbanks = path.join(discovery.path, 'GAMEDATA', 'PCBANKS');
    const ensureDir = (dir) => fs.ensureDirWritableAsync(path.join(discovery.path, dir));
    return Promise.all([ensureDir(modPath()), ensureDir(deprecatedModPath())])
        .then(() => fs.renameAsync(path.join(pcbanks, 'DISABLEMODS.TXT'), path.join(pcbanks, 'ENABLEMODS.TXT'))
        .catch(err => err.code === 'ENOENT' ? Promise.resolve() : Promise.reject(err)));
}
async function requiresLauncher(gamePath, store) {
    if (store === 'xbox') {
        return Promise.resolve({
            launcher: 'xbox',
            addInfo: {
                appId: XBOX_ID,
                parameters: [{ appExecName: 'NoMansSky' }],
            },
        });
    }
    else {
        return Promise.resolve(undefined);
    }
}
function getPakPath(api, game) {
    const discovery = api.getState().settings.gameMode.discovered[game.id];
    if (!discovery || !discovery.path) {
        return '.';
    }
    const dataPath = path.join(discovery.path, deprecatedModPath());
    return dataPath;
}
async function testDeprecatedPakMod(instructions) {
    const hasPak = instructions.some(inst => inst.source && inst.source.match(/\.pak$/i));
    return Promise.resolve(hasPak);
}
async function getGameVersion(gamePath) {
    const exeVersion = require('exe-version');
    return Promise.resolve(exeVersion.getProductVersionLocalized(path.join(gamePath, 'Binaries', 'NMS.exe')));
}
function main(context) {
    context.registerGame({
        id: GAME_ID,
        name: 'No Man\'s Sky',
        mergeMods: true,
        queryPath: findGame,
        getGameVersion,
        queryModPath: modPath,
        logo: 'gameart.jpg',
        executable: () => 'Binaries/NMS.exe',
        requiredFiles: [
            'Binaries/NMS.exe',
        ],
        requiresLauncher: requiresLauncher,
        setup: (discovery) => prepareForModding(context.api, discovery),
        environment: {
            SteamAPPId: STEAMAPP_ID,
        },
        details: {
            steamAppId: +STEAMAPP_ID,
        },
    });
    context.registerModType(MODTYPE_DEPRECATED_PAK, 100, (gameId) => GAME_ID === gameId, (game) => getPakPath(context.api, game), testDeprecatedPakMod, { deploymentEssential: false, name: 'Deprecated PAK' });
    context.registerMigration(old => migrate101(context.api, old));
    return true;
}
module.exports = {
    default: main,
};
//# sourceMappingURL=index.js.map