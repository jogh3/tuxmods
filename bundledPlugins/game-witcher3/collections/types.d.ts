import { IRevision } from '@nexusmods/nexus-api';
import { types } from 'vortex-api';
export interface IW3MergedData {
    menuModSettingsData?: string;
    scriptMergedData?: string;
}
export interface IW3CollectionsData {
    loadOrder: ILoadOrder;
    mergedData?: IW3MergedData;
}
export interface IExtendedInterfaceProps {
    t: types.TFunction;
    gameId: string;
    collection: types.IMod;
    revisionInfo: IRevision;
}
export interface IExtensionFeature {
    id: string;
    generate: (gameId: string, includedMods: string[]) => Promise<any>;
    parse: (gameId: string, collection: IW3CollectionsData) => Promise<void>;
    title: (t: types.TFunction) => string;
    condition?: (state: types.IState, gameId: string) => boolean;
    editComponent?: React.ComponentType<IExtendedInterfaceProps>;
}
export interface IProps {
    state: types.IState;
    api: types.IExtensionApi;
    profile: types.IProfile;
    discovery: types.IDiscoveryResult;
    mods: {
        [modId: string]: types.IMod;
    };
}
export interface ILoadOrderEntry<T = any> {
    pos: number;
    enabled: boolean;
    prefix?: string;
    data?: T;
    locked?: boolean;
    external?: boolean;
}
export interface ILoadOrder {
    [modId: string]: ILoadOrderEntry;
}
//# sourceMappingURL=types.d.ts.map