import Bluebird from 'bluebird';
import { types } from 'vortex-api';
import { IProps } from './types';
export declare function toBlue<T>(func: (...args: any[]) => Promise<T>): (...args: any[]) => Bluebird<T>;
export declare function genProps(context: types.IExtensionContext, profileId?: string): IProps;
export declare function ensureLOFile(context: types.IExtensionContext, profileId?: string, props?: IProps): Promise<string>;
export declare function makePrefix(input: number): any;
export declare function getPakFiles(basePath: string): Promise<string[]>;
//# sourceMappingURL=util.d.ts.map