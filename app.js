express = require('express');  //web server
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);	//web socket server

//inicializamos puerto serialport

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyS0", { baudrate: 115200 });

server.listen(8080); //start the webserver on port 8080
app.use(express.static('public')); //tell the server that ./public/ contains the static webpages
//definimos websocket

var brightness = 0; //static variable to hold the current brightness
io.sockets.on('connection', function (socket) { //gets called whenever a client connects
    socket.on('led', function (data) { //makes the socket react to 'led' packets by calling this function
        brightness = data.value;  //updates brightness from the data object
        var buf = new Buffer(1); //creates a new 1-byte buffer
        buf.writeUInt8(brightness, 0); //writes the pwm value to the buffer
        serialPort.write(buf); //transmits the buffer to the arduino

        io.sockets.emit('led', {value: brightness}); //sends the updated brightness to all connected clients
    });
    socket.emit('led', {value: brightness}); //send the new client the current brightness
});
console.log("runnig");
