﻿prison.display = (function () {

    var cursor, canvas, ctx,
        cols, rows,
        mapWidth, mapHeight,
        prisonSize,
        prisons,
        prisonSprite,
        firstRun = true,
        player,
        runningId = -1,
        camera, xDeadZone, yDeadZone,

    FPS = 30,
    INTERVAL = 1000 / FPS,
    STEP = INTERVAL / 1000,

    /*
    room = {
        width: 5000,
        height: 3000,
        map: new Game.Map(5000, 3000)
    };
    */

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
        mapWidth = 3200;
        mapHeight = 3200;
        xDeadZone = canvas.width / 2;
        yDeadZone = canvas.height / 2;


        mapElement.appendChild(createBackground());
        mapElement.appendChild(canvas);

       


        console.log("attempting to run player");
		map.run();
        player.run();
        
   
        //console.log("DEADZONES FOR CAMERA: x:" + xDeadZone + " y:" + yDeadZone);
        camera.initialize(0, 0, canvas.width, canvas.height, mapWidth, mapHeight);
       


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
        //ctx.drawImage(prisonSprite, 0,  0,  mapWidth,   mapHeight,  0,  0,  mapWidth,   mapHeight);

        map.drawMap(ctx);
        player.draw(STEP, ctx, 90, 90);

        


        ctx.restore();
    }

    function update()
    {
        player.update(STEP, mapWidth, mapHeight);
       // camera.update();
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
        getxDeadZone: getxDeadZone,
        getyDeadZone: getyDeadZone,
        initialize: initialize
    };

})();