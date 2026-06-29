import { types } from 'vortex-api';
export declare class ModLimitPatcher {
    private mApi;
    private mIsPatched;
    constructor(api: types.IExtensionApi);
    ensureModLimitPatch(): Promise<string | undefined>;
    getLimitText(t: any): any;
    private queryPatch;
    private createModLimitPatchMod;
    private hasSequence;
    private patchChunk;
    private streamExecutable;
}
//# sourceMappingURL=modLimitPatch.d.ts.map