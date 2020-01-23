

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

	  console.log("disconnected: "+socket.id);

	  	var index = socketsIds.indexOf(socket.id);

		if (index > -1) {
		  socketsIds.splice(index, 1);
		}

		console.log(socketsIds);

		socket.broadcast.emit('updateQue', socketsIds);
	
	});

	socket.on('play', function(){

		socket.broadcast.to(socketsIds[0]).emit('startGame');
		console.log("now playing...");

	});

	socket.on('lose', function(){


		socket.broadcast.to(socketsIds[1]).emit('displayTryAgain');

		io.sockets.sockets[socketsIds[1]].disconnect();

	});

	socket.on('win', function(){

		socket.broadcast.to(socketsIds[1]).emit('displayCoupon');

		io.sockets.sockets[socketsIds[1]].disconnect();

	});

	socket.on('getMyQue', function(){

		socket.emit('updateQue', socketsIds);

	});

	socket.on('control', function(event){

        if (socketsIds[1] == event.id)
        socket.broadcast.to(socketsIds[0]).emit('serveSwipeData', {stageX: event.x, stageY: event.y});
    });

    socket.on('sendDataToServer', function(data){

    	console.log(data);

    	//zero id == host
        socket.broadcast.to(socketsIds[0]).emit('sendDataToHost', data);

    });

    socket.on('sendCounterToServer', function(data){

    	console.log(data);

    	//one id == player
        socket.broadcast.to(socketsIds[1]).emit('sendDataToPlayer', data);

    });

	console.log("total: "+io.engine.clientsCount);
	console.log(socketsIds);
});

http.listen(port, function(){
  console.log('listening on *:8080');
});

