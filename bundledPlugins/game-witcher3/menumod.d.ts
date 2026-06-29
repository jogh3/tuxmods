export declare function onWillDeploy(api: any, deployment: any, activeProfile: any): Promise<any>;
export declare function onDidDeploy(api: any, deployment: any, activeProfile: any): Promise<string | void>;
export declare function menuMod(profileName: any): string;
export declare function removeMenuMod(api: any, profile: any): Promise<void>;
export declare function ensureMenuMod(api: any, profile: any): Promise<string>;
export declare function exportMenuMod(api: any, profile: any, includedMods: any): Promise<any>;
export declare function importMenuMod(api: any, profile: any, fileData: any): Promise<undefined>;
//# sourceMappingURL=menumod.d.ts.map