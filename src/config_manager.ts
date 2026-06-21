import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';

// checks if the config exists and makes one with base values if it doesn't
export function init_config(config_dir_path: string) {
  config_loc: string = path.join(config_dir_path,"config.json");
  if (fs.existsSync(config_loc)){
    return;
  }
  fs.writeFileSync(config_dir_path, {recursive: true});
  base_data: string = '{"global_data": {}, games:{}}';
  fs.writeFileSync(config_loc,base_data, { encoding: "utf8", flag: "wx" });
  return;
}

// writes info to config file
export function write_game_locs(config_dir_path:string, game: string, file_datas: Record<string,string>) {
  init_config();
  return {};
}
