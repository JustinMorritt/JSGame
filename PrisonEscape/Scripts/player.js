prison.player = (function () {
    var x,
        y,
        vx,
        vy,
		sx,
		sy,
        pSpeed,
        pWidth,
        pHeight,
        pHP,
        pName,
        pOffences,
        pTime,
        playerSprite,
        collsionBlocks,
        doors,
        blockWidth,
        getColBlockNum,
        slowDownSpeed,
        acceleration,
        center,
        onTile,
        pColBlocks, //Possible Collision Blocks Array.
        frames = [],
        ranges = [],
        _currentRange = "",
        ANIMATION_RATE = 150;

    controls = {
        left    : false,
        up      : false,
        right   : false,
        down    : false,}
    slowDown = {
        left    : false,
        up      : false,
        right   : false,
        down    : false,}

    //ANIMATION OBJECTS
    var Frame = function (xPos, yPos, w, h) {
        var _x = xPos, _y = yPos, _width = w, _height = h;
        this._getx = function () {
            return _x;
        };
        this._gety = function () {
            return _y;
        };
        this._getWidth = function () {
            return _width;
        };
        this._getHeight = function () {
            return _height;
        };
    };
    var AnimationRange = function(rangeName, first, end)
    {
        if(end <= first)
        {
            console.log("end less then First frame: Range Not Changed..");
            return;
        }
        var _name = rangeName;
        var _first = first;
        var _end = end;

        var _currentFrame = _first;

        this.setRange = function (first, end) {
            if (end <= first) {
                console.log("end less then First frame: Range Not Changed..");
                return;
            }
            _first = first;
            _end = end;
        };
        this.getEnd = function ()       { return _end; };
        this.getFirst = function ()     { return _first; };
        this.getName = function ()      { return _name; };
        this.currentFrame = function () { return _currentFrame; };
        this.nextFrame = function ()    { ++_currentFrame;  if (_currentFrame == _end) { _currentFrame = _first;  } return _currentFrame; };
    }


    //RUN INIT UPDATE DRAW
    function run() {
        initialize(console.log("initialized player"));
    }
    function initialize(callback)
    {

        var spawnPos = prison.map.getSpawns();
       // var index = array.indexOf(5);
        x                   = spawnPos[0].x+16; //USE THIS TO GRAB A RANDOM SPAWN POSITION
        y                   = spawnPos[0].y+16;    prison.map.shiftSpawn();
        vx                  = 0;
        vy                  = 0;
		sx					= 32;
		sy					= 0;
        center              = new Victor(0, 0);
        onTile              = new Victor(0, 0);
        acceleration        = 20;
        slowDownSpeed       = 40;
        pSpeed              = 200; //originally 200
        blockWidth          = 32;
        pWidth              = 32;
        pHeight             = 32;
        playerMagnitude     = 0;
        pHP                 = 100; //Health
        getColBlockNum      = prison.map.getColBlockNum();
        pName               = prison.settings.name;
        pColBlocks          = [];
        ranges.push(new AnimationRange("", 0, 1));
        frames.push(new Frame(sx, sy, pWidth, pHeight));


        playerSprite = new Image();
        playerSprite.addEventListener("load", callback, false);
        playerSprite.src ="Images/$Char.png";

        //GET ARRAY OF COLLISION BLOCKS 
        collsionBlocks = prison.map.getCollisions();

        setupAnimation();

        window.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:
                case 65: // left arrow
                    controls.left = true;
                    
                    slowDown.left = false;
                    break;
                case 38: // up arrow
                case 87:
                    controls.up = true;
                   
                    slowDown.up = false;
                    break;
                case 39:
                case 68: // right arrow
                    controls.right = true;
                    
                    slowDown.right = false;
                    break;
                case 40:
                case 83: // down arrow
                    controls.down = true;
                   
                    slowDown.down = false;
                    break;
            }
        }, false);

        window.addEventListener("keyup", function (e) {
            switch (e.keyCode) {
                case 37:
                case 65: // left arrow
                    controls.left = false;
                    
                    slowDown.left = true;
                    //vx = 0;
                    break;
                case 38:
                case 87: // up arrow
                    controls.up = false;
                   
                    slowDown.up = true;
                    //vy = 0;
                    break;
                case 39:
                case 68: // right arrow
                    controls.right = false;
                    
                    slowDown.right = true;
                    //vx = 0;
                    break;
                case 40:
                case 83: // down arrow
                    controls.down = false;
                    
                    slowDown.down = true;
                    //vy = 0;
                    break;
                case 80: // key P pauses the game
                    prison.display.togglePause();
                    break;
            }
        }, false);
    }
    function update(step)
    {
        //APPLY DIRECTION
        applyDirection();

        //DOOR CORRECTION
        doorCorrection(step);

        //BLOCK CORRECTION
        blockCorrection(step);
    }
    function draw(step, context, xView, yView)// camera.xView, camera.yView
    {
        xView = xView; //these will eventually be camera positions
        yView = yView;

        context.save();
        //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);
        var newX = (x-pWidth/2) - xView;
        var newY = (y - pHeight / 2) - yView;

        //DRAW HEALTH
        context.beginPath(); context.rect(newX - 35, newY - 14, getPLayerHP(), 8);
        context.fillStyle = 'red'; context.fill(); context.stroke();

        //BOXES AROUND HP AND RESP
        context.beginPath(); context.rect(newX - 35, newY - 14, 100, 8); context.stroke();

        //context.drawImage(playerSprite, sx, sy, 32, 32, newX, newY, pWidth, pHeight);

        //SHADOW 
        context.beginPath();
        context.rect(newX + 8, newY + 6, 10, 10);
        context.fillStyle = "red";
        context.shadowColor = 'black';
        context.shadowBlur = 15;
        context.shadowOffsetX = 9;
        context.shadowOffsetY = 1;
        context.fill();
        context.stroke();
        
		
		var _currentFrame = 0;
		for(var i = 0; i < ranges.length; ++i)
		{
			if(_currentRange === ranges[i].getName())
			{
				_currentFrame = ranges[i].currentFrame();
				//console.log(_currentRange);
			}
		}

		context.drawImage(playerSprite, 
					frames[_currentFrame]._getx(),  
					frames[_currentFrame]._gety(),
					frames[_currentFrame]._getWidth(), 
					frames[_currentFrame]._getHeight(),
					newX, 
					newY, 
					pWidth, 
					pHeight);

		context.restore();
    }

    //HELPER FUNCTIONS
    function possibleCollisionBlocks()
    {
        pColBlocks = []; //Empty Current
        //CHECK IF ITS OFF MAP GRID < 0
        if (onTile.x - 1 <= 0 || onTile.y - 1 <= 0)
        {
            pColBlocks[0] = new Victor(onTile.x, onTile.y);         //Topleft
            pColBlocks[2] = new Victor(onTile.x, onTile.y);         //BotLeft
            pColBlocks[4] = new Victor(onTile.x, onTile.y);         //Left
            pColBlocks[6] = new Victor(onTile.x, onTile.y);         //Above
            pColBlocks[1] = new Victor(onTile.x, onTile.y);         //TopRight
        }
        else
        {
            pColBlocks[1] = new Victor(onTile.x + 1, onTile.y - 1); //TopRight
            pColBlocks[0] = new Victor(onTile.x - 1, onTile.y - 1); //Topleft
            pColBlocks[2] = new Victor(onTile.x - 1, onTile.y + 1); //BotLeft
            pColBlocks[4] = new Victor(onTile.x - 1, onTile.y    ); //Left
            pColBlocks[6] = new Victor(onTile.x,     onTile.y - 1); //Above
        }
        pColBlocks[3] = new Victor(onTile.x + 1, onTile.y + 1);     //BotRight
        pColBlocks[5] = new Victor(onTile.x + 1, onTile.y    );     //Right
        pColBlocks[7] = new Victor(onTile.x,     onTile.y + 1);     //Below
        pColBlocks[8] = new Victor(onTile.x,     onTile.y    );     //Your Current Tile
    }
    function blockCorrection(step)
    {
        x += vx * step;
        center.x = x + 16; center.y = y + 16;

        //Update Potential Collision Blocks 
        possibleCollisionBlocks();

        var collisionCorrection = new Victor(0, 0);
        var temp = new Victor(0, 0);

        for (var i = 0 ; i < 9; i++) {
            if (collsionBlocks[pColBlocks[i].x - 1][pColBlocks[i].y - 1].Type != "0") //RIDICULOUS REFERENCE BUT WORKS GREAT HAHA
            {
                //console.log("****Possible Collision Block Near!****");
                temp = prison.collision.collisionCheck(center, collsionBlocks[pColBlocks[i].x - 1][pColBlocks[i].y - 1]);
                if (Math.abs(temp.x) > Math.abs(collisionCorrection.x) &&
                    Math.abs(temp.x) > Math.abs(collisionCorrection.y)) {
                    collisionCorrection = temp;
                }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrection.x != 0) {
            x += collisionCorrection.x;
        }

        y += vy * step;
        center.x = x + 16;
        center.y = y + 16;

        var collisionCorrection2 = new Victor(0, 0);
        var temp2 = new Victor(0, 0);

        for (var i = 0 ; i < 9; i++) {
            if (collsionBlocks[pColBlocks[i].x - 1][pColBlocks[i].y - 1].Type != "0") //RIDICULOUS REFERENCE BUT WORKS GREAT HAHA
            {
                //console.log("****Possible Collision Block Near!****");
                temp2 = prison.collision.collisionCheck(center, collsionBlocks[pColBlocks[i].x - 1][pColBlocks[i].y - 1]);
                if (Math.abs(temp2.y) > Math.abs(collisionCorrection2.y) &&
                     Math.abs(temp2.y) > Math.abs(collisionCorrection2.x)) {
                    collisionCorrection2 = temp2;
                }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrection2.y != 0) {
            y += collisionCorrection2.y;
        }
    }
    function doorCorrection(step)
    {
        //UPDATE DOOR ARRAY TO COLLIDE WITH
        doors = prison.doors.getDoors();


        //Update Potential Collision Blocks 
        possibleCollisionBlocks();
        var numDoors = prison.map.getNumDoors()

        var collisionCorrection = new Victor(0, 0);
        for (var i = 0 ; i < 9; i++) {
            for(var j = 0 ; j < numDoors; j++) {
                if (pColBlocks[i].x == doors[j].onT.x && pColBlocks[i].y == doors[j].onT.y){
                    doors[j].open = true;//OPEN DOOR
                    collisionCorrection = prison.collision.collisionCheck(center, doors[j]);
                }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrection.x != 0) {
            x += collisionCorrection.x;
        }


        var collisionCorrection2 = new Victor(0, 0);
        for (var i = 0 ; i < 9; i++) {
            for (var j = 0 ; j < numDoors; j++) {
                if (pColBlocks[i].x == doors[j].onT.x && pColBlocks[i].y == doors[j].onT.y) {
                    doors[j].open = true;//OPEN DOOR
                    collisionCorrection2 = prison.collision.collisionCheck(center, doors[j]);
                }
            }
        }
        //IF CORRECTION APPLY IT ...
        if (collisionCorrection2.y != 0) {
           
            y += collisionCorrection2.y;
        }
    }
    function applyDirection()
    {
        if (prison.screens["game-screen"].getPaused()) {
            vx = 0; vy = 0;
        }

        //Update Center Vector
        center.x = x + 16; center.y = y + 16;
        onTile.x = Math.round(center.x / 32); onTile.y = Math.round(center.y / 32);

        //ACCELERATION
        if (controls.left) { if (vx != -pSpeed) { vx -= acceleration;     if (vx < -pSpeed) { vx = -pSpeed } } }
        if (controls.up) { if (vy != -pSpeed) { vy -= acceleration;       if (vx < -pSpeed) { vx = -pSpeed } } }
        if (controls.right) { if (vx != pSpeed) { vx += acceleration;     if (vx > pSpeed) { vx = pSpeed } } }
        if (controls.down) { if (vy != pSpeed) { vy += acceleration; if (vx > pSpeed) { vx = pSpeed } } }

        if (vx < 0) { setRange("WALKLEFT"); }
        if (vy < 0) { setRange("WALKUP"); }
        if (vx > 0) { setRange("WALKRIGHT");}
        if (vy > 0) { setRange("WALKDOWN"); }

        //DECELERATION
        if (slowDown.left) { vx += slowDownSpeed; if (vx > 0) { slowDown.left = false; vx = 0;      setRange("STANDLEFT"); } }
        if (slowDown.up) { vy += slowDownSpeed; if (vy > 0) { slowDown.up = false; vy = 0;          setRange("STANDUP");  } }
        if (slowDown.right) { vx -= slowDownSpeed; if (vx < 0) { slowDown.right = false; vx = 0;    setRange("STANDRIGHT"); } }
        if (slowDown.down) { vy -= slowDownSpeed; if (vy < 0) { slowDown.down = false; vy = 0;      setRange("STANDDOWN"); } }

        //Dont Leave world  or ***WIN GAME IF HITS THE OUTTER SIDES**
        if (x - pWidth / 2 < 0) { x = pWidth / 2; }
        if (y - pHeight / 2 < 0) { y = pHeight / 2; }
        if (x + (pWidth * 1.5) > 3200) { x = 3200 - (pWidth * 1.5); }
        if (y + (pHeight * 1.5) > 3200) { y = 3200 - (pHeight * 1.5); }
    }
    function dPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        var block = 0;
        for(var i = 0 ; i < 9; i ++)
        {
            block++;
            console.log("BLock " +block +" X:" +pColBlocks[i].x + " Y:" + pColBlocks[i].y)
        }
    }

    //ANIMATION
    function setupAnimation()
    {
        var w = 32;
        var h = 32;
        setRangeFrames("", 0, 1);

        addRange("WALKRIGHT", 1, 5)
        addFrame(0,  64, w, h);
        addFrame(32, 64, w, h);
        addFrame(64, 64, w, h);
        addFrame(32, 64, w, h);
        addRange("STANDRIGHT", 4, 5)

        addRange("WALKDOWN", 5, 9)
        addFrame(0,  0, w, h);
        addFrame(32, 0, w, h);
        addFrame(64, 0, w, h);
        addFrame(32, 0, w, h);
        addRange("STANDDOWN", 8, 9)

        addRange("WALKUP", 9, 13)
        addFrame(0,  96, w, h);
        addFrame(32, 96, w, h);
        addFrame(64, 96, w, h);
        addFrame(32, 96, w, h);
        addRange("STANDUP", 12, 13)

        addRange("WALKLEFT", 13, 17)
        addFrame(0,  32, w, h);
        addFrame(32, 32, w, h);
        addFrame(64, 32, w, h);
        addFrame(32, 32, w, h);
        addRange("STANDLEFT", 16, 17)

        setInterval(nextFrame, ANIMATION_RATE);
        console.log("Done Setting Up animation...");
    }
    function addRange(rangeName, start, end)
    {
        ranges.push(new AnimationRange(rangeName, start, end));
        //console.log("added RANGE   " + rangeName);
    }
    function setRange(rangeID)
    {
        for(var i = 0; i < ranges.length; i++)
        {
            if(rangeID === ranges[i].getName())
            {
                _currentRange = ranges[i].getName();
                return;
            }
            
        }
        //console.log("No range of that name..");
    }
    function setRangeFrames(rangeName, start, end)
    {
        for(var i = 0; i < ranges.length; i++)
        {
            if(rangeName == ranges[i].getName())
            {
                ranges[i].setRange(start, end);
                return;
            }
        }
    }
    function nextFrame()
    {
        for(var i = 0; i < ranges.length; i++)
        {
            if(_currentRange == ranges[i].getName())
            {
                var ret = ranges[i].nextFrame();
                return ret;
            }
        }
        console.log("Something broke in the frames mechanism...");
        return 0;
    }
    function addFrame(xPos, yPos, w, h)
    {
        frames.push(new Frame(xPos, yPos, w, h));
        //console.log("Added Frame!");
    }

    //GETTERS SETTERS
    function getX()
    {
        return x;
    }
    function getY()
    {
        return y;
    }
    function getOnTile()
    {
        return onTile;
    }
    function getPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        return pColBlocks;
    }
    function setXY(x,y) {
        x = x;
        y = y;
    }
    function setSpeed(speed)
    {
        pSpeed = speed;
    }
    function setSlowDownSpeed(speed) {
        slowDownSpeed = speed;
    }
    function setVX(vx)
    {
        vx = vx;
    }
    function setVY(vy) {
        vy = vy;
    }
    function getVX()
    {
        return vx;
    }
    function getVY() {
        return vy;
    }
    function getPCenter()
    {
        return center;
    }
    function pLayerHP(health , name, type)
    {
        pHP += health;
        console.log("Ouch " + name + " The " + type + " you Asshole! .. hp: " + pHP);
        if (pHP > 100) {pHP = 100;}
        if (pHP < 0)
        {
            pHP = 0;


        }   //PLAYER DIES TRIGGER DEATH SEQUENCE

       
    }
    function getPLayerHP()
    {
        return pHP;
    }
    function getPlayerOBJ()
    {
            var pCenter = getPCenter();
            var playerTile = getOnTile();
            var X = pCenter - 16;
            var Y = pCenter - 16;
            var Cx = pCenter.x;
            var Cy = pCenter.y;
            pTile =
            {
                X: X,
                Y: Y,
                Cx: Cx,
                Cy: Cy,
                Type: "Player"
            }
            return pTile;
    }
	
    return {
        //EXPOSED FUNCTIONS IN HERE
        setVX           :setVX,
        setVY           :setVY,
        pLayerHP        :pLayerHP,
        getPCenter      :getPCenter,
        getPlayerOBJ    :getPlayerOBJ,
        getOnTile       :getOnTile,
        getVX           :getVX,
        getVY           :getVY,
        getY            :getY,
        getX            :getX,
        setXY           :setXY,
        getPLayerHP     :getPLayerHP,
        setSpeed        :setSpeed,
        setSlowDownSpeed:setSlowDownSpeed,
        run             :run,
        update          :update,
        draw            :draw,
        dPosCB          :dPosCB,
        initialize      :initialize
    };
})();