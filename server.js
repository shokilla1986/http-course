const http = require("http");

const host = "localhost";
const port = 5000;

const requestListener = (req, res) => {
  if (req.url === "/test") {
    res.writeHead(200);
    res.end("Hello, Knigga Test! ");
  }
  res.writeHead(404);
  res.end("Knigga not Found! ");
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server started on ${port} port`);
});
