import { types } from 'vortex-api';
export declare const doMergeXML: (api: types.IExtensionApi) => (modFilePath: string, targetMergeDir: string) => Promise<any>;
export declare const canMergeXML: (api: types.IExtensionApi) => (game: any, gameDiscovery: any) => {
    baseFiles: (deployedFiles: types.IDeployedFile[]) => {
        in: any;
        out: any;
    }[];
    filter: (filePath: any) => any;
} | undefined;
export declare const canMergeSettings: (api: types.IExtensionApi) => (game: types.IGame, gameDiscovery: types.IDiscoveryResult) => {
    baseFiles: (deployedFiles: types.IDeployedFile[]) => {
        in: any;
        out: any;
    }[];
    filter: (filePath: any) => any;
} | undefined;
export declare const doMergeSettings: (api: types.IExtensionApi) => (modFilePath: string, targetMergeDir: string) => Promise<any>;
//# sourceMappingURL=mergers.d.ts.map