import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import * as index from './index.js';
import * as get_funcs from './get_funcs.js';

export const postroutes: Record<string,any> = {
  'change_mod_active': change_mod_active,
  'dothingtoo': dothingtoo
};

export function change_mod_active() {
  console.log("did thing");
  return;
}
export function dothingtoo() {
  console.log("did thing too electric boogaloo");
  return;
}
