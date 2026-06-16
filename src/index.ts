#! /usr/bin/env node
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as os from 'os'

import * as get_funcs from './get_funcs.js';
import * as post_funcs from './post_funcs.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

var port: number = 6942;
var host: string = 'localhost';

function errorhandle(err: any): string {
  return "";
}

const config_dir = path.join(os.homedir(), '.config', 'tuxmods');

const filetypes: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json', // note: json is usually application/json
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const safe_url: string = req.url || '/'; 
  const publicdir: string = path.join(__dirname,'..', 'public');
  const requestedfilepath: string = path.join(publicdir, safe_url === '/' ? '/index.html' : safe_url);
  const absolutepath: string = path.resolve(requestedfilepath);
  const safesecurityzone: string = path.resolve(publicdir);
  if (!absolutepath.startsWith(safesecurityzone)) {
    res.writeHead(403); // 403 means forbidden
    return res.end("nice try, but you don't fuckle with shuckle");
  }
  const filetype: string = path.extname(requestedfilepath);
  const conttype: string = filetypes[filetype] || "text/plain";
  const method: string = req.method || 'GET';
  if (method === 'GET'){
    if (safe_url.startsWith('/api/')) {
      const command: string = safe_url.split('?')[0]!.split('/').pop() || '';
      const handler: any = get_funcs.getroutes[command];
      
      if (handler) {
        // you will want to pass req and res to your handler so it can send data back
        handler(req, res); 
      } else {
        res.writeHead(404);
        res.end('api endpoint not found');
      }
      return; // exit early so we don't accidentally serve files below
    }
    if (filetype == ''){
      const index_path: string = path.join(publicdir, 'index.html');
      fs.readFile(index_path, (err: any, index_data: Buffer) => {
        if (err) {
          res.writeHead(500);
          return res.end('error loading index');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        return res.end(index_data);
      })
    } else {
    fs.readFile(requestedfilepath, (err: any, filedata: Buffer) => {
      if (err) {
        res.writeHead(500);
        return res.end('error loading page');
      }
      res.writeHead(200, {'Content-Type': conttype});
      res.end(filedata);
    });
  }}
  if(method === 'POST'){
    const handler: any = post_funcs.postroutes[safe_url];
    if (handler){
      handler();
    } else {
      console.log('invalid post req');
    }
    res.writeHead(204);
    res.end();
    return;
  }
});

server.listen(port, host, () => {
  console.log('starting tuxmods')
  console.log('[ .  . ]');
  console.log('   \\\/ ');
  console.log('/  > _ \\');
  console.log('dirname = ',__dirname);
  console.log(`server running at http://${host}:${port}/`);
});
