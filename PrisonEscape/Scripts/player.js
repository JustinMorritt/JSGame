prison.player = (function () {
    var x,
        y,
        vx,
        vy,
        pSpeed,
        pWidth,
        pHeight,
        pHP,
        pName,
        pOffences,
        pTime,
        playerSprite,
        collsionBlocks,
        blockWidth,
        getColBlockNum,
        slowDownSpeed,
        acceleration,
        center,
        onTile,
        pColBlocks, //Possible Collision Blocks Array.

    controls = {
        left    : false,
        up      : false,
        right   : false,
        down    : false,}
    slowDown = {
        left    : false,
        up      : false,
        right   : false,
        down    : false,}

    function run() {
        initialize(console.log("initialized player"));
    }

    function initialize(callback)
    {

       // var spawnPos = prison.map.getSpawns();
       // var index = array.indexOf(5);
        x                   = 1000//spawnPos[0].x; //USE THIS TO GRAB A RANDOM SPAWN POSITION
        y                   = 1000//spawnPos[0].y;
        vx                  = 0;
        vy                  = 0;
        center              = new Victor(0, 0);
        onTile              = new Victor(0, 0);
        acceleration        = 20;
        slowDownSpeed       = 40;
        pSpeed              = 200; //originally 200
        blockWidth          = 32;
        pWidth              = 32;
        pHeight             = 32;
        playerMagnitude     = 0;
        pHP                 = 100; //Health
        getColBlockNum      = prison.map.getColBlockNum();
        pName               = prison.settings.name;
        pColBlocks          = [];

        playerSprite = new Image();
        playerSprite.addEventListener("load", callback, false);
        playerSprite.src ="Images/$Char2.png";

        //GET ARRAY OF COLLISION BLOCKS 
        collsionBlocks = prison.map.getCollisions();


        window.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:
                case 65: // left arrow
                    controls.left = true;
                    slowDown.left = false;
                    break;
                case 38: // up arrow
                case 87:
                    controls.up = true;
                    slowDown.up = false;
                    break;
                case 39:
                case 68: // right arrow
                    controls.right = true;
                    slowDown.right = false;
                    break;
                case 40:
                case 83: // down arrow
                    controls.down = true;
                    slowDown.down = false;
                    break;
            }
        }, false);

        window.addEventListener("keyup", function (e) {
            switch (e.keyCode) {
                case 37:
                case 65: // left arrow
                    controls.left = false;
                    slowDown.left = true;
                    //vx = 0;
                    break;
                case 38:
                case 87: // up arrow
                    controls.up = false;
                    slowDown.up = true;
                    //vy = 0;
                    break;
                case 39:
                case 68: // right arrow
                    controls.right = false;
                    slowDown.right = true;
                    //vx = 0;
                    break;
                case 40:
                case 83: // down arrow
                    controls.down = false;
                    slowDown.down = true;
                    //vy = 0;
                    break;
                case 80: // key P pauses the game
                    prison.display.togglePause();
                    break;
            }
        }, false);
    }


    function update(step, worldWidth, worldHeight)
    {
        // parameter step is the time between frames ( in seconds )

        
     

        //Update Potential Collision Blocks 
        possibleCollisionBlocks();

        //ACCELERATION
        if (controls.left)  { if (vx != -pSpeed) { vx -= acceleration; if (vx < -pSpeed) { vx = -pSpeed } } }
        if (controls.up)    { if (vy != -pSpeed) { vy -= acceleration; if (vx < -pSpeed) { vx = -pSpeed } } }
        if (controls.right) { if (vx != pSpeed)  { vx += acceleration; if (vx > pSpeed)  { vx = pSpeed  } } }
        if (controls.down)  { if (vy != pSpeed)  { vy += acceleration; if (vx > pSpeed)  { vx = pSpeed  } } }

        x += vx * step;
        y += vy * step;

        //Update Center Vector
        center.x = x + 16; center.y = y + 16;
        onTile.x = Math.round(center.x / 32); onTile.y = Math.round(center.y / 32);


        var collisionCorrection = new Victor(0, 0);
        var temp = new Victor(0, 0);

        for (var i = 0 ; i < 9; i++)
        {
            if (collsionBlocks[pColBlocks[i].x-1][pColBlocks[i].y-1].Type != "0") //RIDICULOUS REFERENCE BUT WORKS GREAT HAHA
            {
                //console.log("****Possible Collision Block Near!****");
                temp = prison.collision.collisionCheck(center, collsionBlocks[pColBlocks[i].x - 1][pColBlocks[i].y - 1]);
                if (Math.abs(temp.x) > Math.abs(collisionCorrection.x) &&
                    Math.abs(temp.x) > Math.abs(collisionCorrection.y) ||
                    Math.abs(temp.y) > Math.abs(collisionCorrection.y) &&
                    Math.abs(temp.y) > Math.abs(collisionCorrection.x)){
                    collisionCorrection = temp;
                    //console.log("Temp CLone: x " + temp.x + " y " + temp.y)
                }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrection.x != 0 || collisionCorrection.y != 0)
        {
            console.log("attempting to correct!.." + collisionCorrection.x + " " + collisionCorrection.y)
            x += collisionCorrection.x;
            y += collisionCorrection.y;
        }

        //DECELERATION
        if (slowDown.left)  { vx += slowDownSpeed; if (vx > 0) { slowDown.left  = false; vx = 0 } }
        if (slowDown.up)    { vy += slowDownSpeed; if (vy > 0) { slowDown.up    = false; vy = 0 } }
        if (slowDown.right) { vx -= slowDownSpeed; if (vx < 0) { slowDown.right = false; vx = 0 } }
        if (slowDown.down)  { vy -= slowDownSpeed; if (vy < 0) { slowDown.down  = false; vy = 0 } }

        //Dont Leave world  or ***WIN GAME IF HITS THE OUTTER SIDES**
        if (x - pWidth / 2 < 0)                 {x = pWidth / 2;}
        if (y - pHeight / 2 < 0)                {y = pHeight / 2;}
        if (x + (pWidth * 1.5) > worldWidth)    {x = worldWidth - (pWidth * 1.5);}
        if (y + (pHeight * 1.5) > worldHeight)  {y = worldHeight - (pHeight * 1.5);}

        //console.log("On tile: " + onTile.x + " " + onTile.y);
    }
 
    function draw(step, context, xView, yView)// camera.xView, camera.yView
    {

        xView = xView; //these will eventually be camera positions
        yView = yView;

        context.save();
        //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);
        var newX = (x-pWidth/2) - xView;
        var newY = (y-pHeight/2) - yView;

        context.drawImage(playerSprite, 32, 0, 32, 32, newX, newY, pWidth, pHeight);
        
        context.restore();
        //console.log("DREW PLAYER X:" +x+ " Y: " +y );
    }

    //HELPER FUNCTIONS
    function possibleCollisionBlocks()
    {
        pColBlocks = []; //Empty Current
        //CHECK IF ITS OFF MAP GRID < 0
        if (onTile.x - 1 <= 0 || onTile.y - 1 <= 0)
        {
            pColBlocks[0] = new Victor(onTile.x, onTile.y);         //Topleft
            pColBlocks[2] = new Victor(onTile.x, onTile.y);         //BotLeft
            pColBlocks[4] = new Victor(onTile.x, onTile.y);         //Left
            pColBlocks[6] = new Victor(onTile.x, onTile.y);         //Above
            pColBlocks[1] = new Victor(onTile.x, onTile.y);         //TopRight
        }
        else
        {
            pColBlocks[1] = new Victor(onTile.x + 1, onTile.y - 1); //TopRight
            pColBlocks[0] = new Victor(onTile.x - 1, onTile.y - 1); //Topleft
            pColBlocks[2] = new Victor(onTile.x - 1, onTile.y + 1); //BotLeft
            pColBlocks[4] = new Victor(onTile.x - 1, onTile.y    ); //Left
            pColBlocks[6] = new Victor(onTile.x,     onTile.y - 1); //Above
        }
        pColBlocks[3] = new Victor(onTile.x + 1, onTile.y + 1);     //BotRight
        pColBlocks[5] = new Victor(onTile.x + 1, onTile.y    );     //Right
        pColBlocks[7] = new Victor(onTile.x,     onTile.y + 1);     //Below
        pColBlocks[8] = new Victor(onTile.x,     onTile.y    );     //Your Current Tile
    }
    
    function dPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        var block = 0;
        for(var i = 0 ; i < 9; i ++)
        {
            block++;
            console.log("BLock " +block +" X:" +pColBlocks[i].x + " Y:" + pColBlocks[i].y)
        }
    }

    //GETTERS SETTERS
    function getX()
    {
        return x;
    }
    function getY()
    {
        return y;
    }
    function getOnTile()
    {
        return onTile;
    }
    function getPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        return pColBlocks;
    }
    function setXY(x,y) {
        x = x;
        y = y;
    }
    function setSpeed(speed)
    {
        pSpeed = speed;
    }
    function setSlowDownSpeed(speed) {
        slowDownSpeed = speed;
    }
    function setVX(vx)
    {
        vx = vx;
    }
    function setVY(vy) {
        vy = vy;
    }
    function getVX()
    {
        return vx;
    }
    function getVY() {
        return vy;
    }

    return {
        //EXPOSED FUNCTIONS IN HERE
        setVX           :setVX,
        setVY           :setVY,
        getVX           :getVX,
        getVY           :getVY,
        getY            :getY,
        getX            :getX,
        setXY           :setXY,
        setSpeed        :setSpeed,
        setSlowDownSpeed:setSlowDownSpeed,
        run             :run,
        update          :update,
        draw            :draw,
        dPosCB          :dPosCB,
        initialize      :initialize
    };
})();