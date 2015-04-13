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
        playerMagnitude,
        slowDownSpeed,
        acceleration,

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
        x                   = 1000;
        y                   = 1000;
        vx                  = 0;
        vy                  = 0;
        acceleration        = 20;
        slowDownSpeed       = 40;
        pSpeed              = 400; //originally 200
        blockWidth          = 32;
        pWidth              = 32;
        pHeight             = 32;
        playerMagnitude     = 0;
        pHP                 = 100; //Health
        getColBlockNum      = prison.map.getColBlockNum();
        pName               = prison.settings.name;
     
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

        //ACCELERATION
        if (controls.left)  { if (vx != -pSpeed) { vx -= acceleration; if (vx < -pSpeed) { vx = -pSpeed } } checkCollision(); }
        if (controls.up)    { if (vy != -pSpeed) { vy -= acceleration; if (vx < -pSpeed) { vx = -pSpeed } } checkCollision(); }
        if (controls.right) { if (vx != pSpeed)  { vx += acceleration; if (vx > pSpeed)  { vx = pSpeed  } } checkCollision(); }
        if (controls.down)  { if (vy != pSpeed)  { vy += acceleration; if (vx > pSpeed)  { vx = pSpeed  } } checkCollision(); }

        //ATTEMPT TO MOVE NOW , Collision should set the velocitys to 0 if hit
        x += vx * step;
        y += vy * step;

        //DECELERATION
        if (slowDown.left)  { vx += slowDownSpeed; if (vx > 0) { slowDown.left  = false; vx = 0 } }
        if (slowDown.up)    { vy += slowDownSpeed; if (vy > 0) { slowDown.up    = false; vy = 0 } }
        if (slowDown.right) { vx -= slowDownSpeed; if (vx < 0) { slowDown.right = false; vx = 0 } }
        if (slowDown.down)  { vy -= slowDownSpeed; if (vy < 0) { slowDown.down  = false; vy = 0 } }


        function checkCollision()
        {
            for (var i = 0; i < getColBlockNum ; i++)
            {
                var PL = x;
                var PR = x + blockWidth;
                var PT = y;
                var PB = y + (blockWidth-14);
                var PCenterX = PL + 16 ;
                var PCenterY = PT + 16;
                playerMagnitude = Math.sqrt(Math.pow(PCenterX, 2) + Math.pow(PCenterY, 2));

                //Only continue checking blocks with closer distances
                if (collsionBlocks[i].Mag - playerMagnitude < 50)
                {
                    continue;
                }
             
                var colBlockX = collsionBlocks[i].X;
                var colBlockR = collsionBlocks[i].X + 32;
                var colBlockTOP = collsionBlocks[i].Y;
                var colBlockBOT = collsionBlocks[i].Y +32;

                var B = { X: collsionBlocks[i].Cx, Y: collsionBlocks[i].Cy };
                var P = { X: PCenterX, Y: PCenterY };

                var OL = prison.collision.collisionCheck(P, B);
            }
        }
 
        //Dont Leave world 
        if (x - pWidth / 2 < 0)
        {
           x = pWidth / 2;
        }
        if (y - pHeight / 2 < 0)
        {
            y = pHeight / 2;
        }
        if (x + (pWidth * 1.5) > worldWidth)
        {
            x = worldWidth - (pWidth*1.5) ;
        }
        if (y + (pHeight * 1.5) > worldHeight)
        {
            y = worldHeight - (pHeight*1.5) ;
        }
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


    //GETTERS SETTERS
    function getX()
    {
        return x;
    }
    function getY()
    {
        return y;
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
        initialize      :initialize
    };
})();