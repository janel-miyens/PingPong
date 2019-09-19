const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;
var socketsIds = [];
var socketIdServer;

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){

	var clients = io.sockets.clients();

	socketsIds.push(socket.id);

   	socket.emit('askLocation', socket.id);

   	socket.on('disconnect', function (){

	  console.log("disconnected: "+socket.id); // this.id is the 'id' of the socket that got disconnected

	  	var index = socketsIds.indexOf(socket.id);

		if (index > -1) {
		  socketsIds.splice(index, 1);
		}

		console.log(socketsIds);

		console.log("total: "+io.engine.clientsCount);

		socket.broadcast.emit('updateQue', socketsIds);
	
	});

	socket.on('quit', function(data){

		console.log("user to be disconnected "+data.id);

		io.sockets.sockets[data.id].disconnect();

		var index = socketsIds.indexOf(data.id);

		if (index > -1) {
		  socketsIds.splice(index, 1);
		}

		console.log(socketsIds);

		console.log("total: "+io.engine.clientsCount);

		socket.broadcast.emit('updateQue', socketsIds);

	});

	socket.on('getMyQue', function(){

		socket.emit('updateQue', socketsIds);

	});

	socket.on('control', function(event){

        // socket.emit('serveSwipeData', {stageX: event.x, stageY: event.y});
        socket.broadcast.to(socketsIds[0]).emit('serveSwipeData', {stageX: event.x, stageY: event.y});
    });

	console.log("total: "+io.engine.clientsCount);
	console.log(socketsIds);
});

http.listen(port, function(){
  console.log('listening on *:8080');
});
