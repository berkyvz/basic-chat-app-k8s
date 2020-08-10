const express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
const path = require('path');
const cors = require("cors");
var bodyParser = require('body-parser')

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(cors())

const staticValues = {
    PORT : process.env.PORT || 5000,
    HOST : process.env.NODE_ENV === 'PROD' ? 'chat-service': 'localhost',
    WEBSOCKET_PORT : process.env.SOCKET_PORT || 8080
};

app.get('/staticvalues', (req, res) => {
  res.send(staticValues).status(200);
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

http.listen(staticValues.PORT, () => {
  console.log(`listening ${staticValues.PORT}`);
});