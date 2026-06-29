import { types } from 'vortex-api';
import { PriorityManager } from './priorityManager';
import { IRemoveModOptions } from './types';
type Deployment = {
    [modType: string]: types.IDeployedFile[];
};
export declare function onGameModeActivation(api: types.IExtensionApi): (gameMode: string) => Promise<void>;
export declare const onWillDeploy: (api: types.IExtensionApi) => (profileId: string, deployment: Deployment) => Promise<any>;
export declare const onModsDisabled: (api: types.IExtensionApi, priorityManager: () => PriorityManager) => (modIds: string[], enabled: boolean, gameId: string) => Promise<void>;
export declare const onDidRemoveMod: (api: types.IExtensionApi, priorityManager: () => PriorityManager) => (gameId: string, modId: string, removeOpts: IRemoveModOptions) => Promise<void>;
export declare const onDidPurge: (api: types.IExtensionApi, priorityManager: () => PriorityManager) => (profileId: string, deployment: Deployment) => Promise<any>;
export declare const onDidDeploy: (api: types.IExtensionApi) => (profileId: string, deployment: Deployment) => Promise<any>;
export declare const onProfileWillChange: (api: types.IExtensionApi) => (profileId: string) => Promise<void>;
export declare const onSettingsChange: (api: types.IExtensionApi, priorityManager: () => PriorityManager) => (prev: string, current: any) => Promise<void>;
export {};
//# sourceMappingURL=eventHandlers.d.ts.map