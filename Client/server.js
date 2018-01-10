'use strict';
var Particle = require('particle-api-js');
var particle = new Particle();
var token = '0e93f7f15227ab29cad4b378f89a61e92ad86360';
var devicesPr = particle.listDevices({ auth: token });
var deviceID = '2f0053000b51343136333035';
var dataFromParticle;

var devicesPr = particle.listDevices({ auth: token });




const express = require('express');
var io = require('socket.io-client');
var socket = io.connect('ws://afternoon-shore-70838.herokuapp.com', {
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


/*
particle.getEventStream({ auth: token }).then(function(stream) {
    
    stream.on('gpsdata', function(data) {
        var interval = setInterval(function() {
        currentTime += waitInterval;
        percentWaited = Math.floor(currentTime);
        writeWaitingPercent(percentWaited);
        socket.emit('/test', (currentTime / 100));
        }, waitInterval);      
        var incomingData = data.data.split('/');
        console.log(`latitude ${incomingData[0]}, altitude ${incomingData[1]}, longitude ${incomingData[2]}`);
        
        //socket.emit('/latitude', incomingData[0]);    
        //socket.emit('/altitude', incomingData[1]);    
        //socket.emit('/longitude', incomingData[2]);    
        
    });
        


});

*/
socket.on('settings', function(data){
  const settings = data;
  console.log("received settings :: " + data);

  var udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: settings.oscInputPort
  });

  //send osc message to server
    /*
    particle.getEventStream({ auth: token }).then(function(stream) {
    stream.on('longitude', function(data) {
      console.log("Event: ", data);
      socket.emit(`/${data.name}`, data.data)
  });
});
*/
    
  udpPort.on("message", function(oscMsg) {
      //oscMsg = dataFromParticle;
      console.log(`osc msg: ${oscMsg.address}`);
      console.log(`osc args: ${oscMsg.args}`);
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


