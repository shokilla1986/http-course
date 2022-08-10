const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "localhost";
const port = 8000;

const _dirname = "/http-course/http-course";

const user = {
  id: 123,
  username: "testuser",
  password: "qwerty",
};

const getHundler = (req, res) => {
  try {
    const files = fs.readdirSync(_dirname + "/files", { encoding: "utf-8" });
    let fileNames = "";
    files.forEach((file) => {
      fileNames += `${file}, `;
      console.log(file);
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

const handlerAuth = (req, res) => {
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
};

const requestListener = (req, res) => {
  if (req.url === "/") {
    console.log("main");
    res.writeHead(200);
    res.end("Main page!");
    return;
  }

  // if (req.url === "/auth") {
  //   res.writeHead(200, "OK!", { "Content-Type": "text/html; charset=utf-8" });
  //   let readStream = fs.createReadStream(_dirname + "/authForm.html", "utf-8");
  //   readStream.pipe(res);
  //   return;
  // }
  // if (req.url === "/auth" && req.method === "POST") {
  //   // let data = "";
  //   // req.on("data", (chunk) => (data += chunk));
  //   // console.log(data);
  //   // req.on("end", () => {
  //   //   res.end(data);
  //   // });
  //   console.log(req);
  //   return;
  // }

  if (req.url === "/get" && req.method === "GET") {
    return getHundler(req, res);
  }

  if (req.url === "/get" && req.method !== "GET") {
    console.log("HTTP method not allowed");
    res.writeHead(405);
    res.end("HTTP method not allowed");
    return;
  }

  if (req.url === "/auth") {
    console.log("auth");
    return handlerAuth(req, res);
  }

  if (req.url === "/delete" && req.method === "DELETE") {
    console.log("main");
    res.writeHead(200);

    res.end("Success!");
    return;
  }
  if (req.url === "/delete" && req.method !== "DELETE") {
    console.log("HTTP method not allowed");
    res.writeHead(405);
    res.end("HTTP method not allowed");
    return;
  }
  if (req.url === "/post" && req.method === "POST") {
    res.writeHead(200);
    console.log("post success!");
    res.end("Success!");
    return;
  }
  if (req.url === "/post" && req.method !== "POST") {
    res.writeHead(405);
    console.log("HTTP method not allowed");
    res.end("HTTP method not allowed");
    return;
  }

  if (req.url === "/redirect" && req.method === "GET") {
    res.writeHead(301, { Location: "/redirected" });
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
