import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';
import * as cg_mangr from './config_manager.ts';

export const getroutes: Record<string,any> = {
  'get_mod_list': get_mod_list,
  'get_profile_info': get_profile_info
};
export const postroutes: Record<string,any> = {
  '':
};
// parses api request parameters, into each bit
export function parse_parameters (rawurl: string) : Record<string,string> {
  let querypart: string = rawurl.split('?')[1]!;
  if (!rawurl.includes('?')) return {};
  let params = new URLSearchParams(querypart);
  return Object.fromEntries(params.entries());
}

// gets the list of mods from the requested game and profile and whatever
function get_profile_list(req: http.IncomingMessage, res: http.ServerResponse): any {
  const requrl: string = req.url || '';
  if (!requrl) {
    return {};
  }
  let params : Record<string,string> = parse_parameters(requrl);
  if (!params) {
    return {};
  }
  let game: string = params["game"] || "";
  if (!game) {
    return {};
  }
  if (!params["profile"]){
    return {};
  }
  let filename: string = params["profile"]+'.json'; // temp part ----------------------------------
  const config_file_loc: string = path.join(index.config_dir,game,filename);

  fs.readFile(config_file_loc, (err: any, data: Buffer) => {
    if (err){
        console.log(err);
        return {};
    }
    return data;
  })
}

function get_profile_info(req: http.IncomingMessage, res: http.ServerResponse) {
  let data: Buffer = get_profile_list(req,res);
  res.writeHead(200,{'Content-Type': index.file_types[".json"]});
  res.end(data);
}

// reads the requested game's staging directory
export function get_staging_items(staging_dir: string): Record<string,boolean> {
  let dir_items: Record<string,boolean> = {};
  let allfiles = fs.readdirSync(staging_dir,{withFiletypes: true});
  allfiles.forEach(item => {
    if (item.isDirectory()){
      dir_items[item.name] = true;
    }
  });
  return dir_items;
}

export function get_mod_list(req: http.IncomingMessage, res: http.ServerResponse) {
    let profile_info: any = get_profile_list(req,res);
    let params: Record<string,string> = parse_parameters(req.url);
    const config_file: any = cg_mangr.get_config();
    let game: string = params["game"];
    let staging_dir: string = config_file["games"][game]["staging_loc"];
    let staging_items: Record<string,boolean> = get_staging_items(staging_dir);
    Object.keys(profile_info).forEach((key) => {
      if(!staging_items[key]){
        key.exists = false;
      }
    })
    let data: any = {};
    const mpty = {"enabled": false, "load_index=-1","exists": true};
    Object.key(staging_items).forEach((key) => {
      if (profile_info[key]){
        data[key] = profile_info[key];
      } else{
        data[key] = mpty;
      }
    })
    // run sync for whether a mod has been deleted from file system but is part of profile
    // join the mod list with the profile list requested
    res.writeHead(200, { 'Content-Type': index.file_types[".json"] });
    res.end(data);
}

