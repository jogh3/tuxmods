import { types } from 'vortex-api';
export declare function getLatestReleases(currentVersion: string): Promise<any[] | undefined>;
export declare function checkForUpdates(api: types.IExtensionApi, currentVersion: string): Promise<string>;
export declare function downloadDivine(api: types.IExtensionApi): Promise<void>;
//# sourceMappingURL=githubDownloader.d.ts.map