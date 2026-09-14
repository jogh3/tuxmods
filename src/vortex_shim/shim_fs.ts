import * as ofs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

import * as index from '../index.js'
import * as config from '../config_manager.js';

export import Stats = ofs.Stats;

// insurance in case a script has any hardcoded paths, unlikely but still a good insurance
function convert_to_unix(inp_path: string): string {
  if (!inp_path) return "";

  // convert the path from windows(\) to unix(/) just in case some paths are hardcoded for some reason;
  let proper_path: string = inp_path;
  proper_path = proper_path.replace(/\\/g, path.sep);

  //TODO: add functionality to determine if it is the game folder, instead of a proton system, i guess, maybe not necessary

  const windows_drive = /^[a-zA-Z]:[\\/]/;
  if (windows_drive.test(inp_path)) {

    let config_game: string = config.return_game();

    let config_data: config.config_format = config.get_config();

    let proton_loc: string = config_data.games[config_game]!.proton_loc;

    if (!ofs.existsSync(proton_loc) || proton_loc == "") proton_loc = path.join(os.homedir(),".wine");

    let c_path: string = path.join(proton_loc, "drive_c");
    let without_c: string = inp_path.slice(4,-1);

    proper_path = path.join(c_path,without_c);
  }
  return path.normalize(proper_path);
}

export async function readFileAsync(f: string, options?: any): Promise<string>{
  f = convert_to_unix(f);
  return ofs.promises.readFile(f, { encoding: 'utf8', ...options }) as unknown as Promise<string>;
}

export async function writeFileAsync(file: string,data: any, options?: ofs.WriteFileOptions): Promise<void> {
  file = convert_to_unix(file);
  return ofs.promises.writeFile(file, data, options);
}

export async function readdirAsync(dir: string): Promise<string[]>{
  dir = convert_to_unix(dir);
  return ofs.promises.readdir(dir);
}

export async function ensureDirAsync(dir_path: string, on_dir_created_cb?: (created: string) => PromiseLike<void>): Promise<void> {
  dir_path = convert_to_unix(dir_path);
  if (on_dir_created_cb) {
    // create parent directories manually and execute on_dir_created_cb
    let current_made: string = dir_path.startsWith(path.sep) ? path.sep : "";
    let split_dir: string[] = dir_path.split(path.sep);

    for (let i = 0; i < split_dir.length; i++){
      if (!split_dir[i]) continue;
      current_made = path.join(current_made,split_dir[i]!);
      try {
        await ofs.promises.access(current_made);
      } catch (err) {
        // The folder doesn't exist, so we create it asynchronously
        await ofs.promises.mkdir(current_made);
        // Wait for the callback to fully finish its own promise before moving to the next folder
        await on_dir_created_cb(current_made);
      }
    }
  } else {
    // just use the function built into node
    await ofs.ensureDir(dir_path);
  }
}

export async function ensureFileAsync(file_path: string): Promise<void> {
  file_path = convert_to_unix(file_path);
  return Promise.resolve(ofs.ensureFile(file_path));
}

export async function ensureDirWritableAsync(dir_path: string, confirm?: () => PromiseLike<void>): Promise<void> {
  dir_path = convert_to_unix(dir_path);
  try {
    // W_OK is the flag for write permission
    await ofs.promises.access(dir_path, ofs.constants.W_OK);
    if (confirm) await confirm();
  } catch (err) {
    console.error(`[Vortex Shim] ensureDirWritableAsync failed for ${dir_path}`);
    throw err;
  }
}

export async function lstatAsync(target_path: string): Promise<Stats> {
  target_path = convert_to_unix(target_path);
  return ofs.promises.lstat(target_path);
}
