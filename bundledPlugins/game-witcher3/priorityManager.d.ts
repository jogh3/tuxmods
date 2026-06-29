import { types } from 'vortex-api';
export type PriorityType = 'position-based' | 'prefix-based';
export interface IOffsetMap {
    [offset: number]: number;
}
interface IProps {
    state: types.IState;
    profile: types.IProfile;
    loadOrder: types.LoadOrder;
    minPriority: number;
}
export declare class PriorityManager {
    private mApi;
    private mPriorityType;
    private mMaxPriority;
    constructor(api: types.IExtensionApi, priorityType: PriorityType);
    set priorityType(type: PriorityType);
    get priorityType(): PriorityType;
    resetMaxPriority: (min?: number) => void;
    getPriority: (loadOrder: types.LoadOrder, item: types.ILoadOrderEntry) => any;
    private genProps;
    getMaxPriority: (props: IProps) => number;
}
export {};
//# sourceMappingURL=priorityManager.d.ts.map