const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

let win = null;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(createWindow);

fs.readdir(__dirname, (err, result) => {
  if (result.includes("files")) {
    console.log("exist");
  } else {
    fs.mkdir(path.join(__dirname, "files"), (err, result) => {
      console.log("made files");
    });
  }
});

// Getting Info from client
ipcMain.on("submitData", (event, data) => {
  console.log(data);

  let title = data.title;
  let url = data.url;
  let userId = data.userId;
  let password = data.password;

  let algorithm = "aes-256-cbc";
  let key = "abcdefghijklmnopqrstuvwxyz123456";
  let iv = "1234567890123456";
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  title = cipher.update(title, "utf8", "base64");
  title += cipher.final("base64");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  url = cipher.update(url, "utf8", "base64");
  url += cipher.final("base64");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  userId = cipher.update(userId, "utf8", "base64");
  userId += cipher.final("base64");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  password = cipher.update(password, "utf8", "base64");
  password += cipher.final("base64");

  if (
    title.includes("/") ||
    url.includes("/") ||
    userId.includes("/") ||
    password.includes("/")
  ) {
    title.split("/").pop();
    url.split("/").pop();
    userId.split("/").pop();
    password.split("/").pop();
  }

  fs.writeFile(
    path.join(__dirname, "files", `${title}.json`),
    `{"title": "${title}", "url": "${url}", "userId": "${userId}", "password": "${password}"}`,
    (err, result) => {
      console.log(err);
    }
  );
});

ipcMain.on("getHistory", (event, data) => {
  let userId = data.userId;
  let password = data.password;

  let algorithm = "aes-256-cbc";
  let key = "abcdefghijklmnopqrstuvwxyz123456";
  let iv = "1234567890123456";
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  userId = cipher.update(userId, "utf8", "base64");
  userId += cipher.final("base64");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  password = cipher.update(password, "utf8", "base64");
  password += cipher.final("base64");

  if (userId.includes("/") || password.includes("/")) {
    userId.split("/").pop();
    password.split("/").pop();
  }

  let finalResult = [];
  let title;
  let url;
  let toJson;

  fs.readdir(path.join(__dirname, "files"), (err, result) => {
    result.forEach((data) => {
      fs.readFile("./files/" + data, "utf8", (err, result) => {
        toJson = JSON.parse(result);

        algorithm = "aes-256-cbc";
        key = "abcdefghijklmnopqrstuvwxyz123456";
        iv = "1234567890123456";
        decipher = crypto.createDecipheriv(algorithm, key, iv);
        title = decipher.update(toJson.title, "base64", "utf8");
        title += decipher.final("utf8");

        algorithm = "aes-256-cbc";
        key = "abcdefghijklmnopqrstuvwxyz123456";
        iv = "1234567890123456";
        decipher = crypto.createDecipheriv(algorithm, key, iv);
        url = decipher.update(toJson.url, "base64", "utf8");
        url += decipher.final("utf8");

        if (userId === userId && password === password) {
          console.log(title);
          finalResult.push({ title, url });
        } else {
          console.log("err");
        }
      });
      setTimeout(() => {
        win.webContents.send("receiveData", finalResult);
      }, 1000);
    });
  });
});
