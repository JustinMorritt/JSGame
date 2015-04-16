prison.guards = (function () {

    var numGuards,
        game,
        sPositions      = [], //Spawns
        guardsA         = [],
        collsionBlocks  = [],
        guardNames      = [],
        pTile,
        firstRun = true,

    slowDown = {
        left: false,
        up: false,
        right: false,
        down: false,
    }

    function run() {
        initialize(console.log("initialized guards"));
    }

    function initialize(callback) {
        game = prison.game;
        numGuards = prison.settings.guards;
        guardNames = game.getGuardNames(); //Array of Random guard Names
        collsionBlocks = prison.map.getCollisions();
        spawnGuards();
    }

    function spawnGuards() {
      
        var names = prison.game.getGuardNames();
        spawnPos = prison.map.guardSpawns();

        for (var i = 0 ; i < 7; i++)
        {
            Sprite = new Image();
            Sprite.src = "Images/$Guard" + i + ".png";

            var NewGuard = {
                sx: 0,
                sy: 0,
                dir: 1,                                             //Direction START WALKING OUT OF CELLS
                pos: new Victor(spawnPos[0].x, spawnPos[0].y),      //Position
                cellPos: new Victor(spawnPos[0].x, spawnPos[0].y),  //Cell Position
                v: new Victor(0, 0),                                //Velocity
                c: new Victor(0, 0),                                //Center
                onT: new Victor(0, 0),                              //On Tile
                speed: 100,                                         //Speed
                accel: 9,                                           //Acceleration
                sdspeed: 40,                                        //SlowDownSpeed
                name: names[i],
                sprite: Sprite,
                health: 100,
                cBlocks: []
            }
            prison.map.shiftGuards();
            guardsA.push(NewGuard);
        }
    }


    function update(step, worldWidth, worldHeight) {
        setPlayerBlock();
        for (var i = 0 ; i < 7; i++) {

            playerCollision(guardsA[i], step);

            //ACCELERATION
            applyDirection(guardsA[i]);

            //UPDATE POSSIBLE COLLISION BLOCKS
            possibleCollisionBlocks(guardsA[i]);

            //CORRECT COLLISIONS
            guardCollisionCorrection(guardsA[i], step);
        }
    }
    function draw(step, ctx, xView, yView) {
        
        for (var i = 0 ; i < 7; i++) {
            //OFFSET CAMERA VIEW
            var newX = (guardsA[i].pos.x) - xView;
            var newY = (guardsA[i].pos.y) - yView;

            ctx.save();
            //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);

            //DRAW NAME
            ctx.textAlign = 'center'; ctx.font = 'bold 14pt Calibri';
            ctx.fillText(guardsA[i].name, newX + 16, newY - 16);

            //DRAW HEALTH
            ctx.beginPath(); ctx.rect(newX - 30, newY - 14, guardsA[i].health, 6);
            ctx.fillStyle = 'red'; ctx.fill(); ctx.stroke();

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
            ctx.beginPath(); ctx.rect(newX - 30, newY - 14, guardsA[i].health, 6); ctx.stroke();
            
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
            firstRun = false;
        }
       
    }

    //HELPER FUNCTIONS
    function possibleCollisionBlocks(guard) {
        guard.cBlocks = []; //Empty Current
        //CHECK IF ITS OFF MAP GRID < 0
        if (guard.onT.x - 1 <= 0 || guard.onT.y - 1 <= 0) {
            guard.cBlocks[0] = new Victor(guard.onT.x, guard.onT.y);         //Topleft
            guard.cBlocks[2] = new Victor(guard.onT.x, guard.onT.y);         //BotLeft
            guard.cBlocks[4] = new Victor(guard.onT.x, guard.onT.y);         //Left
            guard.cBlocks[6] = new Victor(guard.onT.x, guard.onT.y);         //Above
            guard.cBlocks[1] = new Victor(guard.onT.x, guard.onT.y);         //TopRight
        }
        else {
            guard.cBlocks[1] = new Victor(guard.onT.x + 1, guard.onT.y - 1); //TopRight
            guard.cBlocks[0] = new Victor(guard.onT.x - 1, guard.onT.y - 1); //Topleft
            guard.cBlocks[2] = new Victor(guard.onT.x - 1, guard.onT.y + 1); //BotLeft
            guard.cBlocks[4] = new Victor(guard.onT.x - 1, guard.onT.y);     //Left
            guard.cBlocks[6] = new Victor(guard.onT.x, guard.onT.y - 1); //Above
        }
        guard.cBlocks[3] = new Victor(guard.onT.x + 1, guard.onT.y + 1);     //BotRight
        guard.cBlocks[5] = new Victor(guard.onT.x + 1, guard.onT.y);         //Right
        guard.cBlocks[7] = new Victor(guard.onT.x, guard.onT.y + 1);     //Below
        guard.cBlocks[8] = new Victor(guard.onT.x, guard.onT.y);             //Your Current Tile
    }

    function setPlayerBlock() {
        pTile = prison.player.getPlayerOBJ();
    }

    function guardCollisionCorrection(guard, step) {
        //ATTEMPT STEP //*******MAJOR ISSUE HERE  ONLY STEP ON X FIRST RESOLVE IT FIRST
        guard.pos.x += (guard.v.x * step);
        guard.c.x = guard.pos.x + 32;
        guard.c.y = guard.pos.y + 32;


        //COLLISION CHECK /
        var collisionCorrectionX = new Victor(0, 0);
        var temp1 = new Victor(0, 0);
        for (var j = 0 ; j < 9; j++) {
            if (collsionBlocks[guard.cBlocks[j].x - 1][guard.cBlocks[j].y - 1].Type != "0") //RIDICULOUS REFERENCE BUT WORKS GREAT HAHA
            {
                temp1 = prison.collision.collisionCheck(guard.c, collsionBlocks[guard.cBlocks[j].x - 1][guard.cBlocks[j].y - 1]);
                if (Math.abs(temp1.x) > Math.abs(collisionCorrectionX.x) &&
                    Math.abs(temp1.x) > Math.abs(collisionCorrectionX.y))
                { collisionCorrectionX = temp1; }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrectionX.x != 0) {
            guard.pos.x += collisionCorrectionX.x;
            //RANDOM NEW DIRECTION TO WALK IN 
            randIMDir(guard);
        }
        //NOW STEP ON Y AND CHECK COLLISION AND RESOLVE IT
        guard.pos.y += (guard.v.y * step);
        guard.c.x = guard.pos.x + 32;
        guard.c.y = guard.pos.y + 32;

        var collisionCorrectionY = new Victor(0, 0);
        var temp2 = new Victor(0, 0);
        for (var j = 0 ; j < 9; j++) {
            if (collsionBlocks[guard.cBlocks[j].x - 1][guard.cBlocks[j].y - 1].Type != "0") //RIDICULOUS REFERENCE BUT WORKS GREAT HAHA
            {
                temp2 = prison.collision.collisionCheck(guard.c, collsionBlocks[guard.cBlocks[j].x - 1][guard.cBlocks[j].y - 1]);
                if (Math.abs(temp2.y) > Math.abs(collisionCorrectionY.y) &&
                    Math.abs(temp2.y) > Math.abs(collisionCorrectionY.x))
                { collisionCorrectionY = temp2; }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrectionY.y != 0) {
            guard.pos.y += collisionCorrectionY.y;
            //RANDOM NEW DIRECTION TO WALK IN 
            randIMDir(guard);
        }
    }
    function playerCollision(guard, step) {
        //COLLISION CHECK /
        var collisionCorrectionX = new Victor(0, 0);
        var temp1 = new Victor(0, 0);
        temp1 = prison.collision.collisionCheck(guard.c, pTile);
        collisionCorrectionX = temp1;
        guard.pos.x += collisionCorrectionX.x;

        var collisionCorrectionY = new Victor(0, 0);
        var temp2 = new Victor(0, 0);

        temp2 = prison.collision.collisionCheck(guard.c, pTile);
        collisionCorrectionY = temp2;
        guard.pos.y += collisionCorrectionY.y;
        if (collisionCorrectionY.y != 0 || collisionCorrectionX.x != 0) {
                if (!firstRun)
                {
                    prison.player.pLayerHP(-5); //DEAL 30 DAMAGE TO PLAYER
                }
                
            }
        
    }

    function applyDirection(guard) {
        //UPDATE ONTILE
        guard.c.x = guard.pos.x + 32;
        guard.c.y = guard.pos.y + 32;
        guard.onT.x = Math.round(guard.c.x / 32); guard.onT.y = Math.round(guard.c.y / 32);

        switch (guard.dir) {
                //UP
            case 0: if (guard.v.y != guard.speed * -1) { guard.v.y -= guard.accel; } if (guard.v.y < guard.speed * -1) { guard.v.y = guard.speed * -1; }
                break;
                //DOWN
            case 1: if (guard.v.y != guard.speed) { guard.v.y += guard.accel; } if (guard.v.y > guard.speed) { guard.v.y = guard.speed; }
                break;
                //RIGHT
            case 2: if (guard.v.x != guard.speed) { guard.v.x += guard.accel; } if (guard.v.x > guard.speed) { guard.v.x = guard.speed; }
                break;
                //LEFT
            case 3: if (guard.v.x != guard.speed * -1) { guard.v.x -= guard.accel; } if (guard.v.x < guard.speed * -1) { guard.v.x = guard.speed * -1; }
                break;
        }
        if (guard.pos.x - 64 < 0) { guard.pos.x = 64; }
        if (guard.pos.y - 64 < 0) { guard.pos.y = 64; }
        if (guard.pos.x + (32 * 3) > 3200) { guard.pos.x = 3200 - (32 * 3); }
        if (guard.pos.y + (32 * 3) > 3200) { guard.pos.y = 3200 - (32 * 3); }
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
        for (var i = 0 ; i < numguards; i++) {
            guardsA[i].speed = speed;
        }
    }
    function setSlowDownSpeed(speed) {
        for (var i = 0 ; i < numguards; i++) {
            guardsA[i].sdspeed = speed;
        }
    }

    function randDir() {
        for (var i = 0 ; i < numguards; i++) {
            var randDir = prison.math.randomRange(0, 3);
            guardsA[i].dir = randDir;
        }
    }
    function randIMDir(guard) {
        var randDir = Math.floor(Math.random() * 8);
        guard.dir = randDir;
        //console.log(randDir);
    }
    function backToCell() {
        for (var i = 0 ; i < numguards; i++) {

            guardsA[i].pos.x = guardsA[i].cellPos.x;
            guardsA[i].pos.y = guardsA[i].cellPos.y;
            guardsA[i].dir = 8;
        }
    }
    function seeguardStats() {
        var num = 0;
        for (var i = 0 ; i < numguards; i++) {
            num++;
            console.log("guard " + num + " Name: " + guardsA[i].name);
            console.log("guard " + num + " On Tile: " + guardsA[i].onT.x + " " + guardsA[i].onT.y);
        }
    }

    return {
        //EXPOSED FUNCTIONS IN HERE
        randDir: randDir,
        backToCell: backToCell,
        setSpeed: setSpeed,
        setSlowDownSpeed: setSlowDownSpeed,
        seeguardStats: seeguardStats,
        run: run,
        update: update,
        draw: draw,
        //dPosCB: dPosCB,
        initialize: initialize
    };
})();