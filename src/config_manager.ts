import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';

interface game_config_form{
  game_loc: string;
  proton_loc: string;
  staging_loc: string;
  active_profile: string;
};

export interface config_format {
  global_data: Record<string,any>;
  games: Record<string,game_config_form>;

};

// checks if the config exists and makes one with base values if it doesn't
export function init_config() {
  if (fs.existsSync(index.config_file)){
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
  return;
}

// gets the entire config file
// inside config_manager.ts
export function get_config(): config_format {
  init_config();
  // read synchronously so the program waits for the data
  let raw_data: Buffer = fs.readFileSync(index.config_file);
  
  // parse the text, then cast it
  let parsed_config = JSON.parse(raw_data.toString()) as config_format;
  return parsed_config;
}

export function make_def_profile(){
  return;
}

export function add_game(game_info: any) {
  // gotta create staging dir as well as well as a new default profile
  return;
}
