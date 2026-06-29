import { types } from 'vortex-api';
import { ILoadOrder } from './collections/types';
export declare function migrate148(context: types.IExtensionContext, oldVersion: string): Promise<void>;
export declare function getPersistentLoadOrder(api: types.IExtensionApi, loadOrder?: ILoadOrder): types.LoadOrder;
//# sourceMappingURL=migrations.d.ts.map