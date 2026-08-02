import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js'

export namespace util {
  // needs to return wine prefix version of the windows file system
  function getVortexPath(id: string) {
    return;
  }
  function getSafe(obj: any, pathArray: any, defaultValue: any) {
    return;
  }
  function deepMerge(a: any, b: any) {
    return;
  }
  function setdefault(obj: any, key: any, def: any){
    return;
  }
  function makeOverlayableDictionary(){
    return;
  }
  function fileMD5(path: string) {
    return;
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
    if (index.show_color){
      console.log("\033[38;5;214m\033[48;5;0m",`[Vortex shim - ${level}] ${message}`, "\033[0m");
    } else {
      console.log(`[Vortex shim - ${level}] ${message}`);
    }
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
