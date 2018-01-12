const express = require('express');
const path = require('path')
var http = require('http');
var app = express();
var fs = require('fs');
var parser = require('json-parser');

const PORT = process.env.PORT;
var srvr = http.createServer(app).listen(PORT);
const io = require('socket.io')(srvr);

var settings = "";
var state = {};


app.use(express.static('./public'));

fs.readFile(__dirname + '/settings.json', function(err, data) {
    settings = parser.parse(data);
    console.log("settings loaded :: ");
    console.log(settings);

    console.log('trying to connect');
    io.on('connection', (socket) => {
      console.log('Client connected');
      socket.emit('settings', settings);

      for (let param of settings.params) {
        socket.on(param, (data)=>{
          state[param] = data;
          io.emit(param, data);
          io.emit("state", state);
        });
      }

      socket.on('disconnect', () => console.log('Client disconnected'));
    });
  });

console.log(`Listening on port ${PORT}`);
