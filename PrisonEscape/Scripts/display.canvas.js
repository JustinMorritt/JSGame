﻿prison.display = (function () {

    var cursor, canvas, ctx,
        cols, rows,
        constMapWidth, constMapHeight,
        mapWidth, mapHeight,
        prisonSize,
        prisons,
        prisonSprite,
        firstRun = true,
        player,
        runningId = -1,
        camera, xDeadZone, yDeadZone,
        canvasWidth, canvasHeight,
       

    FPS = 30,
    INTERVAL = 1000 / FPS,
    STEP = INTERVAL / 1000,

		map,

        previousCycle,
        animations = [];

    function setup() {
        var $ = prison.dom.$,
        mapElement = $("#game-screen .game-map")[0];
        cols = prison.settings.cols;
        rows = prison.settings.rows;
        player = prison.player;
        camera = prison.camera;
		map = prison.map;
		
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        prison.dom.addClass(canvas, "map");

        var rect = mapElement.getBoundingClientRect();

        prisonSize = 32;
        canvas.width = prisonSize * 30; //512 for 8x8 
        canvas.height = prisonSize * 20;

        //prisonSize = rect.width / cols;
        constMapWidth = 3200;
        constMapHeight = 3200;
        mapWidth = 3200;
        mapHeight = 3200;
        xDeadZone = canvas.width / 2;
        yDeadZone = canvas.height / 2;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        mapElement.appendChild(createBackground());
        mapElement.appendChild(canvas);

       


        console.log("attempting to run player");

        map.run();
        player.run();
        
   
        //console.log("DEADZONES FOR CAMERA: x:" + xDeadZone + " y:" + yDeadZone);
        camera.initialize(canvas.width, canvas.height, constMapWidth, constMapHeight);
       


        //previousCycle = Date.now();   //ANIMATION
        //requestAnimationFrame(cycle);


        //createBackground();

        
        play();

        console.log("Canvas Setup Complete");
    }

    function initialize() {
        console.log("====Attempting Canvas setup====");
        if (firstRun) {
        

            prisonSprite = new Image();
          //  prisonSprite.addEventListener(
            //    "load", callback, false);

            prisonSprite.src =
                "Images/map.png";
            console.log("Initialized prison Map");



            setup();
  
            firstRun = false;
        } else {
            callback();
        }
    }

    //ANIMATION // GAME LOOP==============================
    function cycle() {
        var now = Date.now();


        //ANIMATIONS HERE======================
        if (animations.length === 0) {
            renderCursor(now);
        }
        renderAnimations(now, previousCycle);

        //=====================================


        previousCycle = now;
        requestAnimationFrame(cycle);
    }
    function addAnimation(runTime, fncs) {
        var anim = {
            runTime: runTime,
            startTime: Date.now(),
            pos: 0,
            fncs: fncs
        };
        animations.push(anim);
    }
    function renderAnimations(time, lastTime) {
        var anims = animations.slice(0), //copy's list
            n = anims.length,
            animTime,
            anim;

        //call before() function
        for (var i = 0; i < n; i++) {
            anim = anims[i];
            if (anim.fncs.before) {
                anim.fncs.before(anim.pos);
            }
            anim.lastPos = anim.pos;
            animTime = (lastTime - anim.startTime);
            anim.pos = animTime / anim.runTime;
            anim.pos = Math.max(0, Math.min(1, anim.pos));
        }

        animations = []; //---------------reset animation list

        for (var i = 0; i < n ; i++) {
            anim = anims[i];
            anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
            if (anim.pos == 1) {
                if (anim.fncs.done) {
                    anim.fncs.done();
                }
            } else {
                animations.push(anim);
            }
        }
    }



    function gameLoop()
    {
        update();
        draw();
    }

    function draw() {
        ctx.save();
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //context.drawImage(img,    sx, sy, swidth,     sheight,    dx, dy, dwidth,     dheight);

        //REDRAW ALL OBJECTS
        //map.draw(context, camera.xView, camera.yView);
        var sx = camera.getXView();
        var sy = camera.getYView();

        //ctx.drawImage(prisonSprite, 0,  0,  mapWidth,   mapHeight,  0,  0,  mapWidth,   mapHeight);

        
        //player.draw(STEP, ctx, 90, 90);

        if (sx < 0)
        {
            sx = 0;
        }

        if (sy < 0)
        {
            sy = 0;
        }
      
        if (3200 - sx < 3200)
        {
            mapWidth = 3200 - sx;
        }
        if (3200 - sy < 3200)
        {
            mapHeight = 3200 - sy;
        }

        //console.log("VIEWS: " + sx + " " + sy);

  
        ctx.drawImage(prisonSprite, sx, sy, mapWidth, mapHeight, 0, 0, mapWidth, mapHeight);
        //map.drawMap(ctx);
        player.draw(STEP, ctx, sx, sy);

        ctx.restore();
    }

    function update()
    {
        player.update(STEP, 3200, 3200);
        camera.update();
    }

    //====================================================

    function getxDeadZone()
    {
        return xDeadZone;
    }
    function getyDeadZone()
    {
        return yDeadZone;
    }
    function getCanvasWidth()
    {
        return canvasWidth;
    }
    function getCanvasHeight()
    {
        return canvasHeight;
    }


    function createBackground() {
        var background = document.createElement("canvas"),
            bgctx = background.getContext("2d");

        prison.dom.addClass(background, "background");

        background.width = 3200;
        background.height = 3200;

        bgctx.fillStyle = "rgba(255,235,255,1)";
        for (var x = 0; x < 100 ; x++) {
            for (var y = 0; y < 100 ; y++) {
                if ((x + y) % 2) {
                    bgctx.fillRect(x * 64, y * 64, 64, 64);
                }
            }
        }
        return background;
    }

    function play()
    {
        if (runningId == -1) {
            runningId = setInterval(function () {
                gameLoop();
            }, INTERVAL);

            console.log("----===playing!===----");
        }
    }

    function togglePause()
    {
        if (runningId == -1) {
            Game.play();
        }
        else {
            clearInterval(runningId);
            runningId = -1;
            console.log("paused");
        }
    }

    return {
        getCanvasWidth: getCanvasWidth,
        getCanvasHeight: getCanvasHeight,
        getxDeadZone: getxDeadZone,
        getyDeadZone: getyDeadZone,
        initialize: initialize
    };

})();