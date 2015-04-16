prison.guards = (function () {

    var numGuards,
        game,
        sPositions = [], //Spawns
        guardsA = [],
        collsionBlocks = [],
        guardNames = [],
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

        for (var i = 0 ; i < 7; i++) {
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
        }
    }
    function draw(step, ctx, xView, yView) {

        for (var i = 0 ; i < 7; i++) {
            //OFFSET CAMERA VIEW
            var newX = (guardsA[i].pos.x) - xView;
            var newY = (guardsA[i].pos.y) - yView;

            ctx.save();

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
            guard.cBlocks[0] = new Victor(guard.onT.x, guard.onT.y - 1); //Above
            guard.cBlocks[1] = new Victor(guard.onT.x, guard.onT.y + 1);     //Below
    }

    function setPlayerBlock() {
        pTile = prison.player.getPlayerOBJ();
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
            if (!firstRun) {
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



    return {
        run: run,
        update: update,
        draw: draw,
        initialize: initialize
    };
})();