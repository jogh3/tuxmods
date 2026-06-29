export declare class MD5ComparisonError extends Error {
    private mPath;
    constructor(message: any, file: any);
    get affectedFile(): any;
    get errorMessage(): string;
}
export declare class ResourceInaccessibleError extends Error {
    private mIsReportingAllowed;
    private mFilePath;
    constructor(filePath: any, allowReport?: boolean);
    get isOneDrive(): any;
    get allowReport(): boolean;
    get errorMessage(): string;
}
export declare class MergeDataViolationError extends Error {
    private mNotIncluded;
    private mOptional;
    private mCollectionName;
    constructor(notIncluded: string[], optional: string[], collectionName: string);
    get Optional(): string[];
    get NotIncluded(): string[];
    get CollectionName(): string;
}
export declare function calcHashImpl(filePath: any): Promise<unknown>;
export declare function getHash(filePath: any, tries?: number): any;
export declare function getLoadOrderFilePath(): any;
export declare function getPriorityTypeBranch(): string[];
export declare function getSuppressModLimitBranch(): string[];
export declare const GAME_ID = "witcher3";
export declare const INPUT_XML_FILENAME = "input.xml";
export declare const VORTEX_BACKUP_TAG = ".vortex_backup";
export declare const PART_SUFFIX = ".part.txt";
export declare const SCRIPT_MERGER_ID = "W3ScriptMerger";
export declare const MERGE_INV_MANIFEST = "MergeInventory.xml";
export declare const LOAD_ORDER_FILENAME = "mods.settings";
export declare const I18N_NAMESPACE = "game-witcher3";
export declare const CONFIG_MATRIX_REL_PATH: any;
export declare const CONFIG_MATRIX_FILES: string[];
export declare const W3_TEMP_DATA_DIR: any;
export declare const UNI_PATCH = "mod0000____CompilationTrigger";
export declare const LOCKED_PREFIX = "mod0000_";
export declare const DO_NOT_DISPLAY: string[];
export declare const DO_NOT_DEPLOY: string[];
export declare const SCRIPT_MERGER_FILES: string[];
export declare const NON_SORTABLE: string[];
export declare const ACTIVITY_ID_IMPORTING_LOADORDER = "activity-witcher3-importing-loadorder";
//# sourceMappingURL=common.d.ts.map