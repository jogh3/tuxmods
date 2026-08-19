import * as ofs from 'fs';
import * as path from 'path';
import { createHash } from 'node:crypto';

import * as index from './index.js'
import * as config from './config_manager.js';

export namespace util {
  // needs to return wine prefix version of the windows file system
  function getVortexPath(id: string) {
    const game: string = "The Elder Scrolls V: Skyrim Special Edition";
    const config_file: config.config_format = config.get_config();
    const proton_loc: string = config_file.games[game].proton_loc;
    let vortex_path: string = "";
    switch(id) {
      case "localAppData":
        vortex_path = path.join(proton_loc, "drive_c/users/steamuser/AppData/Local/");
        break;
      default:
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
  function makeOverlayableDictionary(basedata: any, layers: any, deducelayer: any) : any { 
    return {};
  }
  function fileMD5(path: string): string {
    let raw_data: string = ofs.readFileSync(path).toString();
    return createHash('md5').update(raw_data).digest('hex');
  }
  function walk(dir: string, cb: any) {
    return;
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

