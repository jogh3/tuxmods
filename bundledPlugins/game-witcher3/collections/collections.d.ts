import { types } from 'vortex-api';
import { IW3CollectionsData } from './types';
export declare function genCollectionsData(context: types.IExtensionContext, gameId: string, includedMods: string[], collection: types.IMod): Promise<any>;
export declare function parseCollectionsData(context: types.IExtensionContext, gameId: string, collection: IW3CollectionsData): Promise<undefined>;
//# sourceMappingURL=collections.d.ts.map