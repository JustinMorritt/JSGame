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
        pSpeed = 400; //originally 200

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
    function setSpeed(speed)
    {
        pSpeed = speed;
    }

    return {
        //EXPOSED FUNCTIONS IN HERE
        getY: getY,
        getX: getX,
        setSpeed: setSpeed,
        run: run,
        update: update,
        draw : draw,
        initialize: initialize

    };
})();