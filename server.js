const http = require("http");
const fs = require("fs");
const path = require("path");
const Cookies = require("cookies");

const host = "localhost";
const port = 8000;

const _dirname = "/http-course/http-course";

const user = {
  id: 123,
  username: "testuser",
  password: "qwerty",
};

//handler functions
//get handler
const handlerGetFiles = (req, res) => {
  if (req.url === "/get" && req.method === "GET") {
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
  }
  if (req.url === "/get" && req.method !== "GET") {
    console.log("HTTP method not allowed");
    res.writeHead(405);
    res.end("HTTP method not allowed");
    return;
  }
};

/////auth handler
const handlerAuth = (req, res, cookies) => {
  if (req.url === "/auth" && req.method === "GET") {
    res.writeHead(200, "OK!", { "Content-Type": "text/html; charset=utf-8" });
    let readStream = fs.createReadStream(_dirname + "/authForm.html", "utf-8");
    readStream.pipe(res);
    return;
  }

  if (req.url === "/auth" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      const { username, password } = JSON.parse(data);
      if (username === user.username && password === user.password) {
        //send cookies
        cookies.set("userId", "123");
        cookies.set("authorized", "true");

        res.writeHead(200, "OK");
        res.end("Welcome");
      } else {
        res.writeHead(400, {
          "Content-type": "text/html",
        });
        res.end("Неверный логин или пароль");
      }
    });

    return;
  }
};

////post handler
function handlerPost(req, res, cookies) {
  if (req.url === "/post" && req.method === "GET") {
    res.writeHead(200, "OK!", { "Content-Type": "text/html; charset=utf-8" });
    let readStream = fs.createReadStream(_dirname + "/postPage.html", "utf-8");
    readStream.pipe(res);
    return;
  }

  if (req.url === "/post" && req.method === "POST") {
    // console.log(cookies.get("authorized"));
    // console.log(cookies.get("userId"));
    let userId = cookies.get("userId");
    let authorized = cookies.get("authorized");

    console.log(userId);
    console.log(authorized);
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      const { filename, content } = JSON.parse(data);
      console.log(filename, content);
      fs.writeFile(_dirname + "/files/" + filename + ".txt", content, (err) => {
        if (err) console.log(err);
        console.log(filename + " created");
      });
      res.writeHead(200, "OK!");
      res.end();
    });
  }
}

//delete handler
function deleteHandler(req, res, cookies) {
  if (req.url === "/delete" && req.method === "GET") {
    res.writeHead(200, "OK!", { "Content-Type": "text/html; charset=utf-8" });
    let readStream = fs.createReadStream(
      _dirname + "/deletePage.html",
      "utf-8"
    );
    readStream.pipe(res);
    return;
  }
  if (req.url === "/delete" && req.method === "DELETE") {
    // console.log(cookies.get("authorized"));
    // console.log(cookies.get("userId"));
    let userId = cookies.get("userId");
    let authorized = cookies.get("authorized");

    // console.log(userId);
    // console.log(authorized);
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      const filename = JSON.parse(data);
      console.log("filename: ", filename);
      try {
        let file = fs.lstatSync(_dirname + "/files/" + filename + ".txt");
        console.log("file: ", file);
        fs.unlinkSync(_dirname + "/files/" + filename + ".txt");
        console.log(filename + " deleted");
        res.writeHead(200, "OK!");
      } catch (error) {
        console.log("it does not exist");
        res.writeHead(400, "File not a found!");
      }

      res.end();
    });
  }
}
//server function
const requestListener = (req, res) => {
  //create new object cookies
  let cookies = new Cookies(req, res);
  // console.log(cookies.get("userId"));
  // console.log(cookies.get("authorized"));

  if (req.url === "/") {
    console.log("main");
    res.writeHead(200);
    res.end("Main page!");
    return;
  }

  if (req.url === "/get") {
    console.log("get");
    return handlerGetFiles(req, res);
  }

  if (req.url === "/auth") {
    console.log("auth");
    return handlerAuth(req, res, cookies);
  }

  if (req.url === "/post") {
    console.log("post");
    return handlerPost(req, res, cookies);
  }

  if (req.url === "/delete") {
    console.log("delete");
    return deleteHandler(req, res, cookies);
  }
  // if (req.url === "/delete" && req.method !== "DELETE") {
  //   console.log("HTTP method not allowed");
  //   res.writeHead(405);
  //   res.end("HTTP method not allowed");
  //   return;
  // }
  // if (req.url === "/post" && req.method === "POST") {
  //   res.writeHead(200);
  //   res.end("Success!");
  //   return;
  // }
  // if (req.url === "/post" && req.method !== "POST") {
  //   res.writeHead(405);
  //   console.log("HTTP method not allowed");
  //   res.end("HTTP method not allowed");
  //   return;
  // }

  if (req.url === "/redirect" && req.method === "GET") {
    res.writeHead(301, { Location: "/redirected" });
    res.end("Сервис переехал на новый адрес http://localhost:8000/redirected");
    return;
  }

  res.writeHead(404);
  res.end("Knigga not Found! ");
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server started on ${port} port`);
});
