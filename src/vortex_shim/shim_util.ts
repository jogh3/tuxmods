import * as ofs from 'fs-extra';
import * as path from 'path';
import { createHash } from 'node:crypto';
import * as os from 'os';

import * as index from '../index.js'
import * as config from '../config_manager.js';
import log from '../vortex_api_shim.js';

export class processCanceled extends Error {};
export class UserCanceled extends Error {};
export class SetupError extends Error {};

export class ArgumentInvalid extends Error {
  constructor(argument: string) {
    super(`Invalid argument: "${argument}"`);
    this.name = this.constructor.name;
  }
}
// ---V
export class Overlayable<KeyT extends string | number | symbol, ObjT> {
  private mBaseData: Record<KeyT, ObjT>;
  private mLayers: { [layer: string]: Record<KeyT, Partial<ObjT>> } = {};
  private mDeduce: (key: KeyT, extraArg: any) => string;
  public constructor(
    basedata: Record<KeyT, ObjT>,
    deducelayer: (key: KeyT, extraArg: any) => string,
  ) {
    this.mBaseData = basedata;
    this.mDeduce = deducelayer;
  }
  public setLayer(layerId: string, data: Record<KeyT, Partial<ObjT>>) {
    this.mLayers[layerId] = data;
  }
  public keys(): string[] {
    return Object.keys(this.mBaseData);
  }
  public has(key: KeyT): boolean {
    return this.mBaseData[key] !== undefined;
  }
  public get<AttrT extends keyof ObjT, ValT extends ObjT[AttrT]>(
    key: KeyT,
    attr: AttrT,
    extraArg?: any,
  ): ValT {
    const layer = this.mDeduce(key, extraArg);
    if (layer === undefined) {
      return this.mBaseData[key]?.[attr] as ValT;
    }
    return (
      (this.mLayers[layer]?.[key]?.[attr] as any) ?? this.mBaseData[key]?.[attr]
    );
  }
  public get basedata() {
    return this.mBaseData;
  }
}

// ---V
export type VortexPaths = {
  base: string;
  assets: string;
  assets_unpacked: string;
  modules: string;
  modules_unpacked: string;
  bundledPlugins: string;
  locales: string;
  package: string;
  package_unpacked: string;
  application: string;
  userData: string;
  appData: string;
  localAppData: string;
  temp: string;
  home: string;
  documents: string;
  exe: string;
  desktop: string;
};
// needs to return wine prefix version of the windows file system
export function getVortexPath(id: keyof VortexPaths): string {
  const config_file: config.config_format = config.get_config();
  const game: string = config.return_game();

  if (!game || game === "no game specified") {
    console.error("GET_VORTEX_PATH: no game selected");
    return "";
  }

  let proton_loc: string = config_file.games[game]!.proton_loc;

  if (!ofs.existsSync(proton_loc) || proton_loc == "") proton_loc = path.join(os.homedir(),".wine");
  // proton and bottles use steamuser, wine usually uses the username of the account but can also have steamuser
  // should hopefully account for most usecases
  let user_base = path.join(proton_loc,"drive_c","users","steamuser");
  if (!ofs.existsSync(user_base)) user_base = path.join(proton_loc, "drive_c", "users", os.userInfo().username);
  if (!ofs.existsSync(user_base)) ofs.mkdirSync(user_base);

  let vortex_path: string = "";
  switch(id) {
    case "localAppData":
      vortex_path = path.join(user_base,"AppData","Local");
      break;
    case "appData":
      vortex_path = path.join(user_base, "AppData","Roaming");
      break;
    case "documents":
      vortex_path = path.join(user_base, "Documents");
      break;
    case "home":
      vortex_path = user_base;
      break;
    case "desktop":
      vortex_path = path.join(user_base, "Desktop");
      break;
    case "bundledPlugins":
      // if is in the libdir if installed
      // and in the running dir if only built
      const lib_plugins = path.join("","usr","local","lib","tuxmods","bundledPlugins");
      if (ofs.existsSync(lib_plugins)) {
        vortex_path = lib_plugins;
      } else {
        vortex_path = path.join(index.__dirname,"bundledPlugins");
      }
      break;
    case "temp":
      vortex_path = os.tmpdir();
      break;
    case "userData":
      // this is where external Extensions are located
      vortex_path = path.join(index.config_dir, "user_data");
      break;
    default:
      console.error("[Vortex Shim - Warn] Extension requested unsupported path ID:", id);
      break;
  }
  return vortex_path;
}

function pick(lhs: any, rhs: any): any {
  return lhs === undefined ? rhs : lhs;
}

// helper to strictly identify plain objects (excluding arrays and nulls)
function isobject(item: any): boolean {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

// a = lhs, b = rhs
export function deepMerge(a: any, b: any): any {
  if (a === undefined) return b;
  if (b === undefined) return a;
  
  // if they aren't both objects, fall back to pick immediately
  if (!isobject(a) || !isobject(b)) {
    return pick(b, a);
  }

  const result: any = {};
  const stack = [{ target: result, source_a: a, source_b: b }];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const { target, source_a, source_b } = current;
    
    // combine keys from both objects without duplicates
    const keys = Array.from(new Set([...Object.keys(source_a), ...Object.keys(source_b)]));

    for (const key of keys) {
      const val_a = source_a[key];
      const val_b = source_b[key];

      // condition 1: both are plain objects -> push to stack for next iteration
      if (isobject(val_a) && isobject(val_b)) {
        target[key] = {};
        stack.push({ target: target[key], source_a: val_a, source_b: val_b });
      } 
      // condition 2: both are arrays -> concatenate
      else if (Array.isArray(val_a) && Array.isArray(val_b)) {
        target[key] = val_a.concat(val_b);
      } 
      // condition 3: mixed types or primitives -> pick right-hand side over left-hand side
      else {
        target[key] = pick(val_b, val_a);
      }
    }
  }

  return result;
}

export function setdefault(obj: any, key: any, def: any){
  if (!obj[key]){
    obj[key]=def
  }
  return obj[key];
}

// ---V
export function makeOverlayableDictionary<keyt extends string | number | symbol, valuet>(basedata: Record<keyt, valuet>, layers: { [layerid: string]: Record<keyt, Partial<valuet>> }, deducelayer: (key: keyt, extraarg: any) => string): any { 
  // matching the lowercase parameter names exactly
  const res = new Overlayable<keyt, valuet>(basedata, deducelayer);
  
  for (const layerid of Object.keys(layers)) {
    const layer_data = layers[layerid];
    if (layer_data) {
      res.setLayer(layerid, layer_data);
    }
  }
  
  const proxyHandler: ProxyHandler<Overlayable<any, any>> = {
    ownKeys(target) {
      return Reflect.ownKeys(target.basedata);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (Reflect.has(target, prop)) {
        return Reflect.getOwnPropertyDescriptor(target, prop);
      } else {
        return {
          enumerable: true,
          configurable: true,
        };
      }
    },
    has(target, prop) {
      return Reflect.has(target, prop) || target.basedata[prop as any];
    },
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver) ?? target.basedata[prop as any];
    },
  };
  // you will need to define proxyhandler before this line
  return new Proxy(res, proxyHandler);
}

export function fileMD5(path: string): string {
  let raw_data: string = ofs.readFileSync(path).toString();
  return createHash('md5').update(raw_data).digest('hex');
}

export async function walk(target: string, callback: (iterPath: string, stats: ofs.Stats) => PromiseLike<any>,options?: any,): Promise<void> {
  let dir_stack: string[] = [target];
  let promise_arr: Array<PromiseLike<any>> = [];

  while (dir_stack.length > 0) {

    let current_dir: string = dir_stack.pop()!;

    if (!current_dir || !(await ofs.exists(current_dir))) continue;

    let dir_contents: string[] = (await ofs.readdir(current_dir)).map(content => path.join(current_dir,content));

    for (let item of dir_contents){
      const dir_type = await ofs.stat(item);

      promise_arr.push(callback(item, dir_type));

      if (dir_type.isDirectory() && path.extname(item) !== ".asar"){
        dir_stack.push(item);
      }
    }
  }
  await Promise.all(promise_arr);
}

export function setDefaultArray<T>(state: T, path: Array<string|number>,fallback: any[]): T{
   if (path.length === 0) {
      return state !== undefined && Array.isArray(state) ? (state.slice() as unknown as T) : (fallback as unknown as T);
   }
   let copy: any = (Array.isArray(state) ? state.slice() : {...(state as any)}) as any;
   let stack: any[] = [[copy, path[0],path]];

   while (stack.length > 0) {
     let [parent, key, current_path] = stack.pop();
     let cur_el = parent[key];
     if (path.length === 1) {
       parent[key] = !Object.hasOwnProperty.call(parent,key) || !Array.isArray(cur_el) ? fallback : cur_el.slice()
     } else {
       if (!Object.hasOwnProperty.call(parent,key) || typeof cur_el !== "object" || cur_el === null) {
         parent[key] = {};
       } else {
         parent[key] = Array.isArray(cur_el) ? cur_el.slice() : { ...cur_el };
       }
       let next_path = current_path.slice(1);
       stack.push([parent[key], next_path[0],next_path]);
     }
   }
   return copy as T;
}

// ---V
export function getSafe<T>(state: any, path: Array<string | number | undefined>,fallback: T): T {
  if (!path || path.length === 0) {
    return state ?? fallback;
  }
  let current = state;
  for (let i = 0; i < path.length; i++) {
    current = current?.[path[i]!];
    if (current == null) {
      return fallback;
    }
  }
  return current ?? fallback;
}

// found in vortex/src/renderer/src/util/storeHelper.ts line 285
// ---V
export function addUniqueSafe<T>(state: T, path: Array<string|number>,value: any): T {
  const copy = setDefaultArray(state,path,Array<unknown>());
  const arr = getSafe(copy,path,Array<unknown>());

  if (arr.indexOf(value) !== -1){
    return state;
  }
  arr.push(value);
  return copy;
}

const chunkSizeCache = new Map<string,number>();

// ---V
function calculateChunkSize(actions: Redux.Action[]): number {
  if (actions.length === 0) {
    return 100;
  }

  // Try to get cached chunk size for this action type
  const firstActionType = actions[0]?.type;
  if (firstActionType && chunkSizeCache.has(firstActionType)) {
    return chunkSizeCache.get(firstActionType);
  }

  // Sample first few actions to estimate average size
  const sampleSize = Math.min(10, actions.length);
  let totalSize = 0;

  for (let i = 0; i < sampleSize; i++) {
    try {
      // Estimate size via JSON serialization
      totalSize += JSON.stringify(actions[i]).length;
    } catch (err) {
      // If serialization fails, use conservative estimate
      log("warn", "failed to estimate action size for chunking", err);
      return 50;
    }
  }

  const avgActionSize = totalSize / sampleSize;

  // Target chunk size of ~6MB (in characters, roughly equivalent to bytes for ASCII)
  const TARGET_CHUNK_SIZE_MB = 6;
  const TARGET_CHUNK_SIZE_CHARS = TARGET_CHUNK_SIZE_MB * 1024 * 1024;

  // Calculate how many actions fit in target size
  const calculatedChunkSize = Math.floor(
    TARGET_CHUNK_SIZE_CHARS / avgActionSize,
  );

  // Clamp between reasonable bounds
  // Min 10: Avoid too many chunks for very large actions
  // Max 1000: Avoid huge chunks if actions are tiny
  const chunkSize = Math.max(10, Math.min(1000, calculatedChunkSize));

  // Cache the result for this action type
  if (firstActionType) {
    chunkSizeCache.set(firstActionType, chunkSize);
  }

  if (process.env.NODE_ENV === "development") {
    log("debug", "calculated dynamic chunk size", {
      actionType: firstActionType,
      totalActions: actions.length,
      avgActionSizeKB: (avgActionSize / 1024).toFixed(2),
      chunkSize,
      estimatedChunkSizeMB: (
        (chunkSize * avgActionSize) /
        (1024 * 1024)
      ).toFixed(2),
      cached: false,
    });
  }

  return chunkSize;
}

// ---V
export function batchDispatch(store: Redux.Dispatch | Redux.Store, actions: Redux.Action[]) {
  const dispatch = store["dispatch"] ?? store;
  if (actions.length === 0) {
    return;
  }

  // Use dynamic chunk sizing based on action payload size (with caching)
  const chunkSize = calculateChunkSize(actions);

  if (actions.length <= chunkSize) {
    // Small batch, dispatch normally without queuing overhead
    dispatch(batch(actions));
  } else {
    // Large batch, chunk it with queuing to prevent interleaving
    // Queue ensures all chunks from this batch complete before next batch starts
    batchQueue = batchQueue
      .then(() => {
        if (process.env.NODE_ENV === "development") {
          log("debug", "dispatching chunked batch", {
            total: actions.length,
            chunkSize,
            chunks: Math.ceil(actions.length / chunkSize),
          });
        }

        for (let i = 0; i < actions.length; i += chunkSize) {
          const chunk = actions.slice(i, i + chunkSize);
          dispatch(batch(chunk));
        }
      })
      .catch((err: any) => {
        log("error", "failed to dispatch chunked batch", err);
      });
  }
}

// ---V
const BYTE_LABELS = ["B", "KB", "MB", "GB", "TB"];

// ---V
export function bytesToString(bytes: number): string {
  let labelIdx = 0;
  while (bytes >= 1024) {
    ++labelIdx;
    bytes /= 1024;
  }
  try {
    return (
      bytes.toFixed(Math.max(0, labelIdx - 1)) + " " + BYTE_LABELS[labelIdx]
    );
  } catch (err) {
    return "???";
  }
}
