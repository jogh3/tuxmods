export declare function testPlugAndPlayInstaller(files: string[], gameId: string): Promise<{
    supported: boolean;
    requiredFiles: never[];
}>;
export declare function installPlugAndPlay(files: string[], destinationPath: string): Promise<{
    instructions: types.IInstruction[];
}>;
export declare function testModConfigInstaller(files: any, gameId: any): Promise<{
    supported: boolean;
    requiredFiles: never[];
}>;
export declare function installModConfig(files: string[], destinationPath: string): Promise<{
    instructions: never[];
}>;
export declare function testInstaller(files: any, gameId: any): Promise<{
    supported: boolean;
    requiredFiles: never[];
}>;
export declare function install(files: string[], destinationPath: string): Promise<{
    instructions: types.IInstruction[];
}>;
//# sourceMappingURL=installers.d.ts.map