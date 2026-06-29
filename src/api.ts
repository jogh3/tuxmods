import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';
import * as cg_mangr from './config_manager.js';

interface mod_entry {
  enabled: boolean;
  load_index: number;
  exists: boolean;
}

export type profile_format = Record<string,mod_entry>;

// all get functions that can be requested
export const getroutes: Record<string,any> = {
  'get_mod_list': get_mod_list,
  'get_profile_info': get_profile_info
};
// all post functions that can be requested
export const postroutes: Record<string,any> = {
  'add_game':cg_mangr.add_game,
  "make_new_prof":cg_mangr.make_new_prof,
  "update_profile":cg_mangr.update_profile
};

// parses api request parameters, into each parameter, in name:value pair
export function parse_parameters (rawurl: string) : Record<string,string> {
  let querypart: string = rawurl.split('?')[1]!;
  if (!rawurl.includes('?')) return {};
  let params = new URLSearchParams(querypart);
  return Object.fromEntries(params.entries());
}

// gets the list of mods from the requested game and profile
function get_profile_list(requrl: string): profile_format {
  if (!requrl) {
    return {};
  }
  let params : Record<string,string> = parse_parameters(requrl);
  if (!params) {
    console.log("no valid params");
    return {}; 
  }
  let game: string = params["game"] || "";
  if (!game) {
    return {}; 
  }
  if (!params["profile"]){
    return {}; 
  }
  let filename: string = params["profile"]+'.json'; // gets the filename
  const profile_file_loc: string = path.join(index.config_dir,game,filename); // gets the final profile loc
  // simple check for directory traversal, since it is sorta a user input
  if (is_directory_traversal(profile_file_loc,index.config_dir)){ 
    return {};
  }
  // if there is no profile by req name, create a new one
  if (!fs.existsSync(profile_file_loc)){
    console.log("profile missing")
    cg_mangr.make_new_profile(); // make the profile if doesn't exist
    return {};
  }
  let raw_data: Buffer = fs.readFileSync(profile_file_loc, { flag: 'r'});
  if (file_str === "") {
    return {}; 
  }
  // 3. parse populated profile
  try {
    let parsed_profile = JSON.parse(file_str) as profile_format;
    return parsed_profile;
  } catch (e) {
    console.log("profile json is corrupted");
    return {};
  }
}

// this checks if the mods in a profile exist in the staging directory or not
function sync_profile(requrl: string, profile_info: profile_format): profile_format {
  let params: Record<string,string> = parse_parameters(requrl!);
  const config_file: any = cg_mangr.get_config();
  let game: string = params["game"]!;
  let staging_dir: string = config_file["games"][game]["staging_loc"];
  let staging_items: Record<string,boolean> = get_staging_items(staging_dir);
  let profile_json = JSON.parse(profile_info.toString());
  Object.keys(profile_json).forEach((key: string) => {
    if(!staging_items[key]){
      profile_json[key].exists = false;
    }
  })
  return profile_json;
}
// gets only the profile for load order shit, syncing it first
function get_profile_info(req: http.IncomingMessage, res: http.ServerResponse) {
  let data: profile_format = get_profile_list(req.url!);
  data = sync_profile(req.url!,data)
  res.writeHead(200,{'Content-Type': index.file_types[".json"]});
  return res.end(data);
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

// gets the mod list for displaying, merging it with the profile
export function get_mod_list(req: http.IncomingMessage, res: http.ServerResponse) {
    let requrl: string = req.url || '';
    if (!requrl){
      res.writeHead(404);
      return res.end("no requested url");
    }
    let profile_info: profile_format = get_profile_list(requrl);
    profile_info = sync_profile(req.url!,profile_info);
    let data: any = {};
    let params: Record<string,string> = parse_parameters(requrl);
    if (!params){
      res.writeHead(404);
      return res.end("no valid params")
    }
    // this section gets the staging folder
    const config_file: cg_mangr.config_format = cg_mangr.get_config();
    let game: string = params["game"]!;
    if (!game){
      res.writeHead(404);
      return res.end("no game entered");
    }
    let staging_dir: string = config_file["games"][game]!["staging_loc"];
    let staging_items: Record<string,boolean> = get_staging_items(staging_dir);
    const mpty = {"enabled": false, "load_index":-1,"exists": true};
    // merges the profile with the staging items for the mod list section
    Object.keys(staging_items).forEach((key) => {
      if (profile_info[key]){
        data[key] = profile_info[key];
      } else{
        data[key] = mpty;
      }
    })
    res.writeHead(200, { 'Content-Type': index.file_types[".json"] });
    return res.end(data);
}

