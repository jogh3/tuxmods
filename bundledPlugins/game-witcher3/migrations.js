/* eslint-disable */
import semver from 'semver';
import { selectors, types, util } from 'vortex-api';
import { GAME_ID } from './common';
import { ILoadOrder, ILoadOrderEntry } from './collections/types';
export async function migrate148(context, oldVersion) {
    if (semver.gte(oldVersion, '1.4.8')) {
        return Promise.resolve();
    }
    const state = context.api.getState();
    const lastActiveProfile = selectors.lastActiveProfileForGame(state, GAME_ID);
    const profile = selectors.profileById(state, lastActiveProfile);
    const mods = util.getSafe(state, ['persistent', 'mods', GAME_ID], {});
    const modState = util.getSafe(profile, ['modState'], {});
    const isEnabled = (mod) => modState[mod.id]?.enabled === true;
    const limitPatchMod = Object.values(mods).find(mod => (mod.type === 'w3modlimitpatcher') && isEnabled(mod));
    if (limitPatchMod === undefined) {
        return Promise.resolve();
    }
    const t = context.api.translate;
    context.api.sendNotification({
        type: 'warning',
        allowSuppress: false,
        message: t('Faulty Witcher 3 Mod Limit Patch detected'),
        actions: [
            {
                title: 'More',
                action: (dismiss) => {
                    dismiss();
                    context.api.showDialog('info', 'Witcher 3 Mod Limit Patch', {
                        text: t('Due to a bug, the mod limit patch was not applied correctly. '
                            + 'Please Uninstall/Remove your existing mod limit match mod entry in '
                            + 'your mods page and re-apply the patch using the "Apply Mod Limit Patch" '
                            + 'button.'),
                    }, [
                        { label: 'Close' },
                    ]);
                },
            },
        ],
    });
    return Promise.resolve();
}
export function getPersistentLoadOrder(api, loadOrder) {
    // We migrated away from the regular mod load order extension
    //  to the file based load ordering
    const state = api.getState();
    const profile = selectors.activeProfile(state);
    if (profile?.gameId !== GAME_ID) {
        return [];
    }
    loadOrder = loadOrder ?? util.getSafe(state, ['persistent', 'loadOrder', profile.id], undefined);
    if (loadOrder === undefined) {
        return [];
    }
    if (Array.isArray(loadOrder)) {
        return loadOrder;
    }
    if (typeof loadOrder === 'object') {
        return Object.entries(loadOrder).map(([key, item]) => convertDisplayItem(key, item));
    }
    return [];
}
function convertDisplayItem(key, item) {
    return {
        id: key,
        modId: key,
        name: key,
        locked: item.locked,
        enabled: true,
        data: {
            prefix: item.prefix,
        }
    };
}
//# sourceMappingURL=migrations.js.map