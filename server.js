const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
const parseOptions = require("./utils/parse-options.js");
const { port } = parseOptions({ port: "p" });

if (!port) {
  process.exit(1);
}

const endpoints = {
  "/static": {
    "GET": serveStaticFile
  },
};

function serveStaticFile(req, res) {
  const filePath = path.join(__dirname, url.parse(req.url).pathname);
  console.log(__dirname);
  fs.readFile(filePath)
    .then(data => {
      const ext = path.extname(filePath).substring(1);
      const contentType = getContentType(ext);

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    })
    .catch(error => {
      console.error(error);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
    });
}

module.exports = { endpoints };

const server = http.createServer((req, res) => {
  for (const [path, method] of Object.entries(endpoints)) {
    if (req.url.startsWith(path)) {
      console.log(method, path, req.method);
      if (Object.keys(method)[0] === req.method) {
        return method[req.method](req, res);
      } else {
        res.writeHead(405, { 'Content-Type': 'text/plain', 'Allow': 'GET' });
        res.end('Method Not Allowed');
        return;
      }
    }
    else{
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
});

const newPort = process.argv[4] || 8000;
server.listen(newPort, () => {
  console.log(`Server listening on port ${newPort}`);
});

function getContentType(fileExtension) {
  switch (fileExtension) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'text/javascript';
    default:
      return 'application/octet-stream';
  }
}
