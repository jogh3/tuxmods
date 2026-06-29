export declare const MOD_INFO = "modinfo.xml";
export declare const GAME_ID = "7daystodie";
export declare const LO_FILE_NAME = "loadOrder.json";
export declare const I18N_NAMESPACE = "game-7daystodie";
export declare const INVALID_LO_MOD_TYPES: string[];
export declare function launcherSettingsFilePath(): string;
export declare function loadOrderFilePath(profileId: string): string;
export declare function modsRelPath(): string;
export declare function gameExecutable(): string;
export declare const DEFAULT_LAUNCHER_SETTINGS: {
    ShowLauncher: boolean;
    DefaultRunConfig: {
        ExclusiveMode: boolean;
        Renderer: string;
        UseGamesparks: boolean;
        UseEAC: boolean;
        UseNativeInput: boolean;
        AdditionalParameters: string;
    };
};
//# sourceMappingURL=common.d.ts.map