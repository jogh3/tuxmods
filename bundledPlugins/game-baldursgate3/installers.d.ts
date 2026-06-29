import { types } from 'vortex-api';
export declare function testLSLib(files: string[], gameId: string): Promise<types.ISupportedResult>;
export declare function testModFixer(files: string[], gameId: string): Promise<types.ISupportedResult>;
export declare function testEngineInjector(files: string[], gameId: string): Promise<types.ISupportedResult>;
export declare function installBG3SE(files: string[]): Promise<types.IInstallResult>;
export declare function installModFixer(files: string[]): Promise<types.IInstallResult>;
export declare function installEngineInjector(files: string[]): Promise<types.IInstallResult>;
export declare function installLSLib(files: string[], destinationPath: string): Promise<types.IInstallResult>;
export declare function testBG3SE(files: string[], gameId: string): Promise<types.ISupportedResult>;
export declare function testReplacer(files: string[], gameId: string): Promise<types.ISupportedResult>;
export declare function installReplacer(files: string[]): Promise<types.IInstallResult>;
//# sourceMappingURL=installers.d.ts.map