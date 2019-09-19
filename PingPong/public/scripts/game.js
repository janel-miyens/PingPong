    
	var stage, canvasWidth, canvasHeight, ball, key, playerPadding, botPadding, playerScore, botScore, mouseX, mouseY, swiperStage;
	var swiperWidth, swiperHeight, time, frameCount, center, player, winPoints;

$(document).ready(function(){

    player = {
        
            imageURL: "images/avatar.png",
            foodURL: "images/food.png",
            qrCodeURL: "images/qrCode.png",
            imageLoader: "images/loader.gif"
    };

    initialize();
	
    $("#loginButton").on("click", serverPlay);
    $("#continueButton").on("click", continueGame);
    $("#playAgainButton").on("click", reload);

    socket.on('startGame', function(){

      play();

    });

    socket.on('serveSwipeData', function(evt){

        mouseX = evt.stageX;
        mouseY = evt.stageY;

    });

    socket.on('displayCoupon', function(){

        $("#nonGameComponent").removeClass("hide");
        $("#win").removeClass("hide");
        $("#playAgain").addClass("hide");
        $("#foodPhoto").append('<img class = "image" src="' + player.foodURL + '">');
        $("#qrCode").append('<img class = "image" src="' + player.qrCodeURL + '">');

    });

    socket.on('displayTryAgain', function(){

        $("#nonGameComponent").removeClass("hide");
        $("#win").addClass("hide");
        $("#playAgain").removeClass("hide");

    });

    function play(){

        $("#win").addClass("hide");
        $("#playAgain").addClass("hide");

        createjs.Ticker.addEventListener("tick", update);
    }

    function loadComplete(img, imageLoader){
        $(img).removeClass('hide');
        $(imageLoader).addClass('hide');
    }

    function restartGame(){

        playerScore = 0;
        botScore = 0;
        time = 10;
        frameCount = 0;

        ball.x =  center.x;
        ball.y =  center.y;

        playerPadding.y = center.y;
        botPadding.y = center.y;

        $(".playerScore").text(playerScore);
        $(".timeCD").text(time);
    }

    function winGame(){


        pauseGame();
        socket.emit("win");

    }

    function continueGame(){

        pauseGame();
        socket.emit("lose");
    }

    function reload(){
        location.reload();
    }



    function pauseGame(){
         createjs.Ticker.removeEventListener("tick", update);
         restartGame();
    }

    function initialize(){

        playerScore = 0;
        botScore = 0;
        time = 10;
        frameCount = 0;
        winPoints = 5; 

        $("#userImage").append('<img src="' + player.imageURL + '">');


        //Create a stage by getting a reference to the canvas
        stage = new createjs.Stage("gameScene");
        canvasWidth = stage.canvas.width;
        canvasHeight = stage.canvas.height;

        swiperStage = new createjs.Stage("userInterface");
        swiperWidth = swiperStage.canvas.width;
        swiperHeight = swiperStage.canvas.height;

        center = {
            x: canvasWidth/2,
            y: canvasHeight/2
        };

        window.addEventListener("keydown",function(e){
            key = (key || []);
            key[e.keyCode] = (e.type == "keydown");
        });

        window.addEventListener("keyup",function(e){
            key = (key || []);
            key[e.keyCode] = (e.type == "keydown");
        });

         
        ball = new gameBall("black", center.x, center.y, 3, 2);
        playerPadding = new gamePadding("cyan", 10,  center.y, 2.5, 25);
        botPadding = new gamePadding("orange", canvasWidth - 10, center.y, 2.5, 25);

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        swiperStage.addEventListener("stagemousemove", swipeControl);
        createjs.Touch.enable(swiperStage);

        $("#loader").css("display","none");
    }

    function gameBall(color, x, y, r, speed){

        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill(color).drawCircle(0, 0, r);
        this.shape.regX = r/2;
        this.shape.regY = r/2;
        this.shape.x = x;
        this.shape.y = y;
        this.dirX = 1;
        this.dirY = 1;
        this.r = r;
        this.speed = speed;

        this.move = function(){
            this.shape.x += this.dirX * this.speed;
            this.shape.y += this.dirY * this.speed;
        }

        this.collideOnPadding = function(padding,direction){
            if(collidesWith(this,padding)){
                this.dirX = direction;

                this.pinBall(padding);
            }
        }

        this.pinBall = function(padding){
            if(padding.dirY == -1){
                this.dirY = -1;
            }
            else if(padding.dirY == 1){
                this.dirY = 1;
            }

            if(padding.dirY == this.dirY){
                this.speed += 0.5;
            }
        }


        this.edgeBound = function(){

            if(this.shape.x + this.r/2 > canvasWidth + 100)this.dirX = -1;
            else if(this.shape.x - this.r < 0 - 100)this.dirX = 1;

            if(this.shape.y + this.r/2 > canvasHeight)this.dirY = -1;
            else if(this.shape.y - this.r < 0)this.dirY = 1;
        }

        this.outOfBound = function(resetSpeed){

            //player scores
            if(this.shape.x + this.r/2 > canvasWidth + 50){

                playerScore++;
                $(".playerScore").text(playerScore);
                this.shape.x = center.x;
                this.shape.y = center.y;
                this.dirX = -1;
                this.speed = resetSpeed;
            }
            //bot scores
            else if(this.shape.x - this.r < 0 - 50){
                botScore++;
                $(".botScore").text(botScore);

                this.shape.x = center.x;
                this.shape.y = center.y;
                this.dirX = 1;
                this.speed = resetSpeed;
            }
        }

        stage.addChild(this.shape);
    }

    function gamePadding(color, x, y, w, h){

        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill(color).drawRect(0, 0, w, h);
        this.shape.regX = w/2;
        this.shape.regY = h/2;
        this.shape.x = x;
        this.shape.y = y;
        this.w = w;
        this.h = h;
        this.dirX = 0;
        this.dirY = 0;
        this.count = 0;

        this.move = function(speed){
            this.shape.x += this.dirX * speed;
            this.shape.y += this.dirY * speed;
        }

        this.edgeBound = function(){
            if(this.shape.y + h/2 > canvasHeight)this.dirY = -1;
            else if(this.shape.y - h/2 < 0)this.dirY = 1;
        }

        this.playerControl = function(){

            if(keyDown(38))this.dirY = -1;
            else if(keyDown(40))this.dirY = 1;
            else{ this.dirY = 0;}
        }

        this.countInterval = function(interval){
            this.count++;
            if(this.count > interval){
                this.count = 0;
                return true;
            }
            return false;
        }

        //control also with mouse and swipe touch
        this.mouseControl = function(){

            var pointOnPadding = mouseY > this.shape.y - this.h/2 && mouseY < this.shape.y + this.h/2;

            if(pointOnPadding == false){
                if(this.shape.y < mouseY)this.dirY = 1;
                else if(this.shape.y > mouseY)this.dirY = -1;
            }
            else{
                this.dirY = 0;
            }
        }

        this.botControl = function(objBall){

            if(objBall.shape.x < canvasWidth/1.5){
                
                if(this.countInterval(100)){
                    //give random value between -1, 0 ,1
                    this.dirY = Math.floor((Math.random() * 3)) - 1;
                }
            }
            else if(objBall.shape.x > canvasWidth/1.5){

                if(this.shape.y < objBall.shape.y)this.dirY = 1;
                else if(this.shape.y > objBall.shape.y)this.dirY = -1;
        
            }
        }


        stage.addChild(this.shape);
    }


    function update(){

        frameCount++;

        //60 frame = 1 seconds
        if(frameCount > 60 && time != 0){
            frameCount = 0;
            time--;
            $(".timeCD").text(time);

            if(time == 0){
                if(playerScore >= winPoints){
                    winGame();
                }
                else{
                    continueGame();
                }
            }
        }

        ball.move();
        ball.edgeBound();
        ball.collideOnPadding(playerPadding, 1);
        ball.collideOnPadding(botPadding, -1);
        ball.outOfBound(2);


        playerPadding.move(2);
        //playerPadding.playerControl();
        playerPadding.mouseControl();
        playerPadding.edgeBound();

        botPadding.move(1);
        botPadding.botControl(ball);
        botPadding.edgeBound();
        
        stage.update();

    }

    function swipeControl(evt){
        // mouseX = evt.stageX;
        // mouseY = evt.stageY;
        socket.emit("control", {id: myId, x: evt.stageX, y:evt.stageY});
    }

    function keyDown(keyCode){
        return key && key[keyCode];
    }

    function collidesWith(obj, otherObj){

        var objWidth = obj.shape.x + obj.r/2 > otherObj.shape.x - otherObj.w/2 && obj.shape.x - obj.r < otherObj.shape.x + otherObj.w/2;
        var objHeight = obj.shape.y + obj.r/2 > otherObj.shape.y - otherObj.h/2 && obj.shape.y - obj.r/2 < otherObj.shape.y + otherObj.h;

        return objWidth && objHeight;
    }

});









    