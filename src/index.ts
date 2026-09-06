#! /usr/bin/env node 
import { registerHooks } from 'node:module';
import * as http from 'http';
import * as fs from 'fs';
import { stat, unlink } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as os from 'os';
import * as util from 'util';

import * as api from './api.js';
import * as vdf from './vdf_parser.js'


export let show_color: string | null | undefined = process.env.NO_COLOR || null;
const debug_mode: string | null | undefined = process.env.debug_mode || null;

const all_colors: string[] = ["\x1b[38;5;214m", "\x1b[38;5;45m", "\x1b[2m", "\x1b[38;5;46m",
                            "\x1b[38;5;165m", "\x1b[38;5;93m", "\x1b[38;5;160m", "\x1b[38;5;123m", "\x1b[0m"];

// default color variables
export let vortex_log_color: string = all_colors[0]!;
let request_color: string = all_colors[1]!;
let dim: string = all_colors[2]!;
let GET_color: string = all_colors[3]!;
let POST_color: string = all_colors[4]!;
let starting_color: string = all_colors[5]!;
export let error_color: string = all_colors[6]!;
export let debug_color: string = all_colors[7]!;
export const RST: string = all_colors[0]!;
// if NO_COLOR is set to anything, get rid of all color
if ( show_color != null && show_color[0] != '\0') {
  starting_color="";
  vortex_log_color="";
  request_color="";
  dim="";
  GET_color="";
  POST_color="";
  error_color="";
  debug_color="";
}

const og_log = console.log;
const og_error = console.error;

debug_log(vdf.get_sgame_info());

export const __filename: string = fileURLToPath(import.meta.url); //setting the filename as different import method
export const __dirname: string = path.dirname(__filename); // setting the filename as different import method

const fakeVortexPath = pathToFileURL(path.join(__dirname, './vortex_api_shim.js')).href;
const fakeWinApiPath = pathToFileURL(path.join(__dirname, './win_api_shim.js')).href;

// 2. Register hooks directly in-line (Synchronously)
registerHooks({
  resolve(specifier, context, nextResolve) {
    // Dynamically catch third-party scripts calling vortex-api
    if (specifier === 'vortex-api') {
      return { shortCircuit: true, url: fakeVortexPath };
    }

    // Dynamically catch third-party scripts calling winapi-bindings
    if (specifier === 'winapi-bindings') {
      return { shortCircuit: true, url: fakeWinApiPath };
    }

    // Let all other normal imports and node core modules resolve normally
    return nextResolve(specifier, context);
  }
});


// port and host
// TODO: allow to change with arguments
const port: number = 6942; 
const host: string = 'localhost';
// max allowed log size in bytes(2GiB by default, allow change with argument)
const max_log_size: number = 2147483648;

export const config_dir: string = path.join(os.homedir(), '.config', 'tuxmods');
export const config_file: string = path.join(config_dir, 'config.json');
const public_dir: string = path.join(__dirname, '..', 'public'); // path to the frontend of the daemon

// record for what to display for each file type that could be served
export const file_types: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.bin': 'application/octet-stream',
  '.txt': 'text/plain'
};

const log_file_loc = path.join(config_dir, "tuxmods.log")

if (!fs.existsSync(log_file_loc)) fs.writeFileSync(log_file_loc,"",{});

async function check_log_size() {
  const file_info = await stat(log_file_loc);
  const total_bytes = file_info.size;

  if (total_bytes > max_log_size) {
    await unlink(log_file_loc);
  }
}

await check_log_size();

function get_custom_date(oDate: Date) {
    let sDate: string = "";
    if (oDate instanceof Date) {
        sDate = oDate.getFullYear() + 1900
            + ':'
            + ((oDate.getMonth() + 1 < 10) ? '0' + (oDate.getMonth() + 1) : oDate.getMonth() + 1)
            + ':' + oDate.getDate()
            + ':' + oDate.getHours()
            + ':' + ((oDate.getMinutes() < 10) ? '0' + (oDate.getMinutes()) : oDate.getMinutes())
            + ':' + ((oDate.getSeconds() < 10) ? '0' + (oDate.getSeconds()) : oDate.getSeconds());
    } else {
        throw new Error("oDate is not an instance of Date");
    }
    return sDate;
}

function strip_color(log: string): string {
  for (let i = 0; i < all_colors.length; i++) {
    log = log.replace(all_colors[i]!,"");
  }
  return log;
}

console.log = function(...args) {
  let full_msg: string = util.format(...args);
  og_log(full_msg);
  let curr_date = new Date();
  let log_date = curr_date;
  let stripped_msg: string = strip_color(full_msg);
  let full_output = `${log_date}: ${stripped_msg}\n`;
  fs.writeFileSync(log_file_loc, full_output,{ encoding: "utf8", flag: "a+"});
  return;
}

console.error = function(...args) {
  let full_output: string = util.format(...args);
  og_error(error_color, full_output, RST);
  let log_date = new Date();
  full_output = `${log_date}: [ERROR] ${full_output}\n`;
  fs.writeFileSync(log_file_loc, full_output, {encoding: "utf8", flag: "a+"});
  return;
}

export function debug_log(...args: any) {
  const message: string = util.format(...args);
  if (debug_mode != null && debug_mode[0] != '\0'){
    console.log(debug_color, message, RST);
  }
  return;
}

// this is to check for directory traversal in the requested url for safety purposes
export function is_directory_traversal(requested_path : string, acceptable: string) : boolean{
  const absolute_path: string = path.resolve(requested_path);
  const safe_zone: string = path.resolve(acceptable);

  if (!absolute_path.startsWith(safe_zone)) {
    return true;
  }
  return false;
}

// separated static file and spa fallback logic
function serve_static(req: http.IncomingMessage, res: http.ServerResponse, safe_url: string) {
  const requested_path: string = path.join(public_dir, safe_url === '/' ? '/index.html' : safe_url);
  // check for directory traversal
  if (is_directory_traversal(requested_path, public_dir)) {
    res.writeHead(403);
    return res.end("nice try, but you don't fuckle with shuckle");
  }

  const ext: string = path.extname(requested_path);
  const content_type: string = file_types[ext] || "text/plain";

  // spa fallback for frontend routes
  if (ext === '') {
    console.log(request_color,"serving index.html", RST)
    const index_path: string = path.join(public_dir, 'index.html');
    fs.readFile(index_path, (err: any, data: Buffer) => {
      if (err) {
        res.writeHead(500);
        return res.end('error loading index');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(data);
    });
    return;
  }
  // standard static file serving
  const file_stream = fs.createReadStream(requested_path);
  console.log(request_color,'serving ', requested_path, RST);
  file_stream.on('open', () => {
    res.writeHead(200, {'Content-Type': content_type});
    file_stream.pipe(res);
  });
  file_stream.on('error',(err: any) => {
    if (err.code === 'ENOENT'){
      res.writeHead(404);
      res.end("file not found");
    } else {
      res.writeHead(500);
      res.end('server error');
    }
  })
}

// main traffic cop
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const safe_url: string = req.url || '/';
  const method: string = req.method || 'GET';

  // 1. intercept api calls first
  if (safe_url.startsWith('/api/')) {
    const command: string = safe_url.split('?')[0]!.split('/').pop() || '';
    
    if (method === 'GET') {
      console.log(GET_color, 'GET request',safe_url, RST);
      const handler: any = api.getroutes[command];
      if (handler) {
        return handler(req, res);
      } else {
          res.writeHead(404);
          return res.end('api endpoint not found');
      }
    } else if (method === 'POST') {
      console.log(POST_color, 'POST request', safe_url, RST);
      const handler: any = api.postroutes[command]; 
      if (handler){ 
        return handler(req, res); 
      } else {
          res.writeHead(404);
          return res.end('api endpoint not found');
      }
    }

    res.writeHead(404);
    return res.end('api endpoint not found');
  }

  // 2. if not an api call, handle the frontend requests
  if (method === 'GET') {
    serve_static(req, res, safe_url);
  } else {
    res.writeHead(405); 
    res.end('method not allowed');
  }
});

//opening the actual server
server.listen(port, host, () => {
  console.log(
`${starting_color}starting tuxmods
[ .  . ]
   \\\/
/  > _ \\
dirname = ${__dirname}
server running at http://${host}:${port}/
${RST}`);
});
