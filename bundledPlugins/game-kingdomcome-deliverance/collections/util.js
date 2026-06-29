import { types, util } from 'vortex-api';
import { transformId } from '../util';
export function isValidMod(mod) {
    return (mod !== undefined)
        && (mod.type !== 'collection');
}
export function isModInCollection(collectionMod, mod) {
    if (collectionMod.rules === undefined) {
        return false;
    }
    return collectionMod.rules.find(rule => util.testModReference(mod, rule.reference)) !== undefined;
}
export function genCollectionLoadOrder(loadOrder, mods, collection) {
    const sortedMods = (loadOrder || []).filter(loId => {
        const modId = getModId(mods, loId);
        return (collection !== undefined)
            ? isValidMod(mods[modId]) && (isModInCollection(collection, mods[modId]))
            : isValidMod(mods[modId]);
    });
    return sortedMods;
}
export function getModId(mods, loId) {
    return Object.keys(mods).find(modId => transformId(modId) === loId);
}
//# sourceMappingURL=util.js.map