import { selectors, types, util } from 'vortex-api';
import { IKCDCollectionsData } from './types';
import { exportLoadOrder, importLoadOrder } from './loadOrder';
export async function genCollectionsData(context, gameId, includedMods) {
    const api = context.api;
    try {
        const loadOrder = await exportLoadOrder(api.getState(), includedMods);
        const collectionData = {
            loadOrder,
        };
        return Promise.resolve(collectionData);
    }
    catch (err) {
        return Promise.reject(err);
    }
}
export async function parseCollectionsData(context, gameId, collection) {
    const api = context.api;
    const state = api.getState();
    const profileId = selectors.lastActiveProfileForGame(state, gameId);
    const profile = selectors.profileById(state, profileId);
    if (profile?.gameId !== gameId) {
        return Promise.reject(new util.ProcessCanceled('Last active profile is missing'));
    }
    try {
        await importLoadOrder(api, collection);
    }
    catch (err) {
        return Promise.reject(err);
    }
}
//# sourceMappingURL=collections.js.map