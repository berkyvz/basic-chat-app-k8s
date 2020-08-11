const os = require('os'); 
const express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
const path = require('path');
const cors = require("cors");
var io = require('socket.io').listen(http);


app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors())

const staticValues = {
    PORT : process.env.PORT || 5000,
    HOSTNAME: os.hostname()
};

app.get('/staticvalues', (req, res) => {
  res.send(staticValues).status(200);
});

io.on('connection', (socket) => {
  socket.on('USER_CONNECTED', (username) => {
    console.log(`User ${username} connected to the socket.`);
    io.emit('MESSAGE', {type: 'connected' , sender: 'server', message: username});
  });

  socket.on('MESSAGE', (msg) => {
    console.log(msg);
    if(msg.message.length > 0){
      io.emit('MESSAGE', {type: 'message' , sender: msg.sender , message: msg.message});
    }
  });

  socket.on('LOGOUT', (username) => {
      io.emit('MESSAGE', {type: 'disconnected' , sender: 'server', message: username});
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


http.listen(staticValues.PORT, () => {
  console.log('APP CONFIG:' , staticValues);
  console.log(`listening ${staticValues.PORT}`);
});