'use strict';

const express = require('express');
const app = express();
const io = require('socket.io-client');
const socket = io.connect('ws://nmd17server.herokuapp.com', {
    reconnect: true
});
// const socket = io.connect('http://localhost:3000/', {
//     reconnect: true
// });

const osc = require("osc");
const path = require('path');
const PORT = process.env.PORT || 4000;
const INDEX = path.join(__dirname, 'index.html');
var messages = {};

//app.use((req, res) => res.sendFile(INDEX))

app.get('/allo', function (req, res) {
  res.send('Hello World!')
});

app.get('/', function (req, res) {
  res.sendFile(INDEX)
});

app.use(express.static('public'))
    app.listen(PORT, function () {
      var art = require('ascii-art');
      art.font('ART & TECH   NMD', 'Doom', function(rendered){
          console.log(rendered);
          console.log("Check out https://nmd17server.herokuapp.com for settings");
      });
    });



// SOCKET IO Add a connect listener
socket.on('connect', function(socket) {
    console.log('Connected!');
});

socket.on('settings', function(data){
  const settings = data;
  console.log("[SETTINGS]");
  for (var variable in data) {
    if (data.hasOwnProperty(variable)) {
      if (variable == "params"){
        console.log("<--PARAMS-->");
        for (var param of data[variable]) {
          console.log(param);
        }
        console.log("\n");
      } else {
        console.log(variable + " :: " + data[variable]);
      }
    }
  }
  console.log("<--END-->");
  console.log("\n");

  var udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: settings.oscInputPort
  });

  //send osc message to server
  udpPort.on("message", function(oscMsg) {
      messages[oscMsg.address] = oscMsg.args;
      socket.emit("clientvalue", {name: oscMsg.address, value:oscMsg.args})
  });

  setInterval(function () {
      console.log(messages);
  }, 300);


    socket.on("servervalue", (data) => {
        udpPort.send({
            address: data.name,
            args: data.value
        }, "127.0.0.1", settings.oscOutputPort);
    });

  // Open the socket.
  udpPort.open();
});
