

const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;
var socketsIds = [];
var socketIdNowPlaying;
var clients;

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){

	// clients = io.sockets.clients();

	clients = Object.keys(io.engine.clients);

	console.log(clients);
	
	socketsIds.push(socket.id);

   	socket.emit('askLocation', socket.id);

   	if (clients.length == 1){

		console.log("showGameArea");

   		socket.emit("showGameArea");

   	}

   	 for (var i = 1; i < clients.length; i++) {
			
			if (socket.id == clients[i]){

				switch(i) {
				  case 1:
				    // code block
				    io.to(socket.id).emit('yourTurn');
				    socketIdNowPlaying = socket.id;
				    break;
				  case 2:
				    // code block
				    io.to(socket.id).emit('yourNext');
				    break;
				  default:
				  	io.to(socket.id).emit('updateQue', i-1);
				    // code block
				}

				// io.sockets.connected[clients[i]].emit("yourTurn");

				// socket.broadcast.to(clients[i]).emit('yourTurn');
			}

			// if (i = 2){

			// 	socket.broadcast.to(clients[i]).emit('yourNext');
			// }

			// if (i > 2){

			// 	socket.broadcast.to(clients[i]).emit('updateQue', i);
			// }

		}

   	// if (clients[1]){

   	// 	console.log("Sadassa");
   	// 	io.to(socket.id).emit('yourTurn');

   	// }

   	// if (clients[2]){

   	// 	console.log("Sadassa");
   	// 	io.to(socket.id).emit('yourNext');
   		
   	// }

   	// if (clients[3]){

   	// 	console.log("Sadassa");
   	// 	io.to(socket.id).emit('updateQue', clients.length+1);
   		
   	// }


   	socket.on('disconnect', function (){

	  console.log("disconnected: "+socket.id);

	  clients = Object.keys(io.engine.clients);

	  console.log(clients);

	  	var index = socketsIds.indexOf(socket.id);

		if (index > -1) {
		  socketsIds.splice(index, 1);
		}


		for (var i = 1; i < socketsIds.length; i++) {
			
			// if (socket.id == clients[i]){

				switch(i) {
				  case 1:
				    // code block

				    if (socketsIds[i] != socketIdNowPlaying){

				    	console.log("ASsaas");

				    	io.to(socketsIds[i]).emit('yourTurn');

				    	socketIdNowPlaying = clients[i];
					}
				    break;
				  case 2:
				    // code block
				    io.to(socketsIds[i]).emit('yourNext');
				    break;
				  default:
				  	io.to(socketsIds[i]).emit('updateQue', i-1);
				    // code block
				}

			// }

		}
	
	});

	socket.on('disconnectInvalidHost', function(){

		io.sockets.sockets[socketsIds[0]].disconnect();

	});

	socket.on('loginTimeout', function(){

		io.sockets.sockets[socketsIds[1]].disconnect();

		socketIdNowPlaying = "";

	});

	socket.on('play', function(){

		socket.broadcast.to(socketsIds[0]).emit('startGame');

		playerSocketId = socketsIds[1];

		console.log("now playing...");

	});

	socket.on('lose', function(){

		socket.broadcast.to(socketsIds[1]).emit('displayTryAgain');

		io.sockets.sockets[socketsIds[1]].disconnect();

		socketIdNowPlaying = "";

	});

	socket.on('win', function(){

		socket.broadcast.to(socketsIds[1]).emit('displayCoupon');

		io.sockets.sockets[socketsIds[1]].disconnect();

		socketIdNowPlaying = "";

	});

	// socket.on('getMyQue', function(){

	// 	socket.emit('updateQue', socketsIds);

	// });

	socket.on('control', function(event){

        if (socketsIds[1] == event.id)

        socket.broadcast.to(socketsIds[0]).emit('serveSwipeData', {stageX: event.x, stageY: event.y});

    });

    socket.on('sendDataToServer', function(data){

    	//zero id == host
        socket.broadcast.to(socketsIds[0]).emit('sendDataToHost', data);

    });

    socket.on('sendCounterToServer', function(data){

    	//one id == player
        socket.broadcast.to(socketsIds[1]).emit('sendDataToPlayer', data);

    });

    socket.on('requestLocalStorageData', function(){

    	//the client ask for the localstorage
        socket.broadcast.to(socketsIds[0]).emit('getLocalStorageData');

    });

    socket.on('sendLocalStorageData', function(data){

    	//the server now get the local storage data
        socket.broadcast.to(socketsIds[1]).emit('giveLocalStorageDataToClient', data);

    });


});

http.listen(port, function(){

  console.log('listening on *:8080');

});

