prison.player = (function () {
    var x,
        y,
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
   

      
    controls = {
        left: false,
        up: false,
        right: false,
        down: false,
    }

    function run() {
        initialize(console.log("initialized player"));
    }

    function initialize(callback)
    {
        x = 1000;
        y = 1000;
        pSpeed = 400; //originally 200
        blockWidth = 32;
        pWidth = 32;
        pHeight = 32;
        playerMagnitude = 0;
        pHP = 100; //Health
        getColBlockNum = prison.map.getColBlockNum();
        pName = prison.settings.name;

        playerSprite = new Image();
        playerSprite.addEventListener(
            "load", callback, false);
        playerSprite.src =
            "Images/$Char2.png";


        collsionBlocks = prison.map.getCollisions();

        console.log(collsionBlocks[0].X + " Y:" + collsionBlocks[0].Y + "    X:" + collsionBlocks[1].X + "    Y:" + collsionBlocks[1].Y);


        window.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:
                case 65: // left arrow
                    controls.left = true;
                    break;
                case 38: // up arrow
                case 87:
                    controls.up = true;
                    break;
                case 39:
                case 68: // right arrow
                    controls.right = true;
                    break;
                case 40:
                case 83: // down arrow
                    controls.down = true;
                    break;
            }
        }, false);

        window.addEventListener("keyup", function (e) {
            switch (e.keyCode) {
                case 37:
                case 65: // left arrow
                    controls.left = false;
                    break;
                case 38:
                case 87: // up arrow
                   controls.up = false;
                    break;
                case 39:
                case 68: // right arrow
                    controls.right = false;
                    break;
                case 40:
                case 83: // down arrow
                    controls.down = false;
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
         if (controls.left)     {x -= pSpeed * step; checkCollision(); }
         if (controls.up)       {y -= pSpeed * step; checkCollision() ; }
         if (controls.right)    {x += pSpeed * step; checkCollision() ;}
         if (controls.down)     {y += pSpeed * step; checkCollision() ;}

    
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
                
                if (collsionBlocks[i].Mag - playerMagnitude > 50)
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
                //console.log("PX: " + PL + " PCX" + PCenterX + " PY: " + PT + " PCY: " + PCenterY)
                //check overlap
                /*
                
                switch(OL)
                {
                    //BOT HIT
                    case 1:
                        y = colBlockTOP - (blockWidth-14);
                        break;

                        //TOP HIT
                    case 2:
                        y = colBlockTOP - (blockWidth-14);
                        break;

                        //LEFT HIT
                    case 3:
                        // x = colBlockR;
                        break;

                        //RIGHT HIT
                    case 4:
                        //x = colBlockL + blockWidth;
                        break;

                    default:
                        //console.log("No collide");
                        break;
                }
                */
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

    return {
        //EXPOSED FUNCTIONS IN HERE
        getY: getY,
        getX: getX,
        setXY: setXY,
        setSpeed: setSpeed,
        run: run,
        update: update,
        draw : draw,
        initialize: initialize

    };
})();