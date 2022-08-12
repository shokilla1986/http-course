const http = require("http");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const host = "localhost";
const port = 8000;

const _dirname = "/http-course/http-course";

const user = {
  id: 123,
  username: "testuser",
  password: "qwerty",
};

const handlerServer = (req, res) => {
  if (req.url === "/") {
    res.writeHead(200);
    console.log("main");
    res.end("Main page!");
    return;
  }

  if (req.url === "/auth" && req.method === "GET") {
    console.log("auth");
    res.writeHead(200, "OK!", { "Content-Type": "text/html; charset=utf-8" });
    let readStream = fs.createReadStream(_dirname + "/authForm.html", "utf-8");
    readStream.pipe(res);
    return;
  }

  if (req.url === "/auth" && req.method === "POST") {
    console.log("offer");

    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      const { username, password } = JSON.parse(data);
      console.log(username);
      console.log(password);
      if (username === user.username && password === user.password) {
        res.writeHead(200, "Hello", {
          "Set-Cookie":
            "userId=123; expires=Thu, 10 Aug 2022 18:45:00 -0000; max_age=120",
        });
        res.end("Welcome");
      } else {
        res.writeHead(400, {
          "Content-type": "text/html",
        });
        res.end("Неверный логин или пароль");
      }
    });

    console.log("req post");
    return;
  }
  res.writeHead(404);
  console.log("HTTP method not allowed");
  res.end("Knigga not Found! ");
};

const server = http.createServer(handlerServer);

server.listen(port, host, () => {
  console.log(`Server started on ${port} port`);
});
