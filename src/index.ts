#! /usr/bin/env node 
import { registerHooks } from 'node:module';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as os from 'os';

import * as api from './api.js';

export let show_color: string | null | undefined = process.env.NO_COLOR || null;

// default color variables
export let vortex_log_color: string = "\x1b[38;5;214m";
let request_color: string = "\x1b[38;5;45m";
let dim: string = "\x1b[2m";
let GET_color: string = "\x1b[38;5;46m";
let POST_color: string = "\x1b[38;5;165m";
let starting_color: string = "\x1b[38;5;93m";
export let error_color: string = "\x1b[38;5;160m";
export let debug_color: string = "\x1b[38;5;123m";
export const RST: string = "\x1b[0m";
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
// TODO: allow to change with arguments later
const port: number = 6942; 
const host: string = 'localhost';

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
  '.bin': 'application/octet-stream'
};

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
server running at http://${host}:${port}/${RST}`);
});
