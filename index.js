import express from 'express';
import ioPackage from 'socket.io';

const app = express();
const http = require('http').Server(app);
const io = ioPackage(http);
const w = require('./watcher');


// create a namespaced socket
io.of('/hotSocket').on('connection', (socket) => {
  console.log('a user connected');
  w.watcher(socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// listen on port 1992
http.listen(1992, () => {
  console.log('hot-reload-css starting...');
});
