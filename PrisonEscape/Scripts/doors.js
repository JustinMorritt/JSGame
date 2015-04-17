prison.doors = (function () {

    var numdoors,
        game,
        sPositions = [], //Spawns
        doorsA = [],
        collsionBlocks = [],
        doorNames = [],
        pTile,
        firstRun = true,

    slowDown = {
        left: false,
        up: false,
        right: false,
        down: false,
    }

    function run() {
        initialize(console.log("initialized doors"));
    }

    function initialize(callback) {
        spawndoors();
    }

    function spawndoors() {
        spawnPos = prison.map.getDoors();
        //console.log(prison.map.getNumDoors());
        Sprite = new Image();
        Sprite.src = "Images/prisons.png";

        for (var i = 0 ; i < prison.map.getNumDoors(); i++) {

            var P = new Victor(spawnPos[0].x, spawnPos[0].y)
            var C = new Victor(P.x + 32, P.y + 32)
            var onT = new Victor(Math.round(C.x / 32), Math.round(C.y / 32));

            var Newdoor = {
                X: P.x,             //DUPLICATES FOR COMPATIBILITY ISSUES .. too far to go back and remake objects...
                Y: P.y,
                Cx: C.x,
                Cy: C.y,
                sx: 0,
                sy: 1088,
                dir: 1,                                             //Direction START WALKING OUT OF CELLS
                pos: P,                                             //Position
                origPos: P,                                         //Original Position
                v: new Victor(0, 0),                                //Velocity
                c: C,                                               //Center
                onT: onT,                                           //On Tile
                speed: 200,                                         //Speed
                accel: 9,                                           //Acceleration
                sprite: Sprite,
                cBlocks: [],
                open: false,
                openTime: 1000,                                     //DoorStays Open For ...
            }
            prison.map.shiftdoors();
            doorsA.push(Newdoor);
        }
    }


    function update(step, worldWidth, worldHeight) {
        setPlayerBlock();
        for (var i = 0 ; i < prison.map.getNumDoors() ; i++) {
            playerCollision(doorsA[i], step);

            //ACCELERATION
            applyDirection(doorsA[i]);
        }
        
    }
    function draw(step, ctx, xView, yView) {

        for (var i = 0 ; i < prison.map.getNumDoors() ; i++) {
            //OFFSET CAMERA VIEW
            var newX = (doorsA[i].pos.x) - xView;
            var newY = (doorsA[i].pos.y) - yView;
            ctx.save();

            ctx.drawImage(
                doorsA[i].sprite,
                doorsA[i].sx,
                doorsA[i].sy,
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
    function possibleCollisionBlocks(door) {
        door.cBlocks = []; //Empty Current
            door.cBlocks[0] = new Victor(door.onT.x, door.onT.y - 1); //Above
            door.cBlocks[1] = new Victor(door.onT.x, door.onT.y + 1);     //Below
    }

    function setPlayerBlock() {
        pTile = prison.player.getPlayerOBJ();
    }

    function playerCollision(door, step) {
        //COLLISION CHECK /
        if (firstRun)
        {
           //OPEN ALL DOORS RIGHT AWAY
        }
        var collisionCorrectionX = new Victor(0, 0);
        var temp1 = new Victor(0, 0);
        temp1 = prison.collision.collisionCheck(door.c, pTile);
        collisionCorrectionX = temp1;

        //door.pos.x += collisionCorrectionX.x;

        var collisionCorrectionY = new Victor(0, 0);
        var temp2 = new Victor(0, 0);

        temp2 = prison.collision.collisionCheck(door.c, pTile);
        collisionCorrectionY = temp2;
        //door.pos.y += collisionCorrectionY.y;

        if (collisionCorrectionY.y != 0 || collisionCorrectionX.x != 0) {
            if (!firstRun) {
                //OPEN DOOR
                //console.log("PLAYER HIT DOOR");
            }
        }

    }

    function applyDirection(door) {
        //UPDATE ONTILE
        door.c.x = door.pos.x + 32;
        door.c.y = door.pos.y + 32;
        door.onT.x = Math.round(door.c.x / 32); door.onT.y = Math.round(door.c.y / 32);

        switch (door.dir) {
                //RIGHT
            case 0: if (door.v.x != door.speed) { door.v.x += door.accel; } if (door.v.x > door.speed) { door.v.x = door.speed; }
                break;
                //LEFT
            case 1: if (door.v.x != door.speed * -1) { door.v.x -= door.accel; } if (door.v.x < door.speed * -1) { door.v.x = door.speed * -1; }
                break;
            case 3: door.v.x = 0;
                door.v.y = 0;
                break;
        }

    }

    //GETTERS SETTERS
    function getOnTile() {
        return onTile;
    }

    function getDoors()
    {
        return doorsA;
    }


    return {
        getDoors: getDoors,
        run: run,
        update: update,
        draw: draw,
        initialize: initialize
    };
})();