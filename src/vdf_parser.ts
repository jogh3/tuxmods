import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import * as mindex from './index.js';

interface depot_ids {
  manifest: string;
  size: string;
  dlcappid?: string;
}

interface uconf {
  language?: string;
  BetaKey?: string;
  DisabledDLC?: string;
}

interface mconf {
  language?: string;
  BetaKey?: string;
  DisabledDLC?: string;
}

interface appstate {
  appid: string;
  universe: string;
  name: string;
  StateFlags: string;
  installdir: string;
  LastUpdated: string;
  LastPlayed: string;
  SizeOnDisk: string;
  StagingSize: string;
  buildid: string;
  LastOwner: string;
  DownloadType: string;
  UpdateResult: string;
  BytesToDownload: string;
  BytesDownloaded: string;
  BytesToStage: string;
  BytesStaged: string;
  TargetBuildID: string;
  AutoUpdateBehavior: string;
  AllowOtherDownloadsWhileRunning: string;
  ScheduledAutoUpdate: string;
  InstalledDepots: Record<string, depot_ids>;
  SharedDepots?: Record<string, string>;
  InstallScripts?: Record<string, string>;
  UserConfig: uconf;
  MountedConfig: mconf;
}

export type acf = Record<string, appstate>;


type apps_rec = Record<string,string>;

interface index {
  path: string;
  label: string;
  contentid: string;
  totalsize: string;
  update_clean_bytes_tally: string;
  time_last_update_verified: string;
  apps: apps_rec;
}

export type vdf = Record<string,Record<string,index>>;

function steam_to_json<T = vdf>(raw_data: string): T {
  // remove comments from vdf or acf
  // \s is all whitespace
  // g means global, m Forces the ^ and $ to match the start and end of individual lines rather
  //                                         than the start and end of the entire block of text
  raw_data = raw_data.replace(/^\s*\/\/.*$/gm,'');
  // the regex to get all possible important items e.g anything in quotes or { or }
  // () capture group
  // (?: ... ) non capturing group, it groups the internal logic together without saving the result to memory
  const token_regex = /"((?:\\"|[^"])*)"|\{|\}/g;
  // state machine to build the file in correct format casts at end
  const root: Record<string, any> = {};
  // stack to keep track of where we are
  const stack: Record<string, any>[] = [root];
  // current item we are on
  let currentkey: string | null = null;
  // whether the next line matches the regex
  let match: RegExpExecArray | null;

  while ((match = token_regex.exec(raw_data)) !== null) {
    // full match of 
    const token = match[0];

    if ( token === '{') {
      // if the item is a "Record"
      // create new object
      const newobj: Record<string,any> = {};
      // get the object currently inside
      const currentobject = stack[stack.length - 1];
      // attach the new object to current object using the key
      currentobject![currentkey!] = newobj;
      // go into the new object adding it to the stack
      stack.push(newobj);
      // reset the key as inside a new object
      currentkey = null;
    } else if ( token === '}') {
        // if } then done with the object and can stop writing to it
        stack.pop();
    } else {
        // its a quoted string match 1 is the inner text without quots
        const text = match[1]!.replace(/\\"/g, '"');
        if ( currentkey === null ) {
          // if we don't have a key this becomes the key
          currentkey = text;
        } else {
          // we have a key so the next is the value for that key
          // stack.length is the index of the array, currentkey is the key of the Record
          stack[stack.length - 1]![currentkey]! = text;
          // done with key so reset
          currentkey = null;
      }
    }
  }
  // cast to T
  return root as T;
}

export function openvdf(): vdf {
  const vdf_path: string = path.join(os.homedir(), ".steam","steam","steamapps","libraryfolders.vdf");
  let raw_vdf: string = fs.readFileSync(vdf_path).toString();
  let json: vdf = steam_to_json(raw_vdf);
  return json;
}

function openacf(acf_path:string): acf {
  let raw_acf: string = fs.readFileSync(acf_path).toString();
  let json: acf = steam_to_json<acf>(raw_acf);
  return json;
}

interface sgame_info {
  name: string;
  appid: string;
  library_loc: string;
  install_dir: string; // name of where game is installed in steamapps/common
}

export function get_sgame_info(): sgame_info[] {
  const vdf_file: vdf = openvdf();

  mindex.debug_log(vdf_file);

  const inner_vdf = vdf_file["libraryfolders"]!;

  let all_acf_file_locs: string[] = [];

  Object.keys(inner_vdf).forEach(key => {

    let lib_loc: string = inner_vdf[key]!.path;
    lib_loc = path.join(lib_loc, "steamapps");
    if (!fs.existsSync(lib_loc)) return;

    mindex.debug_log(lib_loc);

    const all_files: string[] | NonSharedBuffer[] = fs.readdirSync(lib_loc, {recursive: false});
    const acf_files: string[] = all_files
      .filter(file => /\.acf$/.test(file as string))
      .map(file => path.join(lib_loc, file as string));

    mindex.debug_log(acf_files);

    all_acf_file_locs = all_acf_file_locs.concat(acf_files);
  });

  let all_sgame_info: sgame_info[] = [];

  all_acf_file_locs.forEach(acf_loc => {
    const acf_file: acf = openacf(acf_loc);
    const acf_info: appstate = acf_file!["AppState"]!;

    let new_sgame: sgame_info = {name: acf_info.name,appid: acf_info.appid,library_loc: path.dirname(acf_loc),install_dir: acf_info.installdir};

    mindex.debug_log(new_sgame);
    all_sgame_info.push(new_sgame);
  });
  return all_sgame_info;
}

