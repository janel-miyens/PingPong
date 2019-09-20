
    var socket = io();
    var myId;
    var myQue;
    var playAreaLat = 14.669939099999999;
    var playAreaLon = 120.98551709999998;
    var initialY, initialX;

    socket.on('askLocation', function(id){

        myId = id;

        // getLocation();//disable this if no internet connection to continue

        socket.emit('getMyQue');

    });


    socket.on('chat', function(data){

        $('#output').append('<div id="left-align"><span id="name">'+data.user+' :'+'</span>'+'<span id="inbound">'+data.message+'</span></div>');
        
    });

    socket.on('updateQue', function(arr){

        var pos = arr.indexOf(myId);

        if (pos == -1){

          gameOver();

        }else if (pos == 0){

            showGameUi();

        }else if (pos == 1){

          $(".notification").hide();
            showControlUi();
            
        
        }else if  (pos == 2){

          $("#nonGameComponent").show();
         
          $("#introduction").hide();

        	$(".que-notif").show();

          $(".notification-text").text("You are the next player "+myId);
        
        }else{
          
          $("#nonGameComponent").show();

          $("#introduction").hide();

          $(".que-notif").show();

          $(".notification-text").text("Please standby you are "+pos+" in QUE");

        }
    });

    function getLocation() {

      if (navigator.geolocation) {
        
        navigator.geolocation.getCurrentPosition(showPosition);
      
      } else {
        
        x.innerHTML = "Geolocation is not supported by this browser.";
      
      }

    }

    function showPosition(position) {

        getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, playAreaLat, playAreaLon);
     
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {

      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km

      if (d = ""){

          $(".notification").text("You need to allow location to play the game");

          socket.emit('quit', { id: myId });
      
      }else{
          
          if (d > 2){
              
              socket.emit('quit', { id: myId });

          }else{

              socket.emit('getMyQue');

          }
      }
      
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }


    function showGameUi(){

      $("#gameContainer").show();
            
    }

    function showControlUi(){
      $("#nonGameComponent").show();
        $(".controller").show();
    }

    function gameOver(){

        return;

    }

     function serverPlay(){

       $(".que-notif").hide();
       $("#nonGameComponent").addClass("hide");
       $("#userInterface").show();
       $("#introduction").addClass("hide");
        socket.emit('play');

    }