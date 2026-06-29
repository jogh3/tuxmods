import { ILookupResult, IQuery } from 'modmeta-db';
import { types } from 'vortex-api';
import { ISMAPIIOQuery, ISMAPIResult } from './types';
declare class SMAPIProxy {
    private mAPI;
    private mOptions;
    constructor(api: types.IExtensionApi);
    find(query: IQuery): Promise<ILookupResult[]>;
    findByNames(query: ISMAPIIOQuery[]): Promise<ISMAPIResult[]>;
    private makeKey;
    private lookupOnNexus;
}
export default SMAPIProxy;
//# sourceMappingURL=smapiProxy.d.ts.map