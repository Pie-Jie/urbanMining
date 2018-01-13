var Particle = require('particle-api-js');
var particle = new Particle();
var fs = require('fs');
var osc = require('osc');
const express = require('express');
var io = require('socket.io-client');
const path = require('path');
const PORT = process.env.PORT || 4000;
var token;
var devicesPr;

var socket = io.connect('ws://afternoon-shore-70838.herokuapp.com/', {
    reconnect: true
});

const server = express()
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

socket.on('connect', function (socket) {
    console.log('Connected!');
});

particle.login({
    username: 'bram.speeckaert@student.ehb.be',
    password: 'finalWork'
}).then(
    function (data) {
        token = data.body.access_token;
        devicesPr = particle.listDevices({ auth: token });
        console.log('API call completed on promise resolve: ', token);
        startStream();
    },
    function (err) {
        console.log('Could not log in.', err);
    }
);

var startStream = function () {
    var devicesPr = particle.getEventStream({
        name: 'gpsData',
        auth: token
    });
    devicesPr.then(function (stream) {
        stream.on('event', function (data) {
            var incomingData = data.data.split('/');
            var obj = {
                synfo: []
            };
            obj.synfo.push({
                latitude: incomingData[0],
                longitude: incomingData[1],
                altitude: incomingData[2],
                kmph: incomingData[3]
            });
            var json = JSON.stringify(obj);
            fs.appendFile('data.json', json, 'UTF-8', function (err) {
                if (err) {
                    console.log(`Error while appending data to json file ${err}`);
                }
            });
            socket.emit('/latitude', incomingData[0]);
            console.log(`latitude: ${incomingData[0]}`);
            socket.emit('/longitude', incomingData[1]);
            console.log(`longitude: ${incomingData[1]}`);
            socket.emit('/altitude', incomingData[2]);
            console.log(`altitude: ${incomingData[2]}`);
            if(incomingData[3] != undefined){
                socket.emit('/kmph', incomingData[3]);
                console.log(`kmph: ${incomingData[3]}`);    
            }         
        });    
    });
};

socket.on('settings', function (data) {
    const settings = data;
    console.log(`Settings: ${settings}`);
    var udpPort = new osc.UDPPort({
        localAddress: "0.0.0.0",
        localPort: settings.oscInputPort
    });

    udpPort.on("message", function (oscMsg) {
        console.log(`osc msg: ${oscMsg.address}`);
        console.log(`osc args: ${oscMsg.args} with type: ${typeof oscMsg.args}`);
        socket.emit(oscMsg.address, oscMsg.args)
    });

    for (let param of settings.params) {
        console.log(`param ${param}`);
        socket.on(param, (data) => {
            udpPort.send({
                address: param,
                args: parseFloat(data)
            }, "127.0.0.1", settings.oscOutputPort);
            console.log(`param: ${param}`);
        });
    }
    udpPort.open();

});