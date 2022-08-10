const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "localhost";
const port = 5000;

const _dirname = "/http-course/http-course";

const handlerServer = (req, res) => {
  if (req.url === "/") {
    res.writeHead(200);
    res.end("Main page!");
    return;
  }

  if (req.url === "/auth") {
    res.writeHead(200, "OK!", { "Content-Type": "text/html; charset=utf-8" });
    let readStream = fs.createReadStream(_dirname + "/authForm.html", "utf-8");
    readStream.pipe(res);
    return;
  }
  if (req.url === "/auth" && req.method === "POST") {
    res.writeHead(200, "OK!", { "Content-Type": "text/html; charset=utf-8" });
    res.end("1234");
    // let data = "";
    // req.on("data", (chunk) => (data += chunk));
    // console.log(data);
    // req.on("end", () => {
    //   res.end("!!!!");
    // });
    // console.log(req);
    // // return;
  }
  res.writeHead(404);
  res.end("Knigga not Found! ");
};

const server = http.createServer(handlerServer);

server.listen(port, host, () => {
  console.log(`Server started on ${port} port`);
});
