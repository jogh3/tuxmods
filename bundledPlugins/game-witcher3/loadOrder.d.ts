import React from 'react';
import { types } from 'vortex-api';
import { PriorityManager } from './priorityManager';
import { IItemRendererProps } from './types';
export interface IBaseProps {
    api: types.IExtensionApi;
    getPriorityManager: () => PriorityManager;
    onToggleModsState: (enable: boolean) => void;
}
declare class TW3LoadOrder implements types.ILoadOrderGameInfo {
    gameId: string;
    toggleableEntries?: boolean | undefined;
    clearStateOnPurge?: boolean | undefined;
    usageInstructions?: React.ComponentType<{}>;
    noCollectionGeneration?: boolean | undefined;
    customItemRenderer?: React.ComponentType<{
        className?: string;
        item: IItemRendererProps;
        forwardedRef?: (ref: any) => void;
    }>;
    private mApi;
    private mPriorityManager;
    constructor(props: IBaseProps);
    serializeLoadOrder(loadOrder: types.LoadOrder): Promise<void>;
    private readableNames;
    deserializeLoadOrder(): Promise<types.LoadOrder>;
    validate(prev: types.LoadOrder, current: types.LoadOrder): Promise<types.IValidationResult>;
}
export declare function importLoadOrder(api: types.IExtensionApi, collectionId: string): Promise<void>;
export default TW3LoadOrder;
//# sourceMappingURL=loadOrder.d.ts.map