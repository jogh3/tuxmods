import { types } from 'vortex-api';
export declare function isValidMod(mod: types.IMod): boolean;
export declare function isModInCollection(collectionMod: types.IMod, mod: types.IMod): boolean;
export declare function genCollectionLoadOrder(loadOrder: string[], mods: {
    [modId: string]: types.IMod;
}, collection?: types.IMod): string[];
export declare function getModId(mods: {
    [modId: string]: types.IMod;
}, loId: string): string | undefined;
//# sourceMappingURL=util.d.ts.map