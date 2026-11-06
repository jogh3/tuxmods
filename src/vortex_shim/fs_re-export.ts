import * as ofs from 'fs-extra';
import * as path from 'path';

import {convert_to_unix, make_fs_error} from './shim_fs.js';

export import Stats = ofs.Stats;
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
export function openSync(path: string, flags: string | number, mode?: number): number | null {
  path = convert_to_unix(path)
  if (!ofs.existsSync(path)) {
    console.error(`path ${path} does not exist cannot open`);
    return null;
  }
  return ofs.openSync(path, flags,mode);
}
export function readdirSync(path: string): string[] | null {
  path = convert_to_unix(path);
  if (ofs.existsSync(path)) {
    console.error(`dir ${path} does not exist, cannot read`);
    return null;
  }
  return ofs.readdirSync(path);
}
export function readFileSync(path: string): Buffer | string | null {
  path = convert_to_unix(path);
  if (ofs.existsSync(path)) {
    console.error(`file ${path} does not exist, cannot read`);
    return null;
  }
  return ofs.readFileSync(path);
}
export function closeSync(fd: number): void {
  return ofs.closeSync(fd);
}

export async function removeAsync(dir_path: string, options?: any): Promise<void> {
  dir_path = convert_to_unix(dir_path);
  return ofs.remove(dir_path, options);
}

export function removeSync(dir_path: string): void {
  dir_path = convert_to_unix(dir_path);
  return ofs.removeSync(dir_path);
}

export async function renameAsync(old_path: string, new_path: string): Promise<void> {
  old_path = convert_to_unix(old_path);
  new_path = convert_to_unix(new_path);
  return ofs.promises.rename(old_path, new_path);
}

export async function rmdirAsync(dir_path: string): Promise<void> {
  dir_path = convert_to_unix(dir_path);
  return ofs.promises.rmdir(dir_path);
}

export function rmdirSync(dir_path: string): void {
  dir_path = convert_to_unix(dir_path);
  if (!ofs.existsSync(dir_path)) {
    throw make_fs_error(`directory ${dir_path} doesn't exist, cannot remove`, 'ENOENT');
  }
  return ofs.rmdirSync(dir_path);
}

// Kept for compatibility if an extension passes a callback, though statAsync is preferred
export function stat(path: string, callback: (err: NodeJS.ErrnoException | null, stats: ofs.Stats) => void): void {
  path = convert_to_unix(path);
  return ofs.stat(path, callback);
}

export async function statAsync(target_path: string): Promise<ofs.Stats> {
  target_path = convert_to_unix(target_path);
  return ofs.promises.stat(target_path);
}

export function statSync(target_path: string): ofs.Stats {
  target_path = convert_to_unix(target_path);
  if (!ofs.existsSync(target_path)) {
    throw make_fs_error(`path ${target_path} doesn't exist, cannot stat`, 'ENOENT');
  }
  return ofs.statSync(target_path);
}

export async function unlinkAsync(file_path: string): Promise<void> {
  file_path = convert_to_unix(file_path);
  return ofs.promises.unlink(file_path);
}

export function unlinkSync(file_path: string): void {
  file_path = convert_to_unix(file_path);
  if (!ofs.existsSync(file_path)) {
    throw make_fs_error(`file ${file_path} doesn't exist, cannot unlink`, 'ENOENT');
  }
  return ofs.unlinkSync(file_path);
}

export async function utimesAsync(target_path: string, atime: number | string | Date, mtime: number | string | Date): Promise<void> {
  target_path = convert_to_unix(target_path);
  return ofs.promises.utimes(target_path, atime, mtime);
}

export function watch(filename: string, options?: any, listener?: any): ofs.FSWatcher {
  filename = convert_to_unix(filename);
  if (!ofs.existsSync(filename)) {
    throw make_fs_error(`path ${filename} doesn't exist, cannot watch`, 'ENOENT');
  }
  return ofs.watch(filename, options, listener);
}
