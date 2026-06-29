import { types } from 'vortex-api';
import { IPakInfo } from './types';
export interface ICacheEntry {
    lastModified: number;
    info: IPakInfo;
    fileName: string;
    packageList: string[];
    isListed: boolean;
    mod?: types.IMod;
}
export default class PakInfoCache {
    private static instance;
    static getInstance(api: types.IExtensionApi): PakInfoCache;
    private mCache;
    private mApi;
    constructor(api: types.IExtensionApi);
    getCacheEntry(api: types.IExtensionApi, filePath: string, mod?: types.IMod): Promise<ICacheEntry>;
    reset(): void;
    save(): Promise<void>;
    private load;
    private isLOListed;
    private fileId;
}
//# sourceMappingURL=cache.d.ts.map