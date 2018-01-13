'use strict';

const express = require('express');
var io = require('socket.io-client');
var socket = io.connect('ws://afternoon-shore-70838.herokuapp.com/', {
    reconnect: true
});

var osc = require("osc");
const path = require('path');
const PORT = process.env.PORT || 4000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


// SOCKET IO Add a connect listener
socket.on('connect', function(socket) {
    console.log('Connected!');
});

socket.on("hello", function(msg){
  console.log("hello hello");
})

socket.on('settings', function(data){
  const settings = data;
  console.log("received settings :: " + data);

  var udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: settings.oscInputPort
  });

  //send osc message to server
  udpPort.on("message", function(oscMsg) {
      console.log(oscMsg);
      socket.emit(oscMsg.address, oscMsg.args)
  });

  for (let param of settings.params) {
    socket.on(param, (data) => {
        udpPort.send({
            address: param,
            args: data
        }, "127.0.0.1", settings.oscOutputPort);
    });
  }



  // Open the socket.
  udpPort.open();
});
