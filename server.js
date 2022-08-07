const http = require("http");
const fs = require("fs");

const host = "localhost";
const port = 5000;

const _dirname = "/http-course/http-course/files";

const getHundler = (req, res) => {
  try {
    const files = fs.readdirSync(_dirname);
    let fileNames = "";
    files.forEach((file) => {
      fileNames += `${file}, `;
    });
    res.writeHead(200, "Ok!", { "Content-type": "text/html" });
    res.end(fileNames);
    return;
  } catch (error) {
    res.writeHead(500, "Ok!", { "Content-type": "text/html" });
    res.end("Internal server error");
    return;
  }
};

const requestListener = (req, res) => {
  if (req.url === "/get" && req.method === "GET") {
    return getHundler(req, res);
  }

  if (req.url === "/get" && req.method !== "GET") {
    res.writeHead(405);
    res.end("HTTP method not allowed");
    return;
  }

  if (req.url === "/delete" && req.method === "DELETE") {
    res.writeHead(200);
    res.end("Success!");
    return;
  }
  if (req.url === "/delete" && req.method !== "DELETE") {
    res.writeHead(405);
    res.end("HTTP method not allowed");
    return;
  }
  if (req.url === "/post" && req.method === "POST") {
    res.writeHead(200);
    res.end("Success!");
    return;
  }
  if (req.url === "/post" && req.method !== "POST") {
    res.writeHead(405);
    res.end("HTTP method not allowed");
    return;
  }

  if (req.url === "/redirect" && req.method === "GET") {
    res.writeHead(301);
    res.end("Сервис переехал на новый адрес http://localhost:5000/redirected");
    return;
  }

  res.writeHead(404);
  res.end("Knigga not Found! ");
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server started on ${port} port`);
});
