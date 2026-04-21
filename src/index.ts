const http: any = require('http');
const fs: any = require('fs');
const path: any = require('path');

var port: number = 6942;
var url: string = 'localhost';

function errorhandle(err: any): string {
  return "";
}

function get_test() {
  return;
}

const filetypes: any = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'text/json'
};
const getroutes: any = {
  'getest': get_test
};
const postroutes: any = {
  '/dothing': dothing,
  '/dothingtoo': dothingtoo
};

function dothing() {
  console.log("did thing");
  return;
}
function dothingtoo() {
  console.log("did thing too electric boogaloo");
  return;
}

const server = http.createServer((req: any, res: any) => {
  const publicdir: string = path.join(__dirname,'..', 'public');
  const requestedfilepath: string = path.join(publicdir, req.url === '/' ? '/index.html' : req.url);
  const absolutepath: string = path.resolve(requestedfilepath);
  const safesecurityzone: string = path.resolve(publicdir);
  if (!absolutepath.startsWith(safesecurityzone)) {
    res.writeHead(403); // 403 means forbidden
    return res.end("nice try, but you don't fuckle with shuckle");
  }
  const filetype: string = path.extname(requestedfilepath);
  const conttype: string = filetypes[filetype] || "text/plain";
  const method: string = req.method;
  if (method === 'GET'){
    fs.readFile(requestedfilepath, (err: any, filedata: string) => {
      if (err) {
        res.writeHead(500);
        return res.end('error loading page');
      }
      res.writeHead(200, {'Content-Type': conttype});
      res.end(filedata);
    });
  }
  if(method === 'POST'){
    const handler: any= postroutes[req.url];
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
server.listen(port, url, () => {
  console.log('[ .  . ]');
  console.log('   \\\/ ');
  console.log('/  > _ \\');
  console.log('dirname = ',__dirname);
  console.log(`server running at http://localhost:${port}/`);
});
