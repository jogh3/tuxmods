import * as ofs from 'fs-extra';
import * as path from 'path';

import {convert_to_unix, make_fs_error} from './shim_fs.js';

// this file is for standard fs functions that are just returned

export function createReadStream(path: string, options: any) {
  path = convert_to_unix(path);
  if (!ofs.existsSync(path)) {
    throw make_fs_error(`file ${path} doesn't exist, cannot read`, 'ENOENT')
  }
  return ofs.createReadStream(path, options);
}
export function createWriteStream(path: string, options: any) {
  path = convert_to_unix(path);
  return ofs.createWriteStream(path, options);
}
export function lstatSync(path: string, options: any){
  path = convert_to_unix(path);
  if (!ofs.existsSync(path)) {
    throw make_fs_error(`file ${path} doesn't exist, cannot read`, 'ENOENT')
  }
  return ofs.lstatSync(path, options);
}
export async function readFileAsync(f: string, options?: any): Promise<string> {
  f = convert_to_unix(f);
  if (!(await ofs.pathExists(f))) {
    throw make_fs_error(`file ${f} doesn't exist, cannot read`, 'ENOENT')
  }
  return ofs.promises.readFile(f, { encoding: 'utf8', ...options }) as unknown as Promise<string>;
}
export async function isDirectoryAsync(dir_path: string): Promise<boolean> {
  dir_path = convert_to_unix(dir_path);
  return Promise.resolve(ofs.promises.stat(dir_path)).then((stats) => stats.isDirectory());
}

export async function writeFileAsync(file: string,data: any, options?: ofs.WriteFileOptions): Promise<void> {
  file = convert_to_unix(file);
  return ofs.promises.writeFile(file, data, options);
}

export async function readdirAsync(dir: string): Promise<string[]>{
  dir = convert_to_unix(dir);
  if (!(await ofs.pathExists(dir))) {
    throw make_fs_error(`directory ${dir} does not exist, cannot read`, 'ENOENT');
  }
  return ofs.promises.readdir(dir);
}
export async function lstatAsync(target_path: string): Promise<Stats> {
  target_path = convert_to_unix(target_path);
  return ofs.promises.lstat(target_path);
}

export async function chmodAsync(path: string, mode: string | number): Promise<void> {
  path = convert_to_unix(path);
  return ofs.promises.chmod(path, mode).catch((err) => console.error(err));
}
export async function ensureFileAsync(file_path: string): Promise<void> {
  file_path = convert_to_unix(file_path);
  return Promise.resolve(ofs.ensureFile(file_path));
}
export async function mkdirAsync(path: string): Promise<void> {
  path = convert_to_unix(path);
  ofs.mkdir(path);
}
export async function mkdirsAsync(path: string): Promise<void> {
  path = convert_to_unix(path);
  ofs.mkdirs(path);
}
export async function moveAsync(src: string, dest: string, options?: ofs.MoveOptions): Promise<void> {
  src = convert_to_unix(src);
  if (!(await ofs.pathExists(src))){
    throw make_fs_error(`src ${src} does not exist, cannot move`, 'ENOENT');
  }
  dest = convert_to_unix(dest);
  ofs.move(src,dest,options);
}
export async function openAsync(path: string, flags: string | number,  mode?: number): Promise<number> {
  path = convert_to_unix(path)
  if (!(await ofs.pathExists(path))) {
    throw make_fs_error(`path ${path} does not exist cannot open`, 'ENOENT');
  }
  return ofs.open(path, flags,mode);
}
export async function openSync(path: string, flags: string | number, mode?: number): number {
  path = convert_to_unix(path)
  if (!(await ofs.pathExists(path))) {
    throw make_fs_error(`path ${path} does not exist cannot open`, 'ENOENT');
  }
  return ofs.openSync(path, flags,mode);
}
export function readdirSync(path: string): Promise<string[]> {
  path = convert_to_unix(path);
  if (ofs.existsSync(path)) {
    throw make_fs_error(`dir ${path} does not exist, cannot read`, 'ENOENT');
  }
  return ofs.readdirSync(path);
}
export function readFileSync(path: string): Promise<string> {
  path = convert_to_unix(path);
  if (ofs.existsSync(path)) {
    throw make_fs_error(`file ${path} does not exist, cannot read`, 'ENOENT');
  }
  return ofs.readFileSync(path);
}
