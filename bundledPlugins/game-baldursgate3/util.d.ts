import { types } from 'vortex-api';
import { IModSettings, IPakInfo, IModNode, IXmlNode, LOFormat } from './types';
export declare function getGamePath(api: any): string;
export declare function getGameDataPath(api: any): any;
export declare function documentsPath(): any;
export declare function modsPath(): any;
export declare function profilesPath(): any;
export declare function globalProfilePath(api: types.IExtensionApi): Promise<any>;
export declare const getPlayerProfiles: () => any;
export declare function gameSupportsProfile(gameVersion: string): any;
export declare function getOwnGameVersion(state: types.IState): Promise<string>;
export declare function getActivePlayerProfile(api: types.IExtensionApi): Promise<string>;
export declare function parseModNode(node: IModNode): {
    id: any;
    name: any;
    data: any;
};
export declare function logError(message: string, metadata?: any): void;
export declare function logDebug(message: string, metadata?: any): void;
export declare function forceRefresh(api: types.IExtensionApi): void;
export declare function findNode<T extends IXmlNode<{
    id: string;
}>, U>(nodes: T[], id: string): T;
export declare function getLatestInstalledLSLibVer(api: types.IExtensionApi): string;
export declare function getDefaultModSettingsFormat(api: types.IExtensionApi): Promise<LOFormat>;
export declare function getDefaultModSettings(api: types.IExtensionApi): Promise<string>;
export declare function convertToV8(someXml: string): Promise<string>;
export declare function convertV6toV7(v6Xml: string): Promise<string>;
export declare function getLatestLSLibMod(api: types.IExtensionApi): any;
export declare function extractPakInfoImpl(api: types.IExtensionApi, pakPath: string, mod: types.IMod, isListed: boolean): Promise<IPakInfo>;
export declare function extractMeta(api: types.IExtensionApi, pakPath: string, mod: types.IMod): Promise<IModSettings>;
export declare function writeModSettings(api: types.IExtensionApi, data: IModSettings, bg3profile: string): Promise<void>;
export declare function parseLSXFile(lsxPath: string): Promise<IModSettings>;
export declare function readModSettings(api: types.IExtensionApi): Promise<IModSettings>;
export declare function readStoredLO(api: types.IExtensionApi): Promise<void>;
//# sourceMappingURL=util.d.ts.map