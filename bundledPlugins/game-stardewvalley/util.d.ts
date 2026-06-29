import * as semver from 'semver';
import { IEntry, IWalkOptions } from 'turbowalk';
import { ISDVModManifest } from './types';
export declare function defaultModsRelPath(): string;
export declare function parseManifest(manifestFilePath: string): Promise<ISDVModManifest>;
/**
 * semver.coerce drops pre-release information from a
 * perfectly valid semantic version string, don't want that
 */
export declare function coerce(input: string): semver.SemVer;
export declare function semverCompare(lhs: string, rhs: string): number;
export declare function walkPath(dirPath: string, walkOptions?: IWalkOptions): Promise<IEntry[]>;
export declare function deleteFolder(dirPath: string, walkOptions?: IWalkOptions): Promise<void>;
//# sourceMappingURL=util.d.ts.map