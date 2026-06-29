import { IRevision } from '@nexusmods/nexus-api';
import { types } from 'vortex-api';
export interface IMorrowindData {
    loadOrder: ILoadOrderEntry[];
}
export interface IExtendedInterfaceProps {
    t: types.TFunction;
    gameId: string;
    collection: types.IMod;
    revisionInfo: IRevision;
}
export interface ILoadOrderEntry<T = any> {
    id: string;
    enabled: boolean;
    name: string;
    modId?: string;
    data?: T;
}
//# sourceMappingURL=types.d.ts.map