import { types } from 'vortex-api';
import { IKCDCollectionsData } from './types';
export declare function exportLoadOrder(state: types.IState, modIds: string[]): Promise<string[]>;
export declare function importLoadOrder(api: types.IExtensionApi, collection: IKCDCollectionsData): Promise<void>;
//# sourceMappingURL=loadOrder.d.ts.map