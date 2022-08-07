const http = require("http");
const fs = require("fs");

const host = "localhost";
const port = 5000;

const _dirname = "/http-course/http-course/files";

const requestListener = (req, res) => {
  if (req.url === "/test" && req.method === "GET") {
    const files = fs.readdirSync(_dirname);
    let fileNames = "";
    files.forEach((file) => {
      fileNames += `${file}, `;
    });
    res.writeHead(200, "Ok!", { "Content-type": "text/html" });
    res.end(fileNames);
    return;
  }

  if (req.url === "/test" && req.method !== "GET") {
    res.writeHead(405);
    res.end("HTTP method not allowed");
    return;
  }

  res.writeHead(404);
  res.end("Knigga not Found! ");
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server started on ${port} port`);
});
