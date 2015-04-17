prison.inmates = (function () {

    var numInmates,
        game, 
        sPositions      = [], //Spawns
        inmatesA        = [],
        collsionBlocks  = [],
        inmateNames     = [],
        pTile,

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
        collsionBlocks = prison.map.getCollisions();
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
            
            var newInmate = {   
                sx: 0,
                sy: 0,
                dir: 4,                                             //Direction START WALKING OUT OF CELLS
                pos: new Victor(spawnPos[0].x, spawnPos[0].y),      //Position
                cellPos: new Victor(spawnPos[0].x, spawnPos[0].y),  //Cell Position
                v: new Victor(0, 0),                                //Velocity
                c: new Victor(0, 0),                                //Center
                onT: new Victor(0, 0),                              //On Tile
                speed: 150,                                          //Speed
                accel: 9,                                           //Acceleration
                sdspeed: 40,                                        //SlowDownSpeed
                name: inmateNames[i],
                sprite: Sprite,
                health: 70,
                respect: randResp,                                  //Decrease Respect when player bumps into them  if no respect HURT player
                cBlocks: []
            }
            prison.map.shiftSpawn();
            inmatesA.push(newInmate);
        }
    }


    function update(step, worldWidth, worldHeight)
    {
        //UPDATE PLAYERS BLOCK
        setPlayerBlock();
        for (var i = 0 ; i < numInmates; i++)
        {
            //PLAYER
            playerCollision(inmatesA[i], step);

            //ACCELERATION
            applyDirection(inmatesA[i]);

            //UPDATE POSSIBLE COLLISION BLOCKS
            possibleCollisionBlocks(inmatesA[i]);

            //CORRECT COLLISIONS DOOR 
            doorCorrection(inmatesA[i], step);

            //CORRECT COLLISIONS
            inmateCollisionCorrection(inmatesA[i], step);
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
            ctx.textAlign = 'center'; ctx.font = 'bold 10pt Calibri';
            ctx.fillText(inmatesA[i].name, newX + 16, newY - 16);

            //DRAW HEALTH
            ctx.beginPath(); ctx.rect(newX-16, newY - 14, inmatesA[i].health, 6);
            ctx.fillStyle = 'red'; ctx.fill(); ctx.stroke();

            //DRAW RESPECT
            ctx.beginPath(); ctx.rect(newX - 16, newY - 6, inmatesA[i].respect, 6);
            ctx.fillStyle = 'blue'; ctx.fill(); ctx.stroke();

            //SHADOW 
            ctx.beginPath();
            ctx.rect(newX+6, newY+6, 10, 10);
            ctx.fillStyle = "red";
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 9;
            ctx.shadowOffsetY = 1;
            ctx.fill();
            ctx.stroke();

            //BOXES AROUND HP AND RESP
            ctx.beginPath(); ctx.rect(newX - 16, newY - 14, 70, 6); ctx.stroke();
            ctx.beginPath(); ctx.rect(newX - 16, newY - 6, 70, 6); ctx.stroke();

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

    function setPlayerBlock()
    {
        pTile = prison.player.getPlayerOBJ();
    }

    //HELPER FUNCTIONS
    function possibleCollisionBlocks(inmate)
    {
        inmate.cBlocks = []; //Empty Current

        //CHECK IF ITS OFF MAP GRID < 0
        if (inmate.onT.x - 1 <= 0 || inmate.onT.y - 1 <= 0) {
            inmate.cBlocks[0] = new Victor(inmate.onT.x, inmate.onT.y);         //Topleft
            inmate.cBlocks[2] = new Victor(inmate.onT.x, inmate.onT.y);         //BotLeft
            inmate.cBlocks[4] = new Victor(inmate.onT.x, inmate.onT.y);         //Left
            inmate.cBlocks[6] = new Victor(inmate.onT.x, inmate.onT.y);         //Above
            inmate.cBlocks[1] = new Victor(inmate.onT.x, inmate.onT.y);         //TopRight
        }
        else {
            inmate.cBlocks[1] = new Victor(inmate.onT.x + 1, inmate.onT.y - 1); //TopRight
            inmate.cBlocks[0] = new Victor(inmate.onT.x - 1, inmate.onT.y - 1); //Topleft
            inmate.cBlocks[2] = new Victor(inmate.onT.x - 1, inmate.onT.y + 1); //BotLeft
            inmate.cBlocks[4] = new Victor(inmate.onT.x - 1, inmate.onT.y);     //Left
            inmate.cBlocks[6] = new Victor(inmate.onT.x,     inmate.onT.y - 1); //Above
        }
        inmate.cBlocks[3] = new Victor(inmate.onT.x + 1, inmate.onT.y + 1);     //BotRight
        inmate.cBlocks[5] = new Victor(inmate.onT.x + 1, inmate.onT.y);         //Right
        inmate.cBlocks[7] = new Victor(inmate.onT.x,     inmate.onT.y + 1);     //Below
        inmate.cBlocks[8] = new Victor(inmate.onT.x, inmate.onT.y);             //Your Current Tile
    }

    function playerCollision(inmate , step)
    {
        //COLLISION CHECK /
        var collisionCorrectionX = new Victor(0, 0);
        var temp1 = new Victor(0, 0);
        temp1 = prison.collision.collisionCheck(inmate.c, pTile);
            collisionCorrectionX = temp1; 
            inmate.pos.x += collisionCorrectionX.x;

        var collisionCorrectionY = new Victor(0, 0);
        var temp2 = new Victor(0, 0);
   
        temp2 = prison.collision.collisionCheck(inmate.c, pTile);
        collisionCorrectionY = temp2;
        inmate.pos.y += collisionCorrectionY.y;
        if (collisionCorrectionY.y != 0 || collisionCorrectionX.x != 0 )
        {
            if (inmate.respect > 0)
            {
                inmate.respect-=2;
            }else
            {
                inmate.respect = 0;
                prison.player.pLayerHP(-3);
            }
        }   
    }

    function doorCorrection(inmate, step) {
        //UPDATE DOOR ARRAY TO COLLIDE WITH
        doors = prison.doors.getDoors();

        var numDoors = prison.map.getNumDoors()

        var collisionCorrection = new Victor(0, 0);
        for (var i = 0 ; i < 9; i++) {
            for (var j = 0 ; j < numDoors; j++) {
                if (inmate.cBlocks[i].x == doors[j].onT.x && inmate.cBlocks[i].y == doors[j].onT.y) {
                    doors[j].open = true;//OPEN DOOR
                    collisionCorrection = prison.collision.collisionCheck(inmate.c, doors[j]);
                }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrection.x != 0) {
            inmate.pos.x += collisionCorrection.x;
        }

        var collisionCorrection2 = new Victor(0, 0);
        for (var i = 0 ; i < 9; i++) {
            for (var j = 0 ; j < numDoors; j++) {
                if (inmate.cBlocks[i].x == doors[j].onT.x && inmate.cBlocks[i].y == doors[j].onT.y) {
                    doors[j].open = true;//OPEN DOOR
                    collisionCorrection2 = prison.collision.collisionCheck(inmate.c, doors[j]);
                }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrection2.y != 0) {
            inmate.pos.y += collisionCorrection2.y;
        }
    }

    function inmateCollisionCorrection(inmate, step)
    {
        //ATTEMPT STEP //*******MAJOR ISSUE HERE  ONLY STEP ON X FIRST RESOLVE IT FIRST
        inmate.pos.x += (inmate.v.x * step);
        inmate.c.x = inmate.pos.x + 32;
        inmate.c.y = inmate.pos.y + 32;


        //COLLISION CHECK /
        var collisionCorrectionX = new Victor(0, 0);
        var temp1 = new Victor(0, 0);
        for (var j = 0 ; j < 9; j++) {
            if (collsionBlocks[inmate.cBlocks[j].x - 1][inmate.cBlocks[j].y - 1].Type != "0") //RIDICULOUS REFERENCE BUT WORKS GREAT HAHA
            {
                temp1 = prison.collision.collisionCheck(inmate.c, collsionBlocks[inmate.cBlocks[j].x - 1][inmate.cBlocks[j].y - 1]);
                if (Math.abs(temp1.x) > Math.abs(collisionCorrectionX.x) &&
                    Math.abs(temp1.x) > Math.abs(collisionCorrectionX.y))
                { collisionCorrectionX = temp1; }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrectionX.x != 0) {
            inmate.pos.x += collisionCorrectionX.x;
            //RANDOM NEW DIRECTION TO WALK IN 
            randIMDir(inmate);
        }
        //NOW STEP ON Y AND CHECK COLLISION AND RESOLVE IT
        inmate.pos.y += (inmate.v.y * step);
        inmate.c.x = inmate.pos.x + 32;
        inmate.c.y = inmate.pos.y + 32;

        var collisionCorrectionY = new Victor(0, 0);
        var temp2 = new Victor(0, 0);
        for (var j = 0 ; j < 9; j++) {
            if (collsionBlocks[inmate.cBlocks[j].x - 1][inmate.cBlocks[j].y - 1].Type != "0") //RIDICULOUS REFERENCE BUT WORKS GREAT HAHA
            {
                temp2 = prison.collision.collisionCheck(inmate.c, collsionBlocks[inmate.cBlocks[j].x - 1][inmate.cBlocks[j].y - 1]);
                if (Math.abs(temp2.y) > Math.abs(collisionCorrectionY.y) &&
                    Math.abs(temp2.y) > Math.abs(collisionCorrectionY.x))
                { collisionCorrectionY = temp2; }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrectionY.y != 0) {
            inmate.pos.y += collisionCorrectionY.y;
            //RANDOM NEW DIRECTION TO WALK IN 
            randIMDir(inmate);
        }
    }

    function applyDirection(inmate)
    {
        //UPDATE ONTILE
        inmate.c.x = inmate.pos.x + 32;
        inmate.c.y = inmate.pos.y + 32;
        inmate.onT.x = Math.round(inmate.c.x / 32); inmate.onT.y = Math.round(inmate.c.y / 32);

        if (prison.screens["game-screen"].getPaused()) {
            inmate.dir = 8;
        }

        switch (inmate.dir) {
            //UP
            case 0: if (inmate.v.y != inmate.speed * -1) { inmate.v.y -= inmate.accel; } if (inmate.v.y < inmate.speed * -1) { inmate.v.y = inmate.speed * -1; }
                break;
                //UPRIGHT
            case 1: if (inmate.v.y != inmate.speed * -1) { inmate.v.y -= inmate.accel; } if (inmate.v.y < inmate.speed * -1) { inmate.v.y = inmate.speed * -1; }
                if (inmate.v.x != inmate.speed) { inmate.v.x += inmate.accel; } if (inmate.v.x > inmate.speed) { inmate.v.x = inmate.speed; }
                break;
                //RIGHT
            case 2: if (inmate.v.x != inmate.speed) { inmate.v.x += inmate.accel; } if (inmate.v.x > inmate.speed) { inmate.v.x = inmate.speed; }
                break;
                //DOWN RIGHT
            case 3: if (inmate.v.y != inmate.speed) { inmate.v.y += inmate.accel; } if (inmate.v.y > inmate.speed) { inmate.v.y = inmate.speed; }
                if (inmate.v.x != inmate.speed) { inmate.v.x += inmate.accel; } if (inmate.v.x > inmate.speed) { inmate.v.x = inmate.speed; }
                break;
                //DOWN
            case 4: if (inmate.v.y != inmate.speed) {inmate.v.y += inmate.accel;} if (inmate.v.y > inmate.speed) { inmate.v.y = inmate.speed;}
                break;
                //DOWNLEFT
            case 5: if (inmate.v.y != inmate.speed) { inmate.v.y += inmate.accel; } if (inmate.v.y > inmate.speed) { inmate.v.y = inmate.speed; }
                if (inmate.v.x != inmate.speed * -1) { inmate.v.x -= inmate.accel; } if (inmate.v.x < inmate.speed * -1) { inmate.v.x = inmate.speed * -1; }
                break;
                //LEFT
            case 6: if (inmate.v.x != inmate.speed * -1) { inmate.v.x -= inmate.accel; } if (inmate.v.x < inmate.speed * -1) { inmate.v.x = inmate.speed * -1; }
                break;
                //UPLEFT
            case 7: if (inmate.v.y != inmate.speed * -1) { inmate.v.y -= inmate.accel; } if (inmate.v.y < inmate.speed * -1) { inmate.v.y = inmate.speed * -1; }
                if (inmate.v.x != inmate.speed * -1) { inmate.v.x -= inmate.accel; } if (inmate.v.x < inmate.speed * -1) { inmate.v.x = inmate.speed * -1; }
                break;
                //STILL 
            case 8: if (inmate.v.x != 0) { inmate.v.x = 0; }
                if (inmate.v.y != 0) { inmate.v.y = 0; }
                break;
        }
        if (inmate.pos.x - 64 < 0) { inmate.pos.x = 64; }
        if (inmate.pos.y - 64 < 0) { inmate.pos.y = 64; }
        if (inmate.pos.x + (64) > 3200) { inmate.pos.x = 3200 - (64); }
        if (inmate.pos.y + (64) > 3200) { inmate.pos.y = 3200 - (64); }
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
    function randIMDir(inmate)
    {
        var randDir = Math.floor(Math.random() * 8);
        inmate.dir = randDir;
        //console.log(randDir);
    }
    function backToCell()
    {
        for (var i = 0 ; i < numInmates; i++) {
           
            inmatesA[i].pos.x = inmatesA[i].cellPos.x;
            inmatesA[i].pos.y = inmatesA[i].cellPos.y;
            inmatesA[i].dir = 8;
        }
    }
    function seeInmateStats() {
        var num = 0;
        for (var i = 0 ; i < numInmates; i++) {
            num++;
            console.log("Inmate " + num + " Name: " + inmatesA[i].name);
            console.log("Inmate " + num + " On Tile: " + inmatesA[i].onT.x + " " + inmatesA[i].onT.y);
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