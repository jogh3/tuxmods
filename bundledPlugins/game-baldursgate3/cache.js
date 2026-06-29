/* eslint-disable */
import * as path from 'path';
import { fs, log, selectors, types, util } from 'vortex-api';
import { GAME_ID } from './common';
import { listPackage } from './divineWrapper';
import { IPakInfo } from './types';
import { extractPakInfoImpl, logDebug } from './util';
import LRU from 'lru-cache';
import { setTimeout } from 'timers/promises';
export default class PakInfoCache {
    static instance = null;
    static getInstance(api) {
        if (!PakInfoCache.instance) {
            PakInfoCache.instance = new PakInfoCache(api);
        }
        return PakInfoCache.instance;
    }
    mCache;
    mApi;
    constructor(api) {
        // 700 should be enough for everyone I hope.
        this.mApi = api;
        this.mCache = new LRU({ max: 700 });
        this.load(api);
    }
    async getCacheEntry(api, filePath, mod) {
        const id = this.fileId(filePath);
        const stat = await fs.statAsync(filePath);
        const ctime = stat.ctimeMs;
        const hasChanged = (entry) => {
            return (!!mod && !!entry.mod)
                ? mod.attributes?.fileId !== entry.mod.attributes?.fileId
                : ctime !== entry?.lastModified;
        };
        const cacheEntry = await this.mCache.get(id);
        const packageNotListed = (cacheEntry?.packageList || []).length === 0;
        if (!cacheEntry || hasChanged(cacheEntry) || packageNotListed) {
            const packageList = await listPackage(api, filePath);
            const isListed = this.isLOListed(api, filePath, packageList);
            const info = await extractPakInfoImpl(api, filePath, mod, isListed);
            this.mCache.set(id, {
                fileName: path.basename(filePath),
                lastModified: ctime,
                info,
                packageList,
                mod,
                isListed,
            });
        }
        return this.mCache.get(id);
    }
    reset() {
        this.mCache = new LRU({ max: 700 });
        this.save();
    }
    async save() {
        if (!this.mCache) {
            // Nothing to save.
            return;
        }
        const state = this.mApi.getState();
        const profileId = selectors.lastActiveProfileForGame(state, GAME_ID);
        const staging = selectors.installPathForGame(state, GAME_ID);
        const cachePath = path.join(path.dirname(staging), 'cache', profileId + '.json');
        try {
            await fs.ensureDirWritableAsync(path.dirname(cachePath));
            await util.writeFileAtomic(cachePath, JSON.stringify(this.mCache.dump()));
        }
        catch (err) {
            log('error', 'failed to save cache', err);
            return;
        }
    }
    async load(api) {
        const state = api.getState();
        const profileId = selectors.lastActiveProfileForGame(state, GAME_ID);
        const staging = selectors.installPathForGame(state, GAME_ID);
        const cachePath = path.join(path.dirname(staging), 'cache', profileId + '.json');
        try {
            await fs.ensureDirWritableAsync(path.dirname(cachePath));
            const data = await fs.readFileAsync(cachePath, { encoding: 'utf8' });
            this.mCache.load(JSON.parse(data));
        }
        catch (err) {
            if (!['ENOENT'].includes(err.code)) {
                log('error', 'failed to load cache', err);
            }
        }
    }
    isLOListed(api, pakPath, packageList) {
        try {
            // look at the end of the first bit of data to see if it has a meta.lsx file
            // example 'Mods/Safe Edition/meta.lsx\t1759\t0'
            const containsMetaFile = packageList.find(line => path.basename(line.split('\t')[0]).toLowerCase() === 'meta.lsx') !== undefined ? true : false;
            // invert result as 'listed' means it doesn't contain a meta file.
            return !containsMetaFile;
        }
        catch (err) {
            api.sendNotification({
                type: 'error',
                message: `${path.basename(pakPath)} couldn't be read correctly. This mod be incorrectly locked/unlocked but will default to unlocked.`,
            });
            return false;
        }
    }
    fileId(filePath) {
        return path.basename(filePath).toUpperCase();
    }
}
//# sourceMappingURL=cache.js.map