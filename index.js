import express from 'express';
import ioPackage from 'socket.io';
import httpPackage from 'http';
const app = express();
const http = httpPackage.Server(app);
const io = ioPackage(http);
const w = require('./watcher');


// create a namespaced socket
io.of('/hotSocket').on('connection', (socket) => {
  console.log('a user connected');
  w.watchYourSass(socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// listen on port 1992
http.listen(1992, () => {
  console.log('sass-hot-loader starting...');
});
