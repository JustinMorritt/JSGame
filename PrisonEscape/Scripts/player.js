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
    }

    function update(step, worldWidth, worldHeight)
    {
        // parameter step is the time between frames ( in seconds )
        if (Game.controls.left)
            this.x -= this.speed * step;
        if (Game.controls.up)
            this.y -= this.speed * step;
        if (Game.controls.right)
            this.x += this.speed * step;
        if (Game.controls.down)
            this.y += this.speed * step;


        // don't let player leaves the world's boundary
    }
 
    function draw(context, xView, yView)// camera.xView, camera.yView
    {

       
    }


    return {
        //EXPOSED FUNCTIONS IN HERE
        run: run,
        update: update,
        draw : draw,
        initialize: initialize
       
     
    };
})();