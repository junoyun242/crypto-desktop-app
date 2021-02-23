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

  title = "";
  url = "";
  userId = "";
  password = "";

  alert("Data has been saved! \n\nIf error occurs, try changing the title");
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
    if (data[0] === undefined) {
      result =
        "<p class='text-yellow-400 text-center p-2 m-2'>Wrong Id or Password</p>";
      document.querySelector("#ul").innerHTML = result;
    } else {
      data.map((elem, index) => {
        result += `<div class="text-gray-300 text-center p-2 m-2"><div class="border-2 border-gray-300 p-2 m-2"><p class='text-center pb-1'>${
          index + 1
        }</p><li>title: ${elem.title}</li><li>Content: ${
          elem.url
        }</li><button class="border-2 border-gray-300 rounded-sm bg-white text-black px-2 py-1 m-2"onclick="deleteHistory('${
          elem.title
        }')">Delete</button></div><div/>`;
        document.querySelector("#ul").innerHTML = result;
      });
    }
  });

  setTimeout(() => {
    window.scrollTo(0, 500);
  }, 200);
};

const deleteHistory = (target) => {
  ipcRenderer.send("deleteHistory", {
    target,
  });

  alert("Deleted");
  location.reload();
};
