import * as index from './index.js'

export * as util from './vortex_shim/shim_util.js';
export * as fs from './vortex_shim/shim_fs.js';
export * as selectors from './vortex_shim/shim_selectors.js';
export * as actions from './vortex_shim/shim_actions.js';

export function log(level: string, message: string, metadata: any) {
  console.log(index.vortex_log_color,`[Vortex shim - ${level}] ${message} ${metadata}`, index.RST);
  return;
}

