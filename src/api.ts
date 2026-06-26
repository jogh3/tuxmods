import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';
import * as cg_mangr from './config_manager.ts';

export const getroutes: Record<string,any> = {
  'get_mod_list': get_mod_list
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
function get_mod_list(req: http.IncomingMessage, res: http.ServerResponse) {
  const requrl: string = req.url || '';
  if (!requrl) {
    res.writeHead(404);
    res.end("no url given");
  }
  let params : Record<string,string> = parse_parameters(requrl);
  if (!params) {
    res.writeHead(404);
    res.end("no parameters");
  }
  let game: string = params["game"] || "";
  if (!game) {
    res.writeHead(404);
    res.end("no game parameter");
  }
  if (!params["profile"]){
    res.writeHead(404);
    res.end("no profile parameter");
  }
  let filename: string = params["profile"]+'.json'; // temp part ----------------------------------
  const config_file_loc: string = path.join(index.config_dir,game,filename);

  fs.readFile(config_file_loc, (err: any, data: Buffer) => {
    if (err){
        console.log(err);
        res.writeHead(500);
        return res.end('error loading index');
    }
    res.writeHead(200, { 'Content-Type': index.file_types[".json"] });
    res.end(data);
  })
}

// reads the requested game's staging directory
export function get_staging_items(staging_dir: string): Record<string,boolean> {
  dir_items: Record<string,boolean> = {};
  allfiles = fs.readdirSync(staging_dir,{withFiletypes: true});
  allfiles.forEach(item => {
    if (item.isDirectory()){
      dir_items[item.name] = true;
    }
  });
  return dir_items;
}

function sync_profile(profile_info:any, disk_items: Record<string,boolean>): any {
  
}

// gets the entire config file
function get_config(config_file_loc: string) {
  
}
