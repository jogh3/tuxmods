import { actions, selectors, types, util } from 'vortex-api';
import { GAME_ID } from '../common';
import { IW3CollectionsData } from './types';
import { CollectionGenerateError, CollectionParseError, genCollectionLoadOrder } from './util';
import { getPersistentLoadOrder } from '../migrations';
export async function exportLoadOrder(api, modIds, mods) {
    const state = api.getState();
    const profileId = selectors.lastActiveProfileForGame(state, GAME_ID);
    if (profileId === undefined) {
        return Promise.reject(new CollectionGenerateError('Invalid profile id'));
    }
    const loadOrder = getPersistentLoadOrder(api);
    if (loadOrder === undefined) {
        // This is theoretically "fine" - the user may have simply
        //  downloaded the mods and immediately created the collection
        //  without actually setting up a load order. Alternatively
        //  the game extension itself might be handling the presort functionality
        //  erroneously. Regardless, the collection creation shouldn't be blocked
        //  by the inexistance of a loadOrder.
        return Promise.resolve(undefined);
    }
    const includedMods = modIds.reduce((accum, iter) => {
        if (mods[iter] !== undefined) {
            accum[iter] = mods[iter];
        }
        return accum;
    }, {});
    const filteredLO = genCollectionLoadOrder(loadOrder, includedMods);
    return Promise.resolve(filteredLO);
}
export async function importLoadOrder(api, collection) {
    const state = api.getState();
    const profileId = selectors.lastActiveProfileForGame(state, GAME_ID);
    if (profileId === undefined) {
        return Promise.reject(new CollectionParseError(collection?.['info']?.['name'] || '', 'Invalid profile id'));
    }
    const converted = getPersistentLoadOrder(api, collection.loadOrder);
    api.store.dispatch(actions.setLoadOrder(profileId, converted));
    return Promise.resolve(undefined);
}
//# sourceMappingURL=loadOrder.js.map