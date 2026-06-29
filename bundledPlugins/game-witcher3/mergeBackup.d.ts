import { types } from 'vortex-api';
export declare function storeToProfile(api: types.IExtensionApi, profileId: string): Promise<void>;
export declare function restoreFromProfile(api: types.IExtensionApi, profileId: string): Promise<void>;
export declare function queryScriptMerges(api: types.IExtensionApi, includedModIds: string[], collection: types.IMod): Promise<void>;
export declare function exportScriptMerges(api: types.IExtensionApi, profileId: string, includedModIds: string[], collection: types.IMod): Promise<any>;
export declare function importScriptMerges(api: types.IExtensionApi, profileId: string, fileData: Buffer): Promise<any>;
export declare function makeOnContextImport(api: types.IExtensionApi, collectionId: string): Promise<void>;
//# sourceMappingURL=mergeBackup.d.ts.map