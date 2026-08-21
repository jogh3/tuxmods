import * as ofs from 'fs';
import * as path from 'path';
import { createHash } from 'node:crypto';
import * as os from 'os';

import * as index from './index.js'
import * as config from './config_manager.js';

export namespace util {
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
  function getVortexPath(id: string): string {
    const config_file: config.config_format = config.get_config();
    const game: string = config.return_game();

    if (!game) {
      console.error(index.error_color, "GET_VORTEX_PATH: no game selected", index.RST);
      return "";
    }

    let proton_loc: string = config_file.games[game]!.proton_loc;

    if (!ofs.existsSync(proton_loc) || proton_loc == "") proton_loc = path.join(os.homedir(),".wine");
    const user_base = path.join(proton_loc,"drive_c","users","steamuser");
    if (!ofs.existsSync(user_base)) ofs.mkdirSync(user_base);

    let vortex_path: string = "";
    // TODO: get all the proton paths that could be requested, not difficult but requires research
    switch(id) {
      case "localAppData":
        vortex_path = path.join(proton_loc, "drive_c","users","steamuser","AppData","Local");
        break;
      case "appData":
        vortex_path = path.join(proton_loc, "AppData","Roaming");
        break;
      case "documents":
        vortex_path = path.join(proton_loc, "Documents");
        break;
      case "home":
        vortex_path = user_base;
        break;
      case "desktop":
        vortex_path = path.join(user_base, "Desktop");
        break;
      default:
        console.error(index.error_color, "[Vortex Shim - Warn] Extension requested unsupported path ID:", id, index.RST)
        break;
    }
    return vortex_path;
  }

  function getSafe(state: any, path: Array<string | number | undefined>, defaultval: any) {
    if (!path || path.length === 0) return state ?? defaultval;
    let current = state;
    for (let i = 0; i < path.length; i++){
      current = current?.[path[i]!];
      if (current == null) return defaultval;
    }
    return current ?? defaultval;
  }

  function deepMerge(a: any, b: any) {
    if (a === undefined){
      return b;
    } else if (b === undefined){
      return a;
    }
    const result: any = {};
    for ( const key of Object.keys(a).concat(Object.keys(b))) {
      if (a[key] === undefined || b[key] === undefined) {
        result[key] = () => a === undefined ? b : a; 
      }
      result[key] = 
        typeof a[key] === "object" && typeof b[key] === "object"
          ? (result[key] = deepMerge(a[key],b[key]))
          : Array.isArray(a[key]) && Array.isArray(b[key])
            ? (result[key] = a[key].concat(b[key]))
            : (result[key] = () => b[key] === undefined ? a[key] : b[key] );
    }
    return result;
  }

  function setdefault(obj: any, key: any, def: any){
    if (!obj[key]){
      obj[key]=def
    }
    return obj[key];
  }

  function makeoverlayabledictionary<keyt extends string | number | symbol, valuet>(basedata: Record<keyt, valuet>, layers: { [layerid: string]: Record<keyt, Partial<valuet>> }, deducelayer: (key: keyt, extraarg: any) => string): any { 
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

  function fileMD5(path: string): string {
    let raw_data: string = ofs.readFileSync(path).toString();
    return createHash('md5').update(raw_data).digest('hex');
  }

  export async function walk(
    target: string,
    callback: (iterPath: string, stats: ofs.Stats) => PromiseLike<any>,
    options?: IWalkOptions,
  ): Promise<void> {
    const opt = options || {};

    try {
      let fileNames: string[];
      try {
        fileNames = await fs.readdirAsync(target);
      } catch (err) {
        if (getErrorCode(err) === "ENOENT") {
          log("debug", "walk: ENOENT on target", { target });
          return;
        }
        throw err;
      }

      const statResults = await Promise.all<fs.Stats | null>(
        fileNames.map((statPath) =>
          fs.lstatAsync(path.join(target, statPath))
            .catch(() => null),
        ),
      );

      const subDirs: string[] = [];
      const cbPromises: Array<PromiseLike<any>> = [];
      statResults.forEach((stat, idx) => {
        if (stat === null) {
          return;
        }
        const fullPath = path.join(target, fileNames[idx]);
        cbPromises.push(callback(fullPath, stat));
        if (stat.isDirectory() && path.extname(fullPath) !== ".asar") {
          subDirs.push(fullPath);
        }
      });

      const walkSubDirs = async () => {
        for (const subDir of subDirs) {
          await walk(subDir, callback, options);
        }
      };
      await Promise.all([...cbPromises, walkSubDirs()]);
    } catch (err) {
      const code = getErrorCode(err);
      if (
        opt.ignoreErrors !== undefined &&
        (opt.ignoreErrors === true ||
          (code && opt.ignoreErrors.indexOf(code) !== -1))
      ) {
        return;
      }
      throw err;
    }
  }

  class processCanceled extends Error {};
  class UserCanceled extends Error {};
  class SetupError extends Error {};
}

export namespace fs {
  function readFileAsync(){
    return;
  }
  function writeFileAsync() {
    return;
  }
  function readdirAsync(){
    return;
  }
  function ensureDirAsync() {
    return;
  }
  function ensureFileAsync() {
    return;
  }
}

export namespace selectors {
  function activeGameId(state: string){
    return;
  }
  function discoveryByGame(state: string, gameId: string){
    return;
  }
  function installPathForGame(state: string,gameId: string){
    return;
  }
  function modsForGame(state: string, gameId: string){
    return;
  }
}

export namespace log {
  function log(level: string, message: string, metadata: string) {
    console.log(index.vortex_log_color,`[Vortex shim - ${level}] ${message}`, index.RST);
    return;
  }
}

export namespace actions{
  function setModEnabled() {
    return {};
  }
  function setDeploymentNecessary(){
    return {};
  }
}

