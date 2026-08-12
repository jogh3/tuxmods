import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';
import * as cg_mangr from './config_manager.js';

interface master_entry {
  load_index: number;
  exists: boolean;
}

interface mod_entry {
  enabled: boolean;
  load_index: number;
  exists: boolean;
}

export type master_format = Record<string,master_entry>;
export type mod_list_format = Record<string,mod_entry>;

// all get functions that can be requested
export const getroutes: Record<string,any> = {
  'get_mod_list': get_mod_list,
  'get_master_info': get_master_info
};
// all post functions that can be requested
export const postroutes: Record<string,any> = {
  'add_game':cg_mangr.add_game,
  "make_new_prof":cg_mangr.make_new_profile,
  "update_master":cg_mangr.update_master
};

// parses api request parameters, into each parameter, in name:value pair
export function parse_parameters (rawurl: string) : Record<string,string> {
  let querypart: string = rawurl.split('?')[1]!;
  if (!rawurl.includes('?')) return {};
  let params = new URLSearchParams(querypart);
  return Object.fromEntries(params.entries());
}

function init_master_list(game_config_dir: string) {
  const master_file_loc: string = path.join(game_config_dir,"master_list.json");
  if (fs.existsSync(master_file_loc)){
    return;
  }
  fs.mkdirSync(game_config_dir, {recursive: true});
  let base_data: string = '{}';
  fs.writeFileSync(master_file_loc,base_data, { encoding: "utf8", flag: "wx" });
  return;
}

// gets the list of mods from the requested game's master_list
export function get_master_list(game: string): master_format {
  if (!game) {
    return {}; 
  }
  let filename: string = 'master_list.json'; // gets the filename
  const game_config_dir: string = path.join(index.config_dir,game); // gets the game config dir
  init_master_list(game_config_dir);
  const master_file_loc: string = path.join(game_config_dir,filename)
  // simple check for directory traversal, since it is sorta a user input
  if (index.is_directory_traversal(master_file_loc,index.config_dir)){ 
    return {};
  }
  // if there is no master by req name, create a new one
  if (!fs.existsSync(master_file_loc)){
    console.error(index.error_color,"master missing",index.RST);
    return {};
  }
  let raw_data: Buffer = fs.readFileSync(master_file_loc, { flag: 'r'});
  let file_str: string = raw_data.toString().trim();
  if (file_str === "") {
    return {}; 
  }
  // 3. parse populated master 
  try {
    let parsed_profile = JSON.parse(file_str) as master_format;
    return parsed_profile;
  } catch (e) {
    console.error(index.error_color,"profile json is corrupted",index.RST);
    return {};
  }
}

// this checks if the mods in the master exist in the staging directory or not
function sync_master(requrl: string, profile_json: master_format): master_format {
  let params: Record<string,string> = parse_parameters(requrl!);
  const config_file: cg_mangr.config_format = cg_mangr.get_config();
  let game: string = params["game"]!;
  if (!game || !config_file.games[game]){
    console.error(index.error_color,"error: game not found in params or config",index.RST);
    console.error(index.debug_color,"game: ", game,index.RST);
    console.error(index.debug_color,"config_file.games[game]: ", config_file.games[game],index.RST);
    return profile_json;
  }
  let staging_dir: string = config_file.games[game]!.staging_loc;
  let staging_items: Record<string,boolean> = get_staging_items(staging_dir);
  Object.keys(profile_json).forEach((key: string) => {
    if(!staging_items[key] && profile_json[key]){
      profile_json[key].exists = false;
    }
  })
  return profile_json;
}

// gets only the profile for load order shit, syncing it first
function get_master_info(req: http.IncomingMessage, res: http.ServerResponse) {
  let requrl: string = req.url || '';
  if (!requrl) {
    res.writeHead(404);
    return res.end("no valid url");
  }
  let params: Record<string, string> = parse_parameters(requrl);
  const game: string = params["game"] || '';
  if (!game){
    res.writeHead(404);
    return res.end("game not included in url");
  }
  let data: master_format = get_master_list(game);
  data = sync_master(requrl,data)
  res.writeHead(200,{'Content-Type': index.file_types[".json"]});
  return res.end(JSON.stringify(data));
}

// reads the requested game's staging directory
export function get_staging_items(staging_dir: string): Record<string,boolean> {
  let dir_items: Record<string,boolean> = {};
  if (!fs.existsSync(staging_dir)){
    return dir_items;
  }
  let allfiles = fs.readdirSync(staging_dir,{withFileTypes: true});
  allfiles.forEach(item => {
    if (item.isDirectory()){
      dir_items[item.name] = true;
    }
  });
  return dir_items;
}

// gets the mod list for displaying, merging it with the master_list
export function get_mod_list(req: http.IncomingMessage, res: http.ServerResponse) {
    let requrl: string = req.url || '';
    if (!requrl){
      res.writeHead(404);
      return res.end("no requested url");
    }
    let params: Record<string,string> = parse_parameters(requrl);
    if (!params){
      res.writeHead(404);
      return res.end("no valid params")
    }
    const game: string = params["game"] || '';
    if (!game) {
      res.writeHead(404);
      return res.end("no game included")
    }
    let master_info: master_format = get_master_list(game);
    master_info = sync_master(requrl,master_info);
    // this section gets the staging folder
    const config_file: cg_mangr.config_format = cg_mangr.get_config();
    if (!game || !config_file.games[game]){
      console.error(index.error_color, "error: game not found in params or config", index.RST);
      console.error(index.debug_color, "game: ", game, index.RST);
      console.error(index.debug_color, "config_file.games[game]: ", config_file.games[game], index.RST);
      res.writeHead(404);
      return res.end("invalid or null game selection");
    }
    let staging_dir: string = config_file.games[game]!.staging_loc;
    let staging_items: Record<string,boolean> = get_staging_items(staging_dir);
    let data: mod_list_format = {};
    // default empty mod list values
    const mpty = {"enabled": false, "load_index":-1,"exists": true};
    // merges the master with the staging items for the mod list section
    Object.keys(staging_items).forEach((key) => {
      if (master_info[key]){
        data[key] = {
          enabled: true,
          load_index: master_info[key]!.load_index,
          exists: master_info[key]!.exists
        };
      } else{
        data[key] = mpty;
      }
    })
    // gets the items that were in the master, but not locally in the staging folder
    Object.keys(master_info).forEach((key) => {
      if (!data[key]) {
        data[key] = {
          exists: master_info[key]!.exists,
          load_index: master_info[key]!.load_index,
          enabled: true
        };
      }
    })
    res.writeHead(200, { 'Content-Type': index.file_types[".json"] });
    return res.end(JSON.stringify(data));
}

export function apply_profile(){
  return;
}
