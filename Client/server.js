var Particle = require('particle-api-js');
var particle = new Particle();
var fs = require('fs');
var osc = require('osc');
const express = require('express');
var io = require('socket.io-client');
const path = require('path');
const PORT = 4000;
var token;
var devicesPr;

// Connect with heroku server
var socket = io.connect('ws://synfocycle.herokuapp.com/', {
    reconnect: true
});

// Setup local server
const server = express()
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Check if connects with socket
socket.on('connect', function (socket) {
    console.log('Connected!');
});

// Particle login
particle.login({
    username: 'bram.speeckaert@student.ehb.be',
    password: 'finalWork'
}).then(
    function (data) {
        // Get token and get particle device (electron) 
        token = data.body.access_token;
        devicesPr = particle.listDevices({
            auth: token
        });
        console.log('API call completed on promise resolve: ', token);
        
        // Start data stream
        startStream();
    },
    function (err) {
        console.log('Could not log in.', err);
    }
);

var startStream = function () {
    
    // Set custom event for gps data from particle
    var devicesPr = particle.getEventStream({
        name: 'gpsData',
        auth: token
    });
    
    // Get the selected event (gpsData) 
    devicesPr.then(function (stream) {
        stream.on('event', function (data) {
            // Split the values dynamically to an array
            var incomingData = data.data.split('/');
            // Put into object for local save
            var obj = {
                synfo: []
            };
            obj.synfo.push({
                latitude: incomingData[0],
                longitude: incomingData[1],
                altitude: incomingData[2],
                kmph: incomingData[3]
            });
            
            // Convert to json format and append in the local data.json file
            var json = JSON.stringify(obj);
            fs.appendFile('data.json', json, 'UTF-8', function (err) {
                if (err) {
                    console.log(`Error while appending data to json file ${err}`);
                }
            });
            
            // Send incoming particle data to server
            socket.emit('/latitude', incomingData[0]);
            console.log(`latitude: ${incomingData[0]}`);
            socket.emit('/longitude', incomingData[1]);
            console.log(`longitude: ${incomingData[1]}`);
            socket.emit('/altitude', incomingData[2]);
            console.log(`altitude: ${incomingData[2]}`);
            if (incomingData[3] != undefined) {
                socket.emit('/kmph', incomingData[3]);
                console.log(`kmph: ${incomingData[3]}`);
            }
        });
    });
};

// Check when there are settings emitting from server
socket.on('settings', function (data) {
    const settings = data;

    var udpPort = new osc.UDPPort({
        localAddress: "0.0.0.0",
        localPort: settings.oscInputPort
    });
    
    // Receive values from Heroku server & send over OSC local
    socket.on('state', function (data) {
        const state = data;
        for (var variable in state) {
            if (state.hasOwnProperty(variable)) {
                udpPort.send({
                    address: variable,
                    args: parseFloat(state[variable])
                }, "127.0.0.1", PORT);
            }
        }
    });
    
    // Receive OSC messages 
    udpPort.on("message", function (oscMsg) {
        console.log(`osc msg: ${oscMsg.address}`);
        console.log(`osc args: ${oscMsg.args}`);
        socket.emit(oscMsg.address, oscMsg.args)
    });

    udpPort.open();

});