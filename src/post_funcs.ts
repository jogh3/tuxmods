import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';
import * as get_funcs from './get_funcs.js';
import * as cg_mangr from './config_manager.ts';

export const postroutes: Record<string,any> = {
  'change_mod_active': change_mod_active,
  'write_game_loc': cg_mangr.write_game_locs
};

export function change_mod_active() {
  console.log("did thing");
  return;
}
export function dothingtoo() {
  console.log("did thing too electric boogaloo");
  return;
}
