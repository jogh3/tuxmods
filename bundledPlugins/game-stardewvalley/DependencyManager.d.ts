import { ISDVModManifest } from './types';
import { types } from 'vortex-api';
type ManifestMap = {
    [modId: string]: ISDVModManifest[];
};
export default class DependencyManager {
    private mApi;
    private mManifests;
    private mLoading;
    constructor(api: types.IExtensionApi);
    getManifests(): Promise<ManifestMap>;
    refresh(): Promise<void>;
    scanManifests(force?: boolean): Promise<void>;
}
export {};
//# sourceMappingURL=DependencyManager.d.ts.map