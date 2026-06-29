import { types } from 'vortex-api';
import { IW3CollectionsData } from './types';
export declare function exportLoadOrder(api: types.IExtensionApi, modIds: string[], mods: {
    [modId: string]: types.IMod;
}): Promise<types.LoadOrder>;
export declare function importLoadOrder(api: types.IExtensionApi, collection: IW3CollectionsData): Promise<void>;
//# sourceMappingURL=loadOrder.d.ts.map