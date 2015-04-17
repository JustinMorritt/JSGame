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

        playerSprite = new Image();
        playerSprite.addEventListener("load", callback, false);
        playerSprite.src ="Images/$Char.png";

        //GET ARRAY OF COLLISION BLOCKS 
        collsionBlocks = prison.map.getCollisions();


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



        //console.log("On tile: " + onTile.x + " " + onTile.y);
		
		/*Animation
		if(vx === 0)
		{
			range("");
		}
		if(controls.left)
		{
			range("Player Walk Left");
		}
		if(controls.right)
		{
			range("Player Walk Right");
		}
		if(controls.up)
		{
			range("Player Walk Up");
		}
		if(controls.down)
		{
			range("Player Walk Down");
		} */
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
        x += vx * step;
        center.x = x + 16; center.y = y + 16;

        //Update Potential Collision Blocks 
        possibleCollisionBlocks();
        var numDoors = prison.map.getNumDoors()

        var collisionCorrection = new Victor(0, 0);
        for (var i = 0 ; i < 9; i++) {
            for(var j = 0 ; j < numDoors; j++) {
                if (pColBlocks[i].x == doors[j].x && pColBlocks[i].y == doors[j].y) {
                    collisionCorrection = prison.collision.collisionCheck(center, doors[j]);
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
        for (var i = 0 ; i < 9; i++) {
            for (var j = 0 ; j < numDoors; j++) {
                if (pColBlocks[i].x == doors[j].x && pColBlocks[i].y == doors[j].y) {
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
        if (controls.left) { if (vx != -pSpeed) { vx -= acceleration; if (vx < -pSpeed) { vx = -pSpeed } } }
        if (controls.up) { if (vy != -pSpeed) { vy -= acceleration; if (vx < -pSpeed) { vx = -pSpeed } } }
        if (controls.right) { if (vx != pSpeed) { vx += acceleration; if (vx > pSpeed) { vx = pSpeed } } }
        if (controls.down) { if (vy != pSpeed) { vy += acceleration; if (vx > pSpeed) { vx = pSpeed } } }

        //DECELERATION
        if (slowDown.left) { vx += slowDownSpeed; if (vx > 0) { slowDown.left = false; vx = 0 } }
        if (slowDown.up) { vy += slowDownSpeed; if (vy > 0) { slowDown.up = false; vy = 0 } }
        if (slowDown.right) { vx -= slowDownSpeed; if (vx < 0) { slowDown.right = false; vx = 0 } }
        if (slowDown.down) { vy -= slowDownSpeed; if (vy < 0) { slowDown.down = false; vy = 0 } }

        //Dont Leave world  or ***WIN GAME IF HITS THE OUTTER SIDES**
        if (x - pWidth / 2 < 0) { x = pWidth / 2; }
        if (y - pHeight / 2 < 0) { y = pHeight / 2; }
        if (x + (pWidth * 1.5) > 3200) { x = 3200 - (pWidth * 1.5); }
        if (y + (pHeight * 1.5) > 3200) { y = 3200 - (pHeight * 1.5); }
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

        //SHADOW 
        context.beginPath();
        context.rect(newX + 6, newY + 6, 10, 10);
        context.fillStyle = "red";
        context.shadowColor = 'black';
        context.shadowBlur = 15;
        context.shadowOffsetX = 9;
        context.shadowOffsetY = 1;
        context.fill();
        context.stroke();

        //BOXES AROUND HP AND RESP
        context.beginPath(); context.rect(newX - 35, newY - 14, 100, 8); context.stroke();

        context.drawImage(playerSprite, sx, sy, 32, 32, newX, newY, pWidth, pHeight);
		
		/*context.drawImage(playerSprite, 
					_frames[currentFrame]._getx(), 
					_frames[currentFrame]._gety(),
					_frames[currentFrame]._getWidth(), 
					_frames[currentFrame]._getHeight(),
					newX, 
					newY, 
					pWidth, 
					pHeight);*/
        
        context.restore();
        //console.log("DREW PLAYER X:" +x+ " Y: " +y );
		
		/*Animation 
		var currentFrame = 0;
		for(var i = 0; i < _ranges.length; ++i)
		{
			if(_currentRange === _ranges[i].getName())
			{
				currentFrame = _ranges[i].currentFrame();
				//console.log(currentFrame);
			}
		}*/
/*
		context.drawImage(playerSprite, 
					_frames[currentFrame]._getx(), 
					_frames[currentFrame]._gety(),
					_frames[currentFrame]._getWidth(), 
					_frames[currentFrame]._getHeight(),
					newX, 
					newY, 
					pWidth, 
					pHeight);*/
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
    
    function dPosCB()  //DISPLAY POSSIBLE COLLISION BLOCKS
    {
        var block = 0;
        for(var i = 0 ; i < 9; i ++)
        {
            block++;
            console.log("BLock " +block +" X:" +pColBlocks[i].x + " Y:" + pColBlocks[i].y)
        }
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
    function pLayerHP(health)
    {
        pHP += health;
        if (pHP > 100) {pHP = 100;}
        if (pHP < 0) { pHP = 0; }   //PLAYER DIES TRIGGER DEATH SEQUENCE
        //console.log("Ouch you Asshole! .. hp: "  + pHP);
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
	
 /*Character Animation

function playerFrame(xPos, yPos, w, h)
{
	var _x = xPos;
	var _y = yPos;
	var _width = w;
	var _height = h;

	function _getX()
	{
		return _x;
	};

	function _getY()
	{
		return _y;
	};

	function _getWidth()
	{
		return _width;  
	};

	function _getHeight()
	{
		return _height;
	};
};

function AnimationRange(rangeName, first, end)
{
	if(end <= first)
	{
		console.log("End less than first: Range not changed.");
		return;
	}
	
	var _name = rangeName;
	var _first = first;
	var _end = end;

	var _currentFrame = _first;

	function setRange(first, end)
	{
		if(end <= first)
		{
			console.log("End less than first: Range not changed.");
			return;
		}
		_first = first
		_end = end;
	};
	
	//function setRange(rangeID)
	//{
	//	setRange(rangeID);
	//};

	function getEnd()
	{
		return _end;
	};

	function getFirst()
	{
		return _first;
	};

	function getName()
	{
		return _name;
	};

	function currentFrame()
	{
		return _currentFrame;
	};

	function nextFrame()
	{
		//console.log("Before: " + _currentFrame);    
		++_currentFrame;
		
		if(_currentFrame == _end)
		{
			_currentFrame = _first;
		}
		//console.log("After: " + _currentFrame);    
		return _currentFrame;
	};
};

var _frames = new Array();
_frames.push(new playerFrame(sx, sy, 32, 32));

var _ranges = new Array();
_ranges.push(new AnimationRange("", 0, 1));

var _currentRange = "";

function addRange(rangeName, start, end)
{
	_ranges.push(new AnimationRange(rangeName, start, end));
};  

function range(rangeId)
{
	for(var i = 0; i < _ranges.length; ++i)
	{
		if(rangeId === _ranges[i].getName())
		{
			_currentRange = _ranges[i].getName();
			//_ranges[i].resetCurrentFrame();
		}
	}
};

function setRangeFrames(rangeName, start, end)
{
	for(var i = 0; i < _ranges.length; ++i)
	{
		if(rangeName == _ranges[i].getName())
		{
			_ranges[i].setRange(start, end);
			return;
		}
	}    
}

function Frame()
{
	for(var i = 0; i < _ranges.length; ++i)
	{
		if(_currentRange == _ranges[i].getName())
		{
			var ret = _ranges[i].nextFrame()
			return ret;
		}
	}
	console.log("Something broken in the frames mechanism");
	return 0;
};

function addFrame(xPos, yPos, w, h)
{
	_frames.push(new playerFrame(xPos, yPos, w, h));
};

//setRangeFrames("", 0, 1);

addRange("Player Walk Left", 1, 4);
addFrame(0, 65, 32, 32);
addFrame(33, 64, 32, 32);
addFrame(65, 65, 32, 32);

addRange("Player Walk Right", 4, 7);
addFrame(0, 65, 32, 32);
addFrame(33, 64, 32, 32);
addFrame(65, 65, 32, 32);

addRange("Player Walk Up", 7, 10);
addFrame(0, 65, 32, 32);
addFrame(33, 64, 32, 32);
addFrame(65, 65, 32, 32);

addRange("Player Walk Down", 10, 13);
addFrame(0, 65, 32, 32);
addFrame(33, 64, 32, 32);
addFrame(65, 65, 32, 32);
*/


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