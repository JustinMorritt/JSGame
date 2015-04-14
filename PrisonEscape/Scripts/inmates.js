﻿prison.inmates = (function () {

    var numInmates,
        game, 
        sPositions  = [], //Spawns
        inmatesA = [],
        inmateNames = [],
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
        game = prison.game;
        numInmates = prison.settings.inmates;
        inmateNames = game.getInmateNames(); //Array of Random Inmate Names

       /*
        console.log("1Inmate Name:" + inmateNames[0])
        console.log("2Inmate Name:" + inmateNames[1])
        console.log("3Inmate Name:" + inmateNames[2])
        console.log("4Inmate Name:" + inmateNames[3])
        console.log("5Inmate Name:" + inmateNames[4])
        console.log("6Inmate Name:" + inmateNames[5])
        console.log("7Inmate Name:" + inmateNames[6])
        */

        spawnInmates();
    }

    function spawnInmates()
    {
        //get spawn positions!!
        var spawnPos = prison.map.getSpawns();

        for (var i = 0 ; i < numInmates; i ++)
        {
            Sprite = new Image();
            Sprite.src = "Images/$Char"+ i +".png";

            var newInmate = {   
                sx: 0,
                sy: 0,
                pos: new Victor(spawnPos[0].x, spawnPos[0].y),  //Position
                v: new Victor(0, 0),                            //Velocity
                c: new Victor(0, 0),                            //Center
                onT: new Victor(0, 0),                          //On Tile
                speed: 200,                                     //Speed
                accel: 20,                                      //Acceleration
                sdspeed: 40,                                    //SlowDownSpeed
                name: inmateNames[i],
                sprite: Sprite,
                health: 100,
                respect: 100                                   //Decrease Respect when player bumps into them  if no respect HURT player
            }
            prison.map.shiftSpawn();
            inmatesA.push(newInmate);
        }
    }

    function draw()
    {

    }
    function update()
    {

    }

    function seeInmateStats()
    {
        var num = 0;
        for (var i = 0 ; i < numInmates; i++)
        {
            num++;
            console.log("Inmate " + num + " Name: " + inmatesA[i].name);
            console.log("Inmate " + num + " Pos: " + inmatesA[i].pos.x + " " + inmatesA[i].pos.y);
        }
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
        seeInmateStats: seeInmateStats,
        run: run,
        update: update,
        draw: draw,
        //dPosCB: dPosCB,
        initialize: initialize
    };
})();