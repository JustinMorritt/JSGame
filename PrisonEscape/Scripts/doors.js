prison.doors = (function () {

    var numdoors,
        game,
        sPositions = [], //Spawns
        doorsA = [],
        doorNames = [],
        pTile,
        firstRun = true,
        doorOpenTime = 100,

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
                dir: 0,                                             //Direction START WALKING OUT OF CELLS
                pos: P,                                             //Position
                origPos: new Victor(P.x,P.y),                                         //Original Position
                openPos: new Victor(P.x-35,P.y),
                v: new Victor(0, 0),                                //Velocity
                c: C,                                               //Center
                onT: onT,                                           //On Tile
                speed: 200,                                         //Speed
                accel: 9,                                           //Acceleration
                sprite: Sprite,
                open: false,
                closing: false,
                openTime: doorOpenTime,                             //DoorStays Open For ...
            }
            prison.map.shiftdoors();
            doorsA.push(Newdoor);
        }
    }


    function update(step, worldWidth, worldHeight) {
        for (var i = 0 ; i < prison.map.getNumDoors() ; i++)
        {
            //ACCELERATION
            applyDirection(doorsA[i], step);
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


    function applyDirection(door, step) {
        //UPDATE ONTILE
        door.c.x = door.pos.x + 16;
        door.c.y = door.pos.y + 32;
        door.onT.x = Math.round(door.c.x / 32); door.onT.y = Math.round(door.c.y / 32);

        if (door.open)
        {
            door.dir = 1;
            door.openTime -= 1;
            //check if fully open
            if (door.pos.x <= door.openPos.x) {
                door.pos.x = door.openPos.x;
                door.dir = 0;
            }
            if (door.openTime <= 0)
            {
                door.dir = 2;
                door.open = false;
                door.closing = true;
                door.openTime = doorOpenTime;
            }
      
        }
       
        //check if fully closed
        if (door.closing)
        {
            if (door.pos.x > door.origPos.x)
            {
                door.pos.x = door.origPos.x;
                door.dir = 0;
                door.closing = false;
            }
        }


        switch (door.dir) {
                //LEFT
            case 1: if (door.v.x != door.speed * -1) { door.v.x -= door.accel; } if (door.v.x < door.speed * -1) { door.v.x = door.speed * -1; }
                break;
            //RIGHT
            case 2: if (door.v.x != door.speed) { door.v.x += door.accel; } if (door.v.x > door.speed) { door.v.x = door.speed; }
                break;
            case 0: door.v.x = 0;
                    door.v.y = 0;
                break;
        }

        //STEP BRO
        door.pos.x += door.v.x * step;

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