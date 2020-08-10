var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http , {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});
const cors = require("cors");
const { connected } = require('process');
app.use(cors());


const PORT = process.env.NODE_PORT || 8080;

app.get('/', (req, res) => {
  res.send({ message: "I am alive" }).status(200);
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

http.listen(8080, () => {
  console.log(`listening ${PORT}`);
});