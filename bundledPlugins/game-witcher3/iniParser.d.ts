import { types } from 'vortex-api';
import { PriorityManager } from './priorityManager';
export default class IniStructure {
    private static instance;
    static getInstance(api?: types.IExtensionApi, priorityManager?: () => PriorityManager): IniStructure;
    private mIniStruct;
    private mApi;
    private mPriorityManager;
    constructor(api: types.IExtensionApi, priorityManager: () => PriorityManager);
    getIniStructure(): Promise<{}>;
    setINIStruct(loadOrder: types.LoadOrder): Promise<void>;
    revertLOFile(): Promise<void>;
    ensureModSettings(): Promise<any>;
    private createModSettings;
    modSettingsErrorHandler(err: any, errMessage: string): void;
    readStructure(): Promise<{
        [key: string]: any;
    }>;
    writeToModSettings(): Promise<void>;
}
//# sourceMappingURL=iniParser.d.ts.map