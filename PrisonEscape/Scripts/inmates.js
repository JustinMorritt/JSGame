prison.inmates = (function () {

    var numInmates,
        sPositions  = [], //Spawns
        inmatesA    = [],
        DIR = { UP: 0, UPRIGHT: 1, RIGHT: 2, DOWNRIGHT: 3, DOWN: 4, DOWNLEFT: 5, LEFT: 6, UPLEFT: 7 },

    controls = {
        left    : false,
        up      : false,
        right   : false,
        down    : false,},
    slowDown = {
        left    : false,
        up      : false,
        right   : false,
        down    : false,}

    function run()
    {
        initialize(console.log("initialized inmates"));
    }

    function initialize(callback) {
        numInmates = prison.settings.inmates;
        spawnInmates();
    }

    function spawnInmates()
    {
        //get spawn positions!!

        for (var i = 0 ; i < numInmates; i ++)
        {
            //Sprite = new Image();
            //Sprite.addEventListener("load", callback, false);
            //Sprite.src = "Images/$Char"+ i +".png";


            var newInmate = {   
                sx: 0,
                sy: 0,
             // pos: new Victor(spawnPos[i].x, spawnPos[i].y),  //Position
                v: new Victor(0, 0),                            //Velocity
                c: new Victor(0, 0),                            //Center
                onT: new Victor(0, 0),                          //On Tile
                speed: 200,                                     //Speed
                accel: 20,                                      //Acceleration
                sdspeed: 40,                                    //SlowDownSpeed
               // name: nameList[i],
               //sprite: Sprite,
                health: 0,
                respect: 100                                   //Decrease Respect when player bumps into them  if no respect HURT player
            }
           // inmates.push()
        }
    }

    function draw()
    {

    }
    function update()
    {

    }

    //GETTERS SETTERS
    function getX() {
        return x;
    }
    function getY() {
        return y;
    }
    function getOnTile() {
        return onTile;
    }
    function getPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        return pColBlocks;
    }
    function setXY(x, y) {
        x = x;
        y = y;
    }
    function setSpeed(speed) {
        pSpeed = speed;
    }
    function setSlowDownSpeed(speed) {
        slowDownSpeed = speed;
    }
    function setVX(vx) {
        vx = vx;
    }
    function setVY(vy) {
        vy = vy;
    }
    function getVX() {
        return vx;
    }
    function getVY() {
        return vy;
    }

    return {
        //EXPOSED FUNCTIONS IN HERE
        setVX: setVX,
        setVY: setVY,
        getVX: getVX,
        getVY: getVY,
        getY: getY,
        getX: getX,
        setXY: setXY,
        setSpeed: setSpeed,
        setSlowDownSpeed: setSlowDownSpeed,
        run: run,
        update: update,
        draw: draw,
        //dPosCB: dPosCB,
        initialize: initialize
    };
})();