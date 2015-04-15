prison.guards = (function () {

    var numGuards,
        game,
        sPositions = [], //Spawns
        guardsA = [],
        collsionBlocks = [],
        guardNames = [],
        DIR = { UP: 0, UPRIGHT: 1, RIGHT: 2, DOWNRIGHT: 3, DOWN: 4, DOWNLEFT: 5, LEFT: 6, UPLEFT: 7, STILL: 8 },

    slowDown = {
        left: false,
        up: false,
        right: false,
        down: false,
    }

    function run() {
        initialize(console.log("initialized inmates"));
    }

    function initialize(callback) {
        game = prison.game;
        numGuards = prison.settings.guards;
        guardNames = game.getGuardNames(); //Array of Random Inmate Names
        collsionBlocks = prison.map.getCollisions();
        spawnGuards();
    }

    function spawnGuards() {
        //get spawn positions!!
        //var spawnPos = prison.map.getSpawns(); GET GUARD SPAWNS

        for (var i = 0 ; i < numGuards; i++)
        {
            //Sprite = new Image();
            //Sprite.src = "Images/$Guard" + i + ".png";

            var newNewGuard = {
                sx: 0,
                sy: 0,
                dir: 4,                                             //Direction START WALKING OUT OF CELLS
                pos: new Victor(spawnPos[0].x, spawnPos[0].y),      //Position
                cellPos: new Victor(spawnPos[0].x, spawnPos[0].y),  //Cell Position
                v: new Victor(0, 0),                                //Velocity
                c: new Victor(0, 0),                                //Center
                onT: new Victor(0, 0),                              //On Tile
                speed: 100,                                          //Speed
                accel: 9,                                           //Acceleration
                sdspeed: 40,                                        //SlowDownSpeed
                name: guardNames[i],
                //sprite: Sprite,
                health: 70,
                cBlocks: []
            }
            //prison.map.shiftGuardSpawn();
            guardsA.push(newNewGuard);
        }
    }


    function update(step, worldWidth, worldHeight) {
        for (var i = 0 ; i < numGuards; i++) {
            //ACCELERATION
            applyDirection(guardsA[i]);

            //UPDATE POSSIBLE COLLISION BLOCKS
            possibleCollisionBlocks(guardsA[i]);

            //CORRECT COLLISIONS
            inmateCollisionCorrection(guardsA[i], step);
        }
    }
    function draw(step, ctx, xView, yView) {
        for (var i = 0 ; i < numInmates; i++) {
            //OFFSET CAMERA VIEW
            var newX = (guardsA[i].pos.x) - xView;
            var newY = (guardsA[i].pos.y) - yView;

            ctx.save();
            //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);

            //DRAW NAME
            ctx.textAlign = 'center'; ctx.font = '10pt Calibri';
            ctx.fillText(guardsA[i].name, newX + 16, newY - 16);

            //DRAW HEALTH
            ctx.beginPath(); ctx.rect(newX - 16, newY - 14, guardsA[i].health, 6);
            ctx.fillStyle = 'red'; ctx.fill(); ctx.stroke();

            //DRAW RESPECT
            ctx.beginPath(); ctx.rect(newX - 16, newY - 6, guardsA[i].respect, 6);
            ctx.fillStyle = 'blue'; ctx.fill(); ctx.stroke();

            //SHADOW 
            ctx.beginPath();
            ctx.rect(newX + 6, newY + 6, 10, 10);
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
                guardsA[i].sprite,
                guardsA[i].sx,
                guardsA[i].sy,
                32,
                32,
                newX,
                newY,
                32,
                32);
            ctx.restore();
        }

    }



    //HELPER FUNCTIONS
    function possibleCollisionBlocks(inmate) {
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
            inmate.cBlocks[6] = new Victor(inmate.onT.x, inmate.onT.y - 1); //Above
        }
        inmate.cBlocks[3] = new Victor(inmate.onT.x + 1, inmate.onT.y + 1);     //BotRight
        inmate.cBlocks[5] = new Victor(inmate.onT.x + 1, inmate.onT.y);         //Right
        inmate.cBlocks[7] = new Victor(inmate.onT.x, inmate.onT.y + 1);     //Below
        inmate.cBlocks[8] = new Victor(inmate.onT.x, inmate.onT.y);             //Your Current Tile
    }

    function inmateCollisionCorrection(inmate, step) {
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

    function applyDirection(inmate) {
        //UPDATE ONTILE
        inmate.c.x = inmate.pos.x + 32;
        inmate.c.y = inmate.pos.y + 32;
        inmate.onT.x = Math.round(inmate.c.x / 32); inmate.onT.y = Math.round(inmate.c.y / 32);

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
            case 4: if (inmate.v.y != inmate.speed) { inmate.v.y += inmate.accel; } if (inmate.v.y > inmate.speed) { inmate.v.y = inmate.speed; }
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
        if (inmate.pos.x - 16 < 0) { inmate.pos.x = 16; }
        if (inmate.pos.y - 16 < 0) { inmate.pos.y = 16; }
        if (inmate.pos.x + (32 * 1.5) > 3200) { inmate.pos.x = 3200 - (32 * 1.5); }
        if (inmate.pos.y + (32 * 1.5) > 3200) { inmate.pos.y = 3200 - (32 * 1.5); }
    }


    //GETTERS SETTERS
    function getOnTile() {
        return onTile;
    }
    function getPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        return pColBlocks;
    }
    function setSpeed(speed) {
        for (var i = 0 ; i < numInmates; i++) {
            guardsA[i].speed = speed;
        }
    }
    function setSlowDownSpeed(speed) {
        for (var i = 0 ; i < numInmates; i++) {
            guardsA[i].sdspeed = speed;
        }
    }

    function randDir() {
        for (var i = 0 ; i < numInmates; i++) {
            var randDir = prison.math.randomRange(0, 8);
            guardsA[i].dir = randDir;
        }
    }
    function randIMDir(inmate) {
        var randDir = Math.floor(Math.random() * 8);
        inmate.dir = randDir;
        //console.log(randDir);
    }
    function backToCell() {
        for (var i = 0 ; i < numInmates; i++) {

            guardsA[i].pos.x = guardsA[i].cellPos.x;
            guardsA[i].pos.y = guardsA[i].cellPos.y;
            guardsA[i].dir = 8;
        }
    }
    function seeInmateStats() {
        var num = 0;
        for (var i = 0 ; i < numInmates; i++) {
            num++;
            console.log("Inmate " + num + " Name: " + guardsA[i].name);
            console.log("Inmate " + num + " On Tile: " + guardsA[i].onT.x + " " + guardsA[i].onT.y);
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