const ipcRenderer = require("electron").ipcRenderer;

// Sending info to Server
const submitData = () => {
  const title = document.querySelector("#title").value;
  const url = document.querySelector("#url").value;
  const userId = document.querySelector("#userId").value;
  const password = document.querySelector("#password").value;

  ipcRenderer.send("submitData", {
    title,
    url,
    userId,
    password,
  });

  alert("data has been saved");
};

const getHistory = () => {
  const userId = document.querySelector("#historyId").value;
  const password = document.querySelector("#historyPassword").value;

  ipcRenderer.send("getHistory", {
    userId,
    password,
  });

  ipcRenderer.on("receiveData", (event, data) => {
    let result = "";
    console.log(data);
    if (data[0] === undefined) {
      result = "<p>Wrong Id or Password</p>";
      document.querySelector("#ul").innerHTML = result;
    } else {
      data.map((elem, index) => {
        result += `<div class="text-gray-300 text-center p-2 m-2"><p class='text-center pb-1'>${index}</p><li>title: ${elem.title}</li><li>url: <a href="${elem.url}">${elem.url}<a/></li><div/>`;
        document.querySelector("#ul").innerHTML = result;
      });
    }
  });
};
