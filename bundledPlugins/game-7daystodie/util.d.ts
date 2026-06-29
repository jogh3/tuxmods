import Bluebird from 'bluebird';
import { types } from 'vortex-api';
import { IProps } from './types';
export declare function purge(api: types.IExtensionApi): Promise<void>;
export declare function deploy(api: types.IExtensionApi): Promise<void>;
export declare const relaunchExt: (api: types.IExtensionApi) => any;
export declare const selectUDF: (context: types.IExtensionContext) => Promise<any>;
export declare function getModsPath(api: types.IExtensionApi): string;
export declare function toBlue<T>(func: (...args: any[]) => Promise<T>): (...args: any[]) => Bluebird<T>;
export declare function genProps(context: types.IExtensionContext, profileId?: string): IProps;
export declare function ensureLOFile(context: types.IExtensionContext, profileId?: string, props?: IProps): Promise<string>;
export declare function getPrefixOffset(api: types.IExtensionApi): number;
export declare function reversePrefix(input: string): number;
export declare function makePrefix(input: number): any;
export declare function getModName(modInfoPath: any): Promise<any>;
export declare function getModInfoFiles(basePath: string): Promise<string[]>;
export interface IAttribute extends IXmlNode<{
    id: string;
    type: string;
    value: string;
}> {
}
export interface IXmlNode<AttributeT extends object> {
    $: AttributeT;
}
export interface IModNameNode extends IXmlNode<{
    id: 'Name';
}> {
    attribute: IAttribute;
}
export interface IModInfoNode extends IXmlNode<{
    id: 'ModInfo';
}> {
    children?: [{
        node: IModNameNode[];
    }];
    attribute?: IAttribute[];
}
//# sourceMappingURL=util.d.ts.map