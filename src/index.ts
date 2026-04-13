const http: any = require('http');
const fs: any = require('fs');
const path: any = require('path');

var port: number = 6942;
var url: string = 'localhost';

function errorhandle(err: any): string {
  return "";
}

const mimetypes: any = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'text/json'
};

const server = http.createServer((req: any, res: any) => {
  const requrl: string = req.url === "/" ? "index.html" : req.url; 
  const sitepath: string = path.join(__dirname,'..', 'public', requrl);
  const filetype: string = path.extname(sitepath);
  const conttype: string = mimetypes[filetype] || "text/plain";
  fs.readFile(sitepath,'utf8', (err: any, filedata: string) => {
    if (err) {
      res.writeHead(500);
      return res.end('error loading page');
    }
    
    res.writeHead(200, {'Content-Type': conttype});
    res.end(filedata);
  });
});
server.listen(port, url, () => {
  console.log('dirname = ',__dirname);
  console.log(`server running at http://localhost:${port}/`);
});
