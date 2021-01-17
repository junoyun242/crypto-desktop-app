const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

let win = null;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
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

ipcMain.on("submitData", (event, data) => {
  let title = data.title;
  let url = data.url;
  let userId = data.userId;
  let password = data.password;

  let algorithm = "aes-256-cbc";
  let key = "abcdefghijklmnopqrstuvwxyz123456";
  let iv = "1234567890123456";
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  title = cipher.update(title, "utf8", "hex");
  title += cipher.final("hex");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  url = cipher.update(url, "utf8", "hex");
  url += cipher.final("hex");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  userId = cipher.update(userId, "utf8", "hex");
  userId += cipher.final("hex");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  password = cipher.update(password, "utf8", "hex");
  password += cipher.final("hex");

  if (
    title.includes("/") ||
    url.includes("/") ||
    userId.includes("/") ||
    password.includes("/")
  ) {
    title.replace("/", "");
    url.replace("/", "");
    userId.replace("/", "");
    password.replace("/", "");
    title.split("/").pop();
    url.split("/").pop();
    userId.split("/").pop();
    password.split("/").pop();
  }

  fs.writeFile(
    path.join(__dirname, "files", `${title}.json`),
    `{"title": "${title}", "url": "${url}", "userId": "${userId}", "password": "${password}"}`,
    (err, result) => {
      if (err) throw err;
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
  userId = cipher.update(userId, "utf8", "hex");
  userId += cipher.final("hex");

  algorithm = "aes-256-cbc";
  key = "abcdefghijklmnopqrstuvwxyz123456";
  iv = "1234567890123456";
  cipher = crypto.createCipheriv(algorithm, key, iv);
  password = cipher.update(password, "utf8", "hex");
  password += cipher.final("hex");

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
        title = decipher.update(toJson.title, "hex", "utf8");
        title += decipher.final("utf8");

        algorithm = "aes-256-cbc";
        key = "abcdefghijklmnopqrstuvwxyz123456";
        iv = "1234567890123456";
        decipher = crypto.createDecipheriv(algorithm, key, iv);
        url = decipher.update(toJson.url, "hex", "utf8");
        url += decipher.final("utf8");

        if (userId === toJson.userId && password === toJson.password) {
          finalResult.push({ title, url });
        } else {
          console.log("err");
        }
      });
      setTimeout(() => {
        win.webContents.send("receiveData", finalResult);
      }, 100);
    });
  });
});

ipcMain.on("deleteHistory", (event, data) => {
  let title = data.target;

  const algorithm = "aes-256-cbc";
  const key = "abcdefghijklmnopqrstuvwxyz123456";
  const iv = "1234567890123456";
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  title = cipher.update(title, "utf8", "hex");
  title += cipher.final("hex");

  if (title.includes("/")) {
    title.split("/").pop();
  }

  fs.unlink(path.join(__dirname, "files", title + ".json"), (err) => {
    if (err) {
      console.log(err);
    }
  });
});
