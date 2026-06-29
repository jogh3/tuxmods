import { types } from 'vortex-api';
export type LockedState = 'true' | 'false' | 'always' | 'never';
export type LoadOrder = ILoadOrderEntry[];
export interface IProps {
    state: types.IState;
    api: types.IExtensionApi;
    profile: types.IProfile;
    discovery: types.IDiscoveryResult;
    mods: {
        [modId: string]: types.IMod;
    };
}
export interface ISerializableData {
    prefix: string;
}
export interface ILoadOrderEntry {
    id: string;
    enabled: boolean;
    name: string;
    modId?: string;
    data?: ISerializableData;
}
//# sourceMappingURL=types.d.ts.map