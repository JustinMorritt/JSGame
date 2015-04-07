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
        playerSprite;


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
    }

    function update(step, worldWidth, worldHeight)
    {
        // parameter step is the time between frames ( in seconds )
        if (Game.controls.left)
           x -= speed * step;
        if (Game.controls.up)
           y -= speed * step;
        if (Game.controls.right)
           x += speed * step;
        if (Game.controls.down)
           y += speed * step;


        // don't let player leaves the world's boundary
    }
 
    function draw(context, xView, yView)// camera.xView, camera.yView
    {
        xView = 0; //these will eventually be camera positions

        yView = 0;

        context.save();
        //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);
        context.drawImage(playerSprite, 0, 0, 32, 32, x, y, pWidth, pHeight);

        context.restore();
        console.log("DREW PLAYER");
    }


    return {
        //EXPOSED FUNCTIONS IN HERE
        run: run,
        update: update,
        draw : draw,
        initialize: initialize

    };
})();