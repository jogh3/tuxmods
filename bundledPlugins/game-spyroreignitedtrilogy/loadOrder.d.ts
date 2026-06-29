import { types } from 'vortex-api';
import { LoadOrder } from './types';
export declare function serialize(context: types.IExtensionContext, loadOrder: LoadOrder, profileId?: string): Promise<void>;
export declare function deserialize(context: types.IExtensionContext): Promise<LoadOrder>;
export declare function validate(prev: LoadOrder, current: LoadOrder): Promise<any>;
//# sourceMappingURL=loadOrder.d.ts.map