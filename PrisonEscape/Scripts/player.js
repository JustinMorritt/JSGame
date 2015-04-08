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
        x = 10;
        y = 10;
        pSpeed = 200;

        pWidth = 32;
        pHeight = 32;
        pHP = 100; //Health
        pName = prison.settings.name;

        playerSprite = new Image();
        playerSprite.addEventListener(
            "load", callback, false);
        playerSprite.src =
            "Images/$Char2.png";

        window.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37: // left arrow
                    controls.left = true;
                    //console.log("LEFT PUSHED");
                    break;
                case 38: // up arrow
                    controls.up = true;
                    break;
                case 39: // right arrow
                    controls.right = true;
                    break;
                case 40: // down arrow
                    controls.down = true;
                    break;
            }
        }, false);

        window.addEventListener("keyup", function (e) {
            switch (e.keyCode) {
                case 37: // left arrow
                    controls.left = false;
                    break;
                case 38: // up arrow
                   controls.up = false;
                    break;
                case 39: // right arrow
                    controls.right = false;
                    break;
                case 40: // down arrow
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
        if (controls.left)  {        x -= pSpeed * step; }
        if (controls.up)    {        y -= pSpeed * step; }
        if (controls.right) {        x += pSpeed * step; }
        if (controls.down)  {        y += pSpeed * step; }

     

       
    // don't let player leaves the world's boundary
        if (x - pWidth / 2 < 0)
        {
           x = pWidth / 2;
        }
        if (y - pHeight / 2 < 0)
        {
            y = pHeight / 2;
        }
        if (x + pWidth / 2 > worldWidth)
        {
            x = worldWidth - pWidth / 2;
        }
        if (y + pHeight / 2 > worldHeight)
        {
            y = worldHeight - pHeight / 2;
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
    function setSpeed(speed)
    {
        pSpeed
    }
    return {
        //EXPOSED FUNCTIONS IN HERE
        getY: getY,
        getX: getX,
        run: run,
        update: update,
        draw : draw,
        initialize: initialize

    };
})();