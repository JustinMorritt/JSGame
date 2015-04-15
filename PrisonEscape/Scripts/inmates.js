﻿prison.inmates = (function () {

    var numInmates,
        game, 
        sPositions  = [], //Spawns
        inmatesA    = [],
        inmateNames = [],
        DIR = { UP: 0, UPRIGHT: 1, RIGHT: 2, DOWNRIGHT: 3, DOWN: 4, DOWNLEFT: 5, LEFT: 6, UPLEFT: 7, STILL: 8},

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

        for (var i = 1 ; i < numInmates+1; i ++)
        {
            Sprite = new Image();
            Sprite.src = "Images/$Char"+ i +".png";

            var randResp = prison.math.randomRange(20, 70);
            var randDir =  prison.math.randomRange(0, 8);

            var newInmate = {   
                sx: 0,
                sy: 0,
                dir: randDir,                                       //Direction
                pos: new Victor(spawnPos[0].x, spawnPos[0].y),      //Position
                cellPos: new Victor(spawnPos[0].x, spawnPos[0].y),  //Cell Position
                v: new Victor(0, 0),                                //Velocity
                c: new Victor(0, 0),                                //Center
                onT: new Victor(0, 0),                              //On Tile
                speed: 20,                                          //Speed
                accel: 20,                                          //Acceleration
                sdspeed: 40,                                        //SlowDownSpeed
                name: inmateNames[i],
                sprite: Sprite,
                health: 70,
                respect: randResp                                   //Decrease Respect when player bumps into them  if no respect HURT player
            }
            prison.map.shiftSpawn();
            inmatesA.push(newInmate);
        }
    }


    function update(step, worldWidth, worldHeight)
    {
        for (var i = 0 ; i < numInmates; i++)
        {
            //ACCELERATION
            switch(inmatesA[i].dir)
            {
                //UP
                case 0: if (inmatesA[i].v.y != -inmatesA[i].speed) { inmatesA[i].v.y -= inmatesA[i].accel; if (inmatesA[i].v.y < -inmatesA[i].speed) { inmatesA[i].v.y = -inmatesA[i].speed } } break;
                //UPRIGHT
                case 1: if (inmatesA[i].v.y != -inmatesA[i].speed) { inmatesA[i].v.y -= inmatesA[i].accel; if (inmatesA[i].v.y < -inmatesA[i].speed) { inmatesA[i].v.y = -inmatesA[i].speed } }
                        if (inmatesA[i].v.x != inmatesA[i].speed) { inmatesA[i].v.x += inmatesA[i].accel; if (inmatesA[i].v.x > inmatesA[i].speed) { inmatesA[i].v.x = inmatesA[i].speed } }
                         break;
                //RIGHT
                case 2: if (inmatesA[i].v.x != inmatesA[i].speed) { inmatesA[i].v.x += inmatesA[i].accel; if (inmatesA[i].v.x > inmatesA[i].speed) { inmatesA[i].v.x = inmatesA[i].speed } } break;
                //DOWN RIGHT
                case 3: if (inmatesA[i].v.y != inmatesA[i].speed) { inmatesA[i].v.y += inmatesA[i].accel; if (inmatesA[i].v.y > inmatesA[i].speed) { inmatesA[i].v.y = inmatesA[i].speed } }
                        if (inmatesA[i].v.x != inmatesA[i].speed) { inmatesA[i].v.x += inmatesA[i].accel; if (inmatesA[i].v.x > inmatesA[i].speed) { inmatesA[i].v.x = inmatesA[i].speed } }
                    break;
                //DOWN
                case 4: if (inmatesA[i].v.y != inmatesA[i].speed) { inmatesA[i].v.y += inmatesA[i].accel; if (inmatesA[i].v.y > inmatesA[i].speed) { inmatesA[i].v.y = inmatesA[i].speed } } break;
                //DOWNLEFT
                case 5: if (inmatesA[i].v.y != inmatesA[i].speed) { inmatesA[i].v.y += inmatesA[i].accel; if (inmatesA[i].v.y > inmatesA[i].speed) { inmatesA[i].v.y = inmatesA[i].speed } }
                        if (inmatesA[i].v.x != -inmatesA[i].speed) { inmatesA[i].v.x -= inmatesA[i].accel; if (inmatesA[i].v.x < -inmatesA[i].speed) { inmatesA[i].v.x = -inmatesA[i].speed } }
                        break;
                //LEFT
                case 6: if (inmatesA[i].v.x != -inmatesA[i].speed) { inmatesA[i].v.x -= inmatesA[i].accel; if (inmatesA[i].v.x < -inmatesA[i].speed) { inmatesA[i].v.x = -inmatesA[i].speed } } break;
                //UPLEFT
                case 7: if (inmatesA[i].v.y != -inmatesA[i].speed) { inmatesA[i].v.y -= inmatesA[i].accel; if (inmatesA[i].v.y < -inmatesA[i].speed) { inmatesA[i].v.y = -inmatesA[i].speed } }
                        if (inmatesA[i].v.x != -inmatesA[i].speed) { inmatesA[i].v.x -= inmatesA[i].accel; if (inmatesA[i].v.x < -inmatesA[i].speed) { inmatesA[i].v.x = -inmatesA[i].speed } } 
                    break;
                //STILL 
                case 8: if(inmatesA[i].v.x != 0) { inmatesA[i].v.x = 0;}
                        if(inmatesA[i].v.y != 0) {  inmatesA[i].v.y = 0;}
                    break;
            }

            inmatesA[i].pos.x += (inmatesA[i].v.x * step);
            inmatesA[i].pos.y += (inmatesA[i].v.y * step);
        }
    }
    function draw(step, ctx, xView, yView)
    {
        for (var i = 0 ; i < numInmates; i++)
        {
            //OFFSET CAMERA VIEW
            var newX = (inmatesA[i].pos.x) - xView;
            var newY = (inmatesA[i].pos.y) - yView;

            ctx.save();
            //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);

            //DRAW NAME
            ctx.textAlign = 'center'; ctx.font = '10pt Calibri';
            ctx.fillText(inmatesA[i].name, newX + 16, newY - 16);

            //DRAW HEALTH
            ctx.beginPath(); ctx.rect(newX-16, newY - 14, inmatesA[i].health, 6);
            ctx.fillStyle = 'red'; ctx.fill(); ctx.stroke();

            //DRAW RESPECT
            ctx.beginPath(); ctx.rect(newX - 16, newY - 6, inmatesA[i].respect, 6);
            ctx.fillStyle = 'blue'; ctx.fill(); ctx.stroke();

            //BOXES AROUND HP AND RESP
            ctx.beginPath(); ctx.rect(newX - 16, newY - 14, 70, 6); ctx.stroke();
            ctx.beginPath(); ctx.rect(newX - 16, newY - 6, 70, 6);  ctx.stroke();

            ctx.drawImage(
                inmatesA[i].sprite,
                inmatesA[i].sx,
                inmatesA[i].sy,
                32,
                32,
                newX,
                newY,
                32,
                32);
            ctx.restore();
        }

    }


    function seeInmateStats()
    {
        var num = 0;
        for (var i = 0 ; i < numInmates; i++)
        {
            num++;
            console.log("Inmate " + num + " Name: " + inmatesA[i].name);
            console.log("Inmate " + num + " Pos: " + inmatesA[i].onT.x + " " + inmatesA[i].onT.y);
        }
    }

    //GETTERS SETTERS
   

    function getOnTile() {
        return onTile;
    }
    function getPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        return pColBlocks;
    }

    function setSpeed(speed)
    {
        for (var i = 0 ; i < numInmates; i++)
        {
            inmatesA[i].speed = speed;
        }
    }
    function setSlowDownSpeed(speed)
    {
        for (var i = 0 ; i < numInmates; i++)
        {
            inmatesA[i].sdspeed = speed;
        }
    }

    function randDir()
    {
       
        for (var i = 0 ; i < numInmates; i++)
        {
            var randDir = prison.math.randomRange(0, 8);
            inmatesA[i].dir = randDir;
        }
    }

    function backToCell()
    {
        for (var i = 0 ; i < numInmates; i++) {
           
            inmatesA[i].pos.x = inmatesA[i].cellPos.x;
            inmatesA[i].pos.y = inmatesA[i].cellPos.y;
            inmatesA[i].dir = 8;
        }
    }


    return {
        //EXPOSED FUNCTIONS IN HERE
        randDir: randDir,
        backToCell: backToCell,
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