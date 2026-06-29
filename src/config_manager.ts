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
export function get_config(): config_format {
  init_config();
  // read synchronously so the program waits for the data
  let raw_data: Buffer = fs.readFileSync(index.config_file);
  
  // parse the text, then cast it
  let parsed_config = JSON.parse(raw_data.toString()) as config_format;
  return parsed_config;
}

// makes a new profile
export function make_new_profile(){
  return;
}

// change it, like load order, or added game, etc.
export function update_profile(){
  return;
}

// makes the default profile when adding a new game
export function make_def_profile(){
  return;
}

// saves the profile sync from the api, to the file
function write_profile_sync(requrl: string, profile_info: profile_format) {

}

// adds a game to the config file
export function add_game(game_info: any) {
  // gotta create staging dir as well as well as a new default profile
  return;
}
