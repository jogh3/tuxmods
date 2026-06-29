import { actions, selectors, types, util } from 'vortex-api';
import { GAME_ID } from '../statics';
import { transformId } from '../util';
import { IKCDCollectionsData } from './types';
export async function exportLoadOrder(state, modIds) {
    const profileId = selectors.lastActiveProfileForGame(state, GAME_ID);
    if (profileId === undefined) {
        return Promise.reject(new util.ProcessCanceled('Invalid profile id'));
    }
    const loadOrder = util.getSafe(state, ['persistent', 'loadOrder', profileId], []);
    if (!loadOrder) {
        return Promise.resolve(undefined);
    }
    const filteredLO = loadOrder.filter(lo => modIds.some(id => transformId(id) === lo));
    return Promise.resolve(filteredLO);
}
export async function importLoadOrder(api, collection) {
    const state = api.getState();
    const profileId = selectors.lastActiveProfileForGame(state, GAME_ID);
    if (profileId === undefined) {
        return Promise.reject(new util.ProcessCanceled(`Invalid profile id ${profileId}`));
    }
    api.store.dispatch(actions.setLoadOrder(profileId, collection.loadOrder));
    return Promise.resolve(undefined);
}
//# sourceMappingURL=loadOrder.js.map