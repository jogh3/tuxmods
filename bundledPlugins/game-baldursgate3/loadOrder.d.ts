import { types } from 'vortex-api';
import { IProps } from './types';
export declare function serialize(context: types.IExtensionContext, loadOrder: types.LoadOrder, profileId?: string): Promise<void>;
export declare function deserialize(context: types.IExtensionContext): Promise<types.LoadOrder>;
export declare function importFromBG3MM(context: types.IExtensionContext): Promise<void>;
export declare function importModSettingsFile(api: types.IExtensionApi): Promise<boolean | void>;
export declare function importModSettingsGame(api: types.IExtensionApi): Promise<boolean | void>;
export declare function getNodes(lsxPath: string): Promise<any>;
export declare function processLsxFile(api: types.IExtensionApi, lsxPath: string): Promise<void>;
export declare function exportToFile(api: types.IExtensionApi): Promise<boolean | void>;
export declare function exportToGame(api: types.IExtensionApi): Promise<boolean | void>;
export declare function deepRefresh(api: types.IExtensionApi): Promise<boolean | void>;
export declare function validate(prev: types.LoadOrder, current: types.LoadOrder): Promise<any>;
export declare function genProps(context: types.IExtensionContext, profileId?: string): IProps;
export declare function ensureLOFile(context: types.IExtensionContext, profileId?: string, props?: IProps): Promise<string>;
export declare function loadOrderFilePath(profileId: string): string;
//# sourceMappingURL=loadOrder.d.ts.map