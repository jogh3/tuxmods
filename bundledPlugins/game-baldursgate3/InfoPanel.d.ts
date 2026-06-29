import { types } from 'vortex-api';
interface IBaseProps {
    api: types.IExtensionApi;
    getOwnGameVersion: (state: types.IState) => Promise<string>;
    readStoredLO: (api: types.IExtensionApi) => Promise<void>;
    installLSLib: (api: types.IExtensionApi, gameId: string) => Promise<void>;
    getLatestLSLibMod: (api: types.IExtensionApi) => types.IMod;
}
export declare function InfoPanelWrap(props: IBaseProps): any;
export {};
//# sourceMappingURL=InfoPanel.d.ts.map