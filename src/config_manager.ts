import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';

// checks if the config exists and makes one with base values if it doesn't
export function init_config() {
  if (fs.existsSync(config_loc)){
    return;
  }
  fs.mkdirSync(index.config_dir, {recursive: true});
  let base_data: string = '{"global_data": {}, games:{}}';
  fs.writeFileSync(index.config_file,base_data, { encoding: "utf8", flag: "wx" });
  return;
}

// writes info to config file
export function write_game_locs(game: string, file_datas: Record<string,string>) {
  init_config();
  return {};
}

// gets the entire config file
export function get_config(): any {
  init_config();
  fs.readFile(index.config_file, (err: any, data: Buffer) => {
    if (err){
        console.log(err);
        return {};
    }
    return data;
  })
}
export function add_game(game_info: any) {
  return;
}
