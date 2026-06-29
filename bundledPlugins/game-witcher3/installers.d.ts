import { types } from 'vortex-api';
export declare function scriptMergerTest(files: any, gameId: any): Promise<{
    supported: boolean;
    requiredFiles: any;
}>;
export declare function scriptMergerDummyInstaller(): (api: types.IExtensionApi) => Promise<never>;
export declare function testMenuModRoot(instructions: any[], gameId: string): Promise<types.ISupportedResult | boolean>;
export declare function installMenuMod(files: string[], destinationPath: string): Promise<{
    instructions: never[];
}>;
export declare function testSupportedContent(files: string[], gameId: string): Promise<{
    supported: string | false | undefined;
    requiredFiles: never[];
}>;
export declare function installContent(files: string[], destinationPath: string): Promise<{
    type: string;
    source: string;
    destination: any;
}[]>;
export declare function testSupportedTL(files: string[], gameId: string): Promise<{
    supported: boolean;
    requiredFiles: never[];
}>;
export declare function installTL(files: string[]): Promise<{
    instructions: {
        type: string;
        source: string;
        destination: string;
    }[];
}>;
export declare function testDLCMod(files: string[], gameId: string): Promise<types.ISupportedResult>;
export declare function installDLCMod(files: string[]): Promise<{
    instructions: types.IInstruction[];
}>;
export declare function testSupportedMixed(files: string[], gameId: string): Promise<types.ISupportedResult>;
export declare function installMixed(files: string[]): Promise<{
    instructions: types.IInstruction[];
}>;
//# sourceMappingURL=installers.d.ts.map