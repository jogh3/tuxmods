import { IncomingHttpHeaders } from 'http';
import { types } from 'vortex-api';
export type PrefixType = 'dlc' | 'mod';
export interface IDeployment {
    [modTypeId: string]: IDeployedFile[];
}
export interface IDeployedFile {
    relPath: string;
    source: string;
    merged?: string[];
    target?: string;
    time: number;
}
export interface IRemoveModOptions {
    willBeReplaced?: boolean;
    incomplete?: boolean;
    ignoreInstalling?: boolean;
    modData?: types.IMod;
    progressCB?: (numRemoved: number, numTotal: number, name: string) => void;
}
export interface IItemRendererProps {
    loEntry: types.ILoadOrderEntry;
    displayCheckboxes: boolean;
    invalidEntries?: any[];
    setRef?: (ref: any) => void;
}
export interface IIncomingGithubHttpHeaders extends IncomingHttpHeaders {
    "x-ratelimit-reset": string;
    "x-ratelimit-remaining": string;
}
//# sourceMappingURL=types.d.ts.map