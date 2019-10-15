
    var socket = io().connect();
    var myId;
    var myQue;
    var playAreaLat = 14.669939099999999;
    var playAreaLon = 120.98551709999998;
    var initialY, initialX, gameTimeOut;
    var isPlaying = false;

    //coupon, wholename, email, score, win
    var retrieveAllData = [0, null, null, 0, "no"];

    socket.on('askLocation', function(id){

        myId = id;

        getLocation();//disable this if no internet connection to continue
              
        // socket.emit('getMyQue');

    });

    socket.on('handleSignInClick', function(){

      handleSignInClick();
    });

     socket.on('showGameArea', function(){

       if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
       // some code..

         socket.emit("disconnectInvalidHost");
      
      }else{


          $("#introduction").hide();
          $("#nonGameComponent").hide();
          $(".controller").hide();
          showGameUi();

       }

     });

     socket.on('yourTurn', function(){

       myQue = 0;

        $(".notification").hide();
        $(".que-notif").hide();
        $("#introduction").show();
        showControlUi();

        gameTimeOut = setTimeout(function(){

              if (isPlaying == false){

                socket.emit('loginTimeout');

                alert("Login timeout!");

              }

            }, 120000);

     });

     socket.on('yourNext', function(){

       myQue = 1;

        $("#nonGameComponent").show();
         
          $("#introduction").hide();

          $(".que-notif").show();

          $(".notification-text").text("You are the next player");

     });

    socket.on('updateQue', function(pos){

       myQue = pos;
          
          $("#nonGameComponent").show();

          $("#introduction").hide();

          $(".que-notif").show();

          $(".notification-text").text("Please standby you are no. "+ pos +" in QUE");

    });

    function getLocation() {

      if (navigator.geolocation) {
        
        navigator.geolocation.getCurrentPosition(showPosition, errorCallback);

      } 
      else {
        
        x.innerHTML = "Geolocation is not supported by this browser.";
      
      }

    }

    function showPosition(position) {

        getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, playAreaLat, playAreaLon);
     
    }

    function errorCallback(error){

      if (error.code == error.PERMISSION_DENIED) {

        $("#unLocatedUser > div").text("You need to allow the location to play the game");
        console.log("user denied request");

      }
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

      //console.log("getting location: "+d);

      if (d = ""){

          $("#unLocatedUser > div").text("You need to allow the location to play the game");


          socket.emit('quit', { id: myId });
      
      }else{
          
          if (d > 2){
              
              socket.emit('quit', { id: myId });

          }else{

              // socket.emit('getMyQue');

          }
      }
      
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180);
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
        isPlaying = true;
        clearTimeout(gameTimeOut);

    }

    socket.on('sendDataToHost', function(data){

          // send data to HOST DOMAIN

          $("#userImage").css("background","url("+data.imageUrl+")");

          retrieveAllData[1] = data.firstName+" "+data.lastName;
          retrieveAllData[2] = data.email;

          console.log("data send to host: "+retrieveAllData);
    });

        