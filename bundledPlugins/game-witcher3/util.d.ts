import Bluebird from 'bluebird';
import { types } from 'vortex-api';
import { IEntry, IWalkOptions } from 'turbowalk';
import { IDeployment, PrefixType } from './types';
export declare function getDeployment(api: types.IExtensionApi, includedMods?: string[]): Promise<IDeployment>;
export declare const getDocumentsPath: (game: types.IGame) => any;
export declare const getDLCPath: (api: types.IExtensionApi) => (game: types.IGame) => any;
export declare const getTLPath: (api: types.IExtensionApi) => (game: types.IGame) => any;
export declare const isTW3: (api: types.IExtensionApi) => (gameId: string) => boolean;
export declare function notifyMissingScriptMerger(api: any): void;
export declare const hasPrefix: (prefix: PrefixType, fileEntry: string) => boolean;
export declare function findModFolders(installationPath: string, mod: types.IMod): Promise<string[]>;
export declare function getManagedModNames(api: types.IExtensionApi, mods: types.IMod[]): Promise<{
    name: string;
    id: string;
}[]>;
export declare function getAllMods(api: types.IExtensionApi): Promise<{
    merged: any;
    manual: never[];
    managed: {
        name: string;
        id: string;
    }[];
}>;
export declare function getManuallyAddedMods(api: types.IExtensionApi): Promise<never[]>;
export declare function isLockedEntry(modName: string): boolean;
export declare function determineExecutable(discoveredPath: string): string;
export declare function forceRefresh(api: types.IExtensionApi): void;
export declare function walkPath(dirPath: string, walkOptions?: IWalkOptions): Promise<IEntry[]>;
export declare function validateProfile(profileId: string, state: types.IState): any;
export declare function isXML(filePath: string): boolean;
export declare function isSettingsFile(filePath: string): boolean;
export declare function suppressEventHandlers(api: types.IExtensionApi): any;
export declare function toBlue<T>(func: (...args: any[]) => Promise<T>): (...args: any[]) => Bluebird<T>;
export declare function fileExists(filePath: string): Promise<boolean>;
//# sourceMappingURL=util.d.ts.map