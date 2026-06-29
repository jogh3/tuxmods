import { IEntry } from 'turbowalk';
import { types } from 'vortex-api';
export declare class CollectionGenerateError extends Error {
    constructor(why: string);
}
export declare class CollectionParseError extends Error {
    constructor(collectionName: string, why: string);
}
export declare function isValidMod(mod: types.IMod): boolean;
export declare function isModInCollection(collectionMod: types.IMod, mod: types.IMod): boolean;
export declare function genCollectionLoadOrder(loadOrder: types.IFBLOLoadOrderEntry[], mods: {
    [modId: string]: types.IMod;
}, collection?: types.IMod): types.LoadOrder;
export declare function walkDirPath(dirPath: string): Promise<IEntry[]>;
export declare function prepareFileData(dirPath: string): Promise<Buffer>;
export declare function cleanUpEntries(fileEntries: IEntry[]): Promise<void>;
export declare function restoreFileData(fileData: Buffer, destination: string): Promise<void>;
export declare function hex2Buffer(hexData: string): any;
//# sourceMappingURL=util.d.ts.map