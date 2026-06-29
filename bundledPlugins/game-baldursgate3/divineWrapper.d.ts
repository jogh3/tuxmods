import { types } from 'vortex-api';
export declare class DivineExecMissing extends Error {
    constructor();
}
export declare class DivineMissingDotNet extends Error {
    constructor();
}
export declare class DivineTimedOut extends Error {
    constructor();
}
export declare function extractPak(api: types.IExtensionApi, pakPath: any, destPath: any, pattern: any): Promise<IDivineOutput>;
export declare function listPackage(api: types.IExtensionApi, pakPath: string): Promise<string[]>;
//# sourceMappingURL=divineWrapper.d.ts.map