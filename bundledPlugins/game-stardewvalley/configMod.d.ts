import { types } from 'vortex-api';
import { IFileEntry } from './types';
export declare function registerConfigMod(context: types.IExtensionContext): void;
export declare function addModConfig(api: types.IExtensionApi, files: IFileEntry[], modsPath?: string): Promise<void>;
export declare function ensureConfigMod(api: types.IExtensionApi): Promise<types.IMod>;
export declare function onWillEnableMods(api: types.IExtensionApi, profileId: string, modIds: string[], enabled: boolean, options?: any): Promise<void>;
export declare function applyToModConfig(api: types.IExtensionApi, cb: () => Promise<void>): Promise<void>;
export declare function onRevertFiles(api: types.IExtensionApi, profileId: string): Promise<void>;
export declare function onAddedFiles(api: types.IExtensionApi, profileId: string, files: IFileEntry[]): Promise<[void, void] | undefined>;
//# sourceMappingURL=configMod.d.ts.map