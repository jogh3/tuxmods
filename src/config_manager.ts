import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

import * as index from './index.js';
import * as api from './api.js'

interface game_config_form{
  game_loc: string;
  proton_loc: string;
  staging_loc: string;
  active_profile: string;
};

interface global_data_format {
  current_game: string;
}

export interface config_format {
  global_data: global_data_format;
  games: Record<string,game_config_form>;
};

// checks if the config exists and makes one with base values if it doesn't
export function init_config() {
  if (fs.existsSync(index.config_file)){
    return;
  }
  fs.mkdirSync(index.config_dir, {recursive: true});
  let base_data: string = '{"global_data": { "current_game": ""}, games:{}}';
  fs.writeFileSync(index.config_file,base_data, { encoding: "utf8", flag: "wx" });
  return;
}

// writes game info to config file, like game location, proton/wine location, etc.
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

// enables the mod by editing the master list
function enable_mod(master_list: api.master_format, mod: string): api.master_format {
  let updated_master_list: api.master_format = {...master_list};
  let last_load_order = 0;
  // loop to get the highest load order from the master list to append
  Object.keys(master_list).forEach((key) => {
    if (master_list[key]!.load_index > last_load_order){
      last_load_order = master_list[key]!.load_index;
    }
  })
  updated_master_list[mod] = {load_index: last_load_order+1, install_location: ""};
  return updated_master_list;
}

function disable_mod(master_list: api.master_format, mod: string): api.master_format {
  let updated_master_list: api.master_format = {...master_list};
  // load index of the last removed mod
  let old_index = master_list[mod]!.load_index;
  delete updated_master_list[mod];
  // loops through and decrements the load index of each item that was disabled to get rid of gaps
  Object.keys(updated_master_list).forEach((key) => {
    if (updated_master_list[key]!.load_index > old_index){
      updated_master_list[key]!.load_index -= 1;
    }
  })
  return updated_master_list;
}
// changes the load order in the master, but i want it to be live so like when you change it in frontend, immediately changes it in file without pressing a confirm button, but idk how to do that for now
function change_load_order(master_list: api.master_format): api.master_format {
  let updated_master_list: api.master_format = {...master_list};
  return updated_master_list;
}

function reinstall_mod(master_list: api.master_format, mod: string): api.master_format{
  // reinstall the mod using install_location in the master_list, then enable it
  return {};
}

// change the master, like load order, or changing a game enable, etc.
export function update_master(req: http.IncomingMessage, res: http.ServerResponse){
  const requrl: string = req.url || '';
  if (!requrl){
    res.writeHead(404);
    return res.end("false");
  }
  const params = api.parse_parameters(requrl);
  let action: string = params["action"] || '';
  let game = params["game"] || '';
  if (!game || !action){
    console.error("invalid game or action");
    res.writeHead(404);
    return res.end("false");
  }
  let mod = '';
  let mod_reqd: boolean = false
  // param format will be different for enable/disable & reinstall compared to change load order
  if (action == "enable_mod" || "disable_mod" || "reinstall"){
    mod = params["mod"] || '';
    mod_reqd = true
  }
  if (!mod && mod_reqd) {
    console.error("invalid mod");
    res.writeHead(404);
    return res.end("false");
  }
  let master_list: api.master_format = api.get_master_list(game);
  if (action == "enable_mod"){
    master_list = enable_mod(master_list, mod);
  } else if (action == "disable_mod") {
    master_list = disable_mod(master_list, mod);
  } else if (action == "change_load_order"){
    master_list = change_load_order(master_list);
  } else if (action == "reinstall") {
    master_list = reinstall_mod(master_list, mod);
  }
  const full_master_path: string = path.join(index.config_dir,game,"master_list.json");
  const raw_master = JSON.stringify(master_list)
  fs.writeFileSync(full_master_path, raw_master, { encoding: "utf8", flag: "w" })
  res.writeHead(200);
  return res.end("true");
}

// writes the mods from master_file to the selected profile
export function save_to_profile(){
  // const profile_array = Object.keys(master_data).sort((a, b) => {
  //   return master_data[a].load_index - master_data[b].load_index;
  // });
  return;
}

// loads the selected profile to the master list
export function load_profile(){
  return;
}

// saves the profile sync from the api, to the file
function write_profile_sync(requrl: string, profile_info: api.master_format) {

}

// adds a game to the config file+makes the directory
export function add_game(game_info: any) {
  // gotta create staging dir as well as well as a new default profile
  return;
}
// changes the currently modding game in the config file
export function change_current_game(req: http.IncomingMessage, res: http.ServerResponse) {
  let req_url: string = req.url || '';
  const params = api.parse_parameters(req_url);
  const new_game = params["new_game"]
  if (!new_game) {
    console.error("no new game specified");
    res.writeHead(404);
    return res.end("false");
  }
  let config_file: config_format = get_config();
  config_file.global_data.current_game = new_game;
  const raw_config = JSON.stringify(config_file);
  fs.writeFileSync(index.config_file, raw_config, { encoding: "utf8", flag: "w" });
  res.writeHead(200);
  return res.end("true");
}

// gets the game currently being modded from the config file
export function return_game(): string {
  const config_file: config_format = get_config();
  return config_file.global_data.current_game;
}

// for when the website requests the game
export function get_current_game(req: http.IncomingMessage, res: http.ServerResponse) {
  const game: string = return_game();
  if (!game) {
    console.error("current game empty in config");
    res.writeHead(204);
    return res.end("current game empty in config");
  }
  res.writeHead(200, { 'Content-Type': index.file_types[".txt"] });
  res.end(game);
}
